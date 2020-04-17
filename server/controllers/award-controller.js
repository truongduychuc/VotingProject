const {
  user: User,
  awardDetail: Award,
  finalResult: Winner,
  nominee: Nominee,
  role: Role,
  voter: Voter,
  votingBreakdown: Breakdown,
  awardType: AwardType,
  sequelize
} = require('../models');
const Op = require('sequelize').Op;
const rpcClient = require('../helpers/multichain-node');
const {HTTP, user: userConstants} = require('../helpers/constants');
const {asyncForEach} = require('../utils');
const winston = require('../config/winston');
const logger = require('../helpers/logging')(__filename, winston);

/**@api 'awards/create'
 * Create a new award, only used by admin account
 * @param {Object} req
 * @param {Object} res
 */
async function store(req, res) {
  // we use the unmanaged transaction then manually rollback and commit them
  const transaction = await sequelize.transaction();
  try {
    const awardData = {
      description: req.body.description,
      year: req.body.year,
      status: true,
      date_start: req.body.date_start,
      date_end: req.body.date_end,
      prize: req.body.prize,
      item: req.body.item
    };

    const check = () => !(req.body.type === 0 || req.body.type === '' || req.body.type == null);
    let awardType = {};
    if (!check()) {
      awardType = await AwardType.create({name: req.body.name}, {transaction});
    } else {
      awardType = await AwardType.findByPk(req.body.type);
    }
    const newAward = await awardType.createAward(awardData, {transaction});
    let streamName = 'award_' + newAward.id;
    let assetName = 'asset_' + newAward.id;
    let tokenName = 'token_' + newAward.id;

    await rpcClient.createStream(streamName);
    logger.info('store: Created award stream ' + streamName + ' successfully');
    await rpcClient.subscribe(streamName);
    logger.info('store: Subscribe to award stream ' + streamName + ' successfully');
    await rpcClient.publishInformation(streamName, {
      id: newAward.id,
      name: newAward.name,
      date_start: newAward.date_start,
      date_end: newAward.date_end,
      created_at: newAward.createdAt,
      updated_at: newAward.updatedAt
    });
    logger.info('store: Publish award information successfully');
    // find voter by using role_id sent from request
    const voterRoles = req.body.id_role_voter;
    const voters = await User.findAll({
      where: {
        id_role: {
          [Op.in]: voterRoles
        },
        is_active: true
      }
    });
    const voterAmount = voters.length < 50 ? 50 : voters.length;
    // get a new address, this address will be used as a sender
    // this sender will send token to all available voters
    // set token asset in multichain
    // create a token asset
    const senderAddress = await rpcClient.setAsset(streamName, assetName, tokenName, voterAmount);
    // add voter data

    for (let voter of voters) {
      const voterMultichainData = {
        id_user: voter.id,
        first_name: voter.first_name,
        last_name: voter.last_name,
        english_name: voter.english_name
      };
      await rpcClient.sendTokenToVoter(streamName, senderAddress, tokenName, voterMultichainData);
      await newAward.addVoter(voter, {through: {vote_status: true}, transaction});
    }
    // add nominee data
    const nomineeList = await User.findAll({
      where: {
        id: {
          [Op.in]: req.body.id_nominee
        },
        is_active: true
      }
    });

    await asyncForEach(nomineeList, async (nominee, idx) => {
      const nomineeMultichainData = {
        id: nominee.id,
        first_name: nominee.first_name,
        last_name: nominee.last_name,
        english_name: nominee.english_name
      };
      // save nominee to block chain
      await rpcClient.setNominee(streamName, nomineeMultichainData);
      await rpcClient.setNomineeVote(streamName, nomineeMultichainData);
      logger.info('store: Finished setting nominee ' + nomineeMultichainData.id);
      // add breakdown initial data to database
      const newBreakdown = {
        rank: idx + 1,
        id_nominee: nominee.id
      };
      //save new breakdown
      await newAward.createBreakdown(newBreakdown, {transaction});
      await newAward.addNominee(nominee, {through: {id_team: nominee.id_team}, transaction});
    });

    await transaction.commit();
    return res.status(HTTP.OK).json({data: newAward, message: 'Created award successfully'});
  } catch (e) {
    await transaction.rollback();
    logger.error(e);
    let debug = {};
    if (process.env.NODE_ENV !== 'production') {
      debug = {
        instanceOf: Object.getPrototypeOf(e).toString()
      }
    }
    return res.status(HTTP.SERVER_ERROR).json({
      error: e
    });
  }
}

module.exports = {
  store
};
