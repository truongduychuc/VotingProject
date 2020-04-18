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
const awardCreatingQueue = require('../queue').awardCreatingQueue;

awardCreatingQueue.on('completed', function () {
  logger.info('Finished handling creating award');
});
awardCreatingQueue.on('failed', function (job, error) {
  logger.error(error);
  console.log('just failed creating award');
});
awardCreatingQueue.on('progress', function () {
  logger.info('Handling creating award job');
});
awardCreatingQueue.process(async function (job, done) {
  const t = await sequelize.transaction();
  try {
    const {awardId, voterRoles, nomineeIds} = job.data;
    const newAward = await Award.findByPk(awardId);

    const voters = await User.findAll({
      where: {
        id_role: {
          [Op.in]: voterRoles
        },
        is_active: true
      }
    });
    await newAward.addVoters(voters, {through: {vote_status: true}, transaction: t});

    let streamName = 'award_' + newAward.id;
    let assetName = 'asset_' + newAward.id;
    let tokenName = 'token_' + newAward.id;
    await rpcClient.createStream(streamName);
    await rpcClient.subscribe(streamName);
    await rpcClient.publishInformation(streamName, {
      id: newAward.id,
      name: newAward.name,
      date_start: newAward.date_start,
      date_end: newAward.date_end,
      created_at: newAward.createdAt,
      updated_at: newAward.updatedAt
    });
    // add nominee data
    const nomineeList = await User.findAll({
      where: {
        id: {
          [Op.in]: nomineeIds
        },
        is_active: true
      }
    });


    const voterAmount = voters.length < 50 ? 50 : voters.length;
    const senderAddress = await rpcClient.setAsset(streamName, assetName, tokenName, voterAmount);
    for (let voter of voters) {
      const voterMultichainData = {
        id_user: voter.id,
        first_name: voter.first_name,
        last_name: voter.last_name,
        english_name: voter.english_name
      };
      // asynchronously running
      await rpcClient.sendTokenToVoter(streamName, senderAddress, tokenName, voterMultichainData);
    }

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
      // add breakdown initial data to database
      const newBreakdown = {
        rank: idx + 1,
        id_nominee: nominee.id
      };
      //save new breakdown
      await newAward.createBreakdown(newBreakdown, {transaction: t});
      await newAward.addNominee(nominee, {through: {id_team: nominee.id_team}, transaction: t});
    });
    await t.commit();
    done(null, newAward);
  } catch (e) {
    await t.rollback();
    done(e);
  }
});

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
    const jobData = {
      voterRoles: req.body.id_role_voter,
      awardId: newAward.id,
      nomineeIds: req.body.id_nominee
    };
    await awardCreatingQueue.add(jobData);
    console.log('new award' + JSON.stringify(newAward));
    console.log('added queue');
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
   res.status(HTTP.SERVER_ERROR).json({
      error: e,
      ...debug
    });
  }
}

module.exports = {
  store
};
