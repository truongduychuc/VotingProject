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
const {
  getPercent,
  shouldSwap,
  getTotalPoints,
  nomineeComparator
} = require('../helpers/voting');

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
    logger.info(JSON.stringify(newAward));

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
    logger.info('Added an award to queue' + JSON.stringify(jobData));
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

function list(req, res) {
  const includingType = req.query.hasOwnProperty('includingType') ? getBooleanParams(req.query.includingType) : true;
  const responseStreams = [
    Award.findAll({
      include: [{
        model: AwardType,
        required: true,
        attributes: ['name'],
      }],
      order: [
        ['date_start', 'DESC']
      ],
    })
  ];
  if (includingType) {
    responseStreams.push(AwardType.findAll())
  }

  return Promise.all(responseStreams).then(values => {
    const data = {
      awards: values[0]
    };
    if (includingType) {
      data.types = values[1];
    }
    res.status(HTTP.OK).json(data);
  }).catch(error => {
    res.status(HTTP.SERVER_ERROR).json({
      message: error.message,
      error
    })
  });
}

function findAnAward(req, res) {
  Award.findOne({
    where: {
      type: req.body.type
    },
    order: [
      ['year', 'DESC']
    ]
  })
    .then(award => {
      if (award) {
        res.status(HTTP.OK).json({award});
      } else {
        res.status(HTTP.NOT_FOUND).json({
          message: 'No award found'
        });
      }
    })
    .catch(err => {
      res.status(400).send({message: err});
    })
}

/**
 * */
async function getAwardForVoting(req, res) {
  try {
    const today = new Date();
    const awards = await Award.findAll({
      where: {
        status: {
          [Op.gte]: 1,
        }
      },
      attributes: ['id', 'year', 'logo_url', 'status'],
      include: [{
        model: AwardType,
        attributes: ['name'],
      }]
    });
    for (let award of awards) {
      if (award.status === 1 && award.date_start <= today) {
        // start award
        award.status = 2;
        await award.save();
      }

      // end award
      if (award.status === 2 && award.date_end <= today) {
        award.status = 0;
        await award.save();
      }
    }
    const results = awards.filter(award => award.status === 2);
    return res.status(HTTP.OK).json({data: results});
  } catch (e) {
    logger.info(e);
    return res.status(HTTP.SERVER_ERROR).json({message: e});
  }
}

function getBooleanParams(param) {
  if (typeof param !== 'string') {
    return param;
  } else {
    if (param == 'true') {
      return true;
    } else if (param == 'false') {
      return false;
    }
  }
}


/**
 * get scores from multichain and publish to database
 * */
function updateResult(req, res) {
  return updateAwardResult(req.body.id).then(breakdowns => {
    res.status(HTTP.OK).json({
      message: 'Update result successfully'
    })
  }).catch(e => {
    res.status(HTTP.SERVER_ERROR).json({
      message: e
    });
  });
}

function showAwardInfo(req, res) {
  Award.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: AwardType,
      required: true,
      attributes: ['name'],
    }],
  })
    .then(award => {
      if (!award) {
        res.status(HTTP.NOT_FOUND).send({message: 'Award does not exist'});
      } else {
        res.status(HTTP.OK).send({
          data: award
        });
      }
    })
    .catch(err => {
      res.status(HTTP.SERVER_ERROR).send({message: err});
    })
}

function getAwardTypes(req, res) {
  AwardType.findAll()
    .then(types => {
      res.status(HTTP.OK).json({types});
    })
    .catch(err => {
      res.status(HTTP.SERVER_ERROR).json({message: 'Error when get type of award', error: err});
    })
}

async function updateAwardResult(awardId) {
  const transaction = await sequelize.transaction();
  try {
    const breakdowns = await Breakdown.findAll({
      where: {
        id_award: awardId
      }
    });
    // we will use a clone ranking to re arrange and avoid some people having same votes record have to suffer the lower rank
    // this table will bring only unique records of breakdown, and the references of same having votes record
    const rankingTable = [];
    const addToRankingTable = (table, sample) => {
      // check the ranking table to find out who has the same total and all rest of votes
      const sameRankRecord = table.find(record => nomineeComparator(sample, record) === 0);
      if (sameRankRecord) {
        sameRankRecord.sameRankReferences.push(sample.id);
      } else {
        table.push(sample);
      }
    };
    const putRankAndPercent = (breakdown, rank, percent) => {
      breakdown.rank = rank;
      breakdown.percent = percent;
      return breakdown;
    };
    // taking result from multichain and sync to db
    for (let breakdown of breakdowns) {
      const nomineeId = breakdown.id_nominee;
      const {first_votes, second_votes, third_votes} = await rpcClient.getNomineeVotingScores(awardId, nomineeId);
      const totalPoints = getTotalPoints(first_votes, second_votes, third_votes);
      breakdown.first_votes = first_votes;
      breakdown.second_votes = second_votes;
      breakdown.third_votes = third_votes;
      breakdown.total_points = totalPoints;

      const sample = {
        id: breakdown.id,
        first_votes,
        second_votes,
        third_votes,
        total_points: totalPoints,
        sameRankReferences: []
      };
      addToRankingTable(rankingTable, sample);
    }
    const awardTotalPoints = breakdowns.map(b => b.total_points).reduce((prev, cur) => prev + cur, 0);
    rankingTable.sort(shouldSwap);
    let rank = 1;
    for (let ranking of rankingTable) {
      const breakdown = breakdowns.find(b => b.id === ranking.id);
      putRankAndPercent(breakdown, rank, getPercent(breakdown.total_points, awardTotalPoints));
      await breakdown.save({transaction});
      // only saved id previously
      if (ranking.sameRankReferences.length > 0) {
        for (let ref of ranking.sameRankReferences) {
          const sameRankReference = breakdowns.find(b => b.id === ref);
          if (sameRankReference) {
            putRankAndPercent(sameRankReference, rank, getPercent(sameRankReference.total_points, awardTotalPoints));
            await sameRankReference.save({transaction});
          }
        }
      }
      rank++;
    }
    await transaction.commit();
    return breakdowns;
  } catch (e) {
    console.log(e);
    await transaction.rollback();
    throw e;
  }
}


module.exports = {
  store,
  list,
  findAnAward,
  getAwardForVoting,
  updateResult,
  showAwardInfo,
  getAwardTypes,
  updateAwardResult
};
