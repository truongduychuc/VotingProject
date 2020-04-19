const express = require('express');
const router = express.Router();
const multer = require('multer');
const cors = require('cors');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const CronJob = require('cron').CronJob;
const transporter = require('../helpers/transporter');


const authorize = require('../helpers/authorize');
const {
  createAwardRequest
} = require('../middlewares/validations');

const {
  user: User,
  awardDetail: Award,
  finalResult: Winner,
  role: Role,
  voter: Voter,
  votingBreakdown: Breakdown,
  awardType: Award_type
} = require('../models');

const {AwardController} = require('../controllers');
const multichain = require('../helpers/multichain');
const {catchValidationRequest} = require('../middlewares');
const {HTTP} = require('../helpers/constants');


router.use(cors());
router.use(authorize());

var moment = require('moment');

/*
API
/awards

createAward(admin): (post) /create
listAward: (get) /list
updateAward(admin): (put) /update/:id
uploadLogo(admin): (post) /upload_logo/:id
getAwardInfo: (get) /info/:id
getPastWinner: (get) /past_winner/:id
getRankingBreakdown: (get) /breakdown/:id
getTypeOfAward: (get) /award_type
findAnAward: (get) /find_an_award
voting: (post) /voting_award
updateResult: (post) /update_result
finishAward: (post) /finish_award

deleteAward(admin): (post) /delete/:id (not done)



/awardStatus:
0: finished
1: not taking place
2: in progress

*/


//CREATE AN AWARD
router.post('/create', createAwardRequest, catchValidationRequest, AwardController.store);
//LIST
router.get('/list', AwardController.list)


//UPDATE AWARD INFORMATION
router.put('/update/:id', (req, res) => {
  const today = new Date();

  function checkDateInput() {
    if (req.body.date_start > req.body.date_end) {
      res.status(400).send({message: 'End date must be greater than start day'});
      return false;
    } else {
      var con = moment(req.body.date_start).isBefore(today);
      if (con) {
        res.status(400).send({message: 'Start date must be greater than today'});
        return false;
      } else {
        return true;
      }
    }
  }

  if (!checkDateInput()) {
    console.log('Date input wrong');
  } else {
    Award.update({
      description: req.body.description,
      prize: req.body.prize,
      item: req.body.item,
    }, {
      where: {
        id: req.params.id
      }
    })
      .then(() => {
        res.status(200).send({message: 'Updated successfully'});
      })
      .catch(err => {
        res.status(400).send({message: err});
      })
  }

});

//UPLOAD LOGO
const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    cb(null, './uploads/logos')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post('/upload_logo/:id', upload.single('logo'), (req, res, next) => {
  console.log(req.file);
  if (req.file === undefined) {
    res.status(404).send({message: 'Wrong type input'})
  } else {
    Award.update({
      logo_url: req.file.path
    }, {
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.status(200).send({message: 'Uploaded logo successfully', path: req.file.path});
    }).catch(err => {
      res.status(400).send('err' + err);
    })
  }

});

//DISPLAY AWARD
router.get('/info/:id', AwardController.showAwardInfo);

//WINNER
router.post('/winner', (req, res) => {
  Winner.findOne({
    where: {
      id_award: req.body.id_award
    },
    include: [{
      model: User,
      as: 'winner_name',
      attributes: ['first_name', 'last_name', 'english_name', 'ava_url']
    }]
  })
    .then(winner => {
      if (!winner) {
        res.status(400).json({message: 'This award has not had winner yet!'});
      } else {
        res.status(200).json({data: winner});
      }
    })
    .catch(err => {
      res.status(400).json({message: err});
    })
});


//PAST WINNER
router.get('/past_winner/:id', (req, res) => {
  let col = 'year';
  let type = 'DESC';
  let table = 'awardDetail';
  if ((req.query.col != null && req.query.type != null) && (req.query.type != '' && req.query.col != '')) {
    col = req.query.col;
    type = req.query.type;
  }
  if (req.query.table != null && req.query.table != '') {
    table = req.query.table;
  }
  Award.findOne({
    where: {
      id: req.params.id,
    }
  })
    .then(award => {
      if (!award) {
        res.status(HTTP.NOT_FOUND).json({message: 'Award does not exist'});
      } else {
        if (table == 'awardDetail') {
          Award.findAll({
            where: {
              type: award.type,
              status: 0,
              year: {
                [Op.lt]: award.year
              }
            },
            attributes: ['id', 'year'],
            include: [{
              model: Winner,
              as: 'winner',
              attributes: ['id_winner', 'percent'],
              include: [{
                model: User,
                as: 'winner_name',
                attributes: ['first_name', 'last_name', 'english_name']
              }]
            }],
            order: [
              [col, type]
            ]
          })
            .then(awards => {
              res.status(HTTP.OK).json({data: awards});
            })
            .catch(err => {
              res.status(HTTP.SERVER_ERROR).json({message: err});
            })
        } else {
          //table: finalResult -> winner, user -> winner_name
          if (table == 'winner') {
            Award.findAll({
              where: {
                status: 0,
                type: award.type,
                year: {
                  [Op.lt]: award.year
                }
              },
              attributes: ['id', 'year'],
              include: [{
                model: Winner,
                as: 'winner',
                attributes: ['id_winner', 'percent'],
                include: [{
                  model: User,
                  as: 'name',
                  attributes: ['first_name', 'last_name', 'english_name']
                }]
              }],
              order: [
                [table, col, type]
              ]
            })
              .then(awards => {
                if (awards.length == 0) {
                  res.status(400).json({message: 'There is no winner'});
                } else {
                  res.status(200).json({data: awards});
                }
              })
              .catch(err => {
                res.status(400).json({message: err});
              })
          } else {
            if (table == 'winner_name') {
              Award.findAll({
                where: {
                  status: 0,
                  type: award.type,
                  year: {
                    [Op.lt]: award.year
                  }
                },
                attributes: ['id', 'year'],
                include: [{
                  model: Winner,
                  as: 'winner',
                  attributes: ['id_winner', 'percent'],
                  include: [{
                    model: User,
                    as: 'winner_name',
                    attributes: ['first_name', 'last_name', 'english_name']
                  }]
                }],
                order: [
                  ['winner', table, col, type]
                ]
              })
                .then(awards => {
                  if (awards.length == 0) {
                    res.status(400).json({message: 'There is no winner'});
                  } else {
                    res.status(200).json({data: awards});
                  }
                })
                .catch(err => {
                  res.status(400).json({message: err});
                })
            } else {
              res.status(400).json({message: 'Wrong table'});
            }
          }
        }
        // }
      }
    })
    .catch(err => {
      res.status(400).json({message: err});
    })
})

//RANKING BREAKDOWN
router.get('/breakdown/:id', (req, res) => {
  let limit = 10; //number of records per page
  let page = 1;
  let col = 'rank';
  let type = 'ASC';
  let table = 'votingBreakdown';
  if (req.query.count != null && req.query.count != '') {
    limit = parseInt(req.query.count);
  }
  if (req.query.page != null && req.query.page != '') {
    page = parseInt(req.query.page);
  }
  if ((req.query.col != null && req.query.type != null) && (req.query.type != '' && req.query.col != '')) {
    col = req.query.col;
    type = req.query.type;
  }
  if (req.query.table != null && req.query.table != '') {
    table = req.query.table;
  }

  //Search
  let search = req.query.search;

  //Check award is taking place or not
  Award.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(result => {
      let status = result.status;
      Role.findOne({
        where: {
          id: req.decoded.id_role
        }
      })
        .then(role => {
          if (status === 2 && role.id !== 1) {
            return res.status(401).json({message: 'Unauthorized'});
          } else {
            Breakdown.findAndCountAll({
              where: {
                id_award: req.params.id
              },
            })
              .then(data => {
                if (data.count == 0) {
                  res.status(400).send({message: 'There is no result', total_counts: data.count});
                }
                // data.count != 0
                else {
                  //Check search box
                  if ((search == '') || (search == null)) {
                    // if (search == '') {
                    let pages = Math.ceil(data.count / limit);
                    offset = limit * (page - 1);
                    //Check if page number input is greater than real total pages
                    if (page > pages) {
                      offset = limit * (pages - 1);
                    }
                    if (table == 'votingBreakdown') {
                      Breakdown.findAll({
                        where: {
                          id_award: req.params.id
                        },
                        include: [{
                          model: User,
                          as: 'nominee_name',
                          attributes: ['first_name', 'last_name', 'english_name']
                        }],
                        order: [
                          [col, type]
                        ],
                        limit: limit,
                        offset: offset,
                      }).then(breakdown => {
                        if (breakdown.length == 0) {
                          res.status(400).send({message: 'There is no result'});
                        } else {
                          res.status(200).json({
                            'data': breakdown,
                            'total_counts': data.count,
                            'offset': offset,
                            'limit': limit,
                            'pages': pages
                          });
                        }
                      })
                        .catch(err => {
                          res.status(400).send({message: err});
                        })
                    } else {
                      //table user -> nominee_name
                      if (table == 'nominee_name') {
                        Breakdown.findAll({
                          where: {
                            id_award: req.params.id
                          },
                          include: [{
                            model: User,
                            as: 'nominee_name',
                            attributes: ['first_name', 'last_name', 'english_name']
                          }],
                          order: [
                            [table, col, type]
                          ],
                          limit: limit,
                          offset: offset,
                        }).then(breakdown => {
                          if (breakdown.length == 0) {
                            res.status(400).send({message: 'There is no result'});
                          } else {
                            res.status(200).json({
                              'data': breakdown,
                              'total_counts': data.count,
                              'offset': offset,
                              'limit': limit,
                              'pages': pages
                            });
                          }
                        })
                          .catch(err => {
                            res.status(400).send({message: err});
                          })
                      } else {
                        res.status(400).send({message: 'Wrong table'});
                      }
                    }
                  } else {
                    // search != '' && search != null
                    Breakdown.findAndCountAll({
                      where: {
                        id_award: req.params.id,
                        [Op.or]: [{
                          rank: {
                            [Op.like]: '%' + search + '%'
                          }
                        },
                          {
                            first_votes: {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            second_votes: {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            third_votes: {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            total_points: {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            '$nominee_name.first_name$': {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            '$nominee_name.last_name$': {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            '$nominee_name.english_name$': {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                        ]
                      },
                      include: [{
                        model: User,
                        as: 'nominee_name'
                      }],
                    })
                      .then(data1 => {
                        if (data1.count == 0) {
                          res.status(400).send({message: 'There is no result', count: data1.count});
                        } else {
                          let pages = Math.ceil(data1.count / limit);
                          offset = limit * (page - 1);
                          //Check if page number input is greater than real total pages
                          if (page > pages) {
                            offset = limit * (pages - 1);
                          }
                          //console.log(data1, page, pages, offset, limit);
                          if (table == 'votingBreakdown') {
                            Breakdown.findAll({
                              where: {
                                id_award: req.params.id,
                                [Op.or]: [{
                                  rank: {
                                    [Op.like]: '%' + search + '%'
                                  }
                                },
                                  {
                                    first_votes: {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                  {
                                    second_votes: {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                  {
                                    third_votes: {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                  {
                                    total_points: {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                  {
                                    '$nominee_name.first_name$': {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                  {
                                    '$nominee_name.last_name$': {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                  {
                                    '$nominee_name.english_name$': {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                ]
                              },
                              include: [{
                                model: User,
                                as: 'nominee_name',
                                attributes: ['first_name', 'last_name', 'english_name']
                              }],
                              order: [
                                [col, type]
                              ],
                              limit: limit,
                              offset: offset,
                            }).then(breakdown => {
                              if (breakdown.length == 0) {
                                res.status(400).send({message: 'There is no result'});
                              } else {
                                res.status(200).json({
                                  'data': breakdown,
                                  'total_counts': data.count,
                                  'filtered_counts': data1.count,
                                  'offset': offset,
                                  'limit': limit,
                                  'pages': pages
                                });
                              }
                            })
                              .catch(err => {
                                res.status(400).send({message: err});
                              })
                          } else {
                            //table user -> nominee_name
                            if (table == 'nominee_name') {
                              Breakdown.findAll({
                                where: {
                                  id_award: req.params.id,
                                  [Op.or]: [{
                                    rank: {
                                      [Op.like]: '%' + search + '%'
                                    }
                                  },
                                    {
                                      first_votes: {
                                        [Op.like]: '%' + search + '%'
                                      }
                                    },
                                    {
                                      second_votes: {
                                        [Op.like]: '%' + search + '%'
                                      }
                                    },
                                    {
                                      third_votes: {
                                        [Op.like]: '%' + search + '%'
                                      }
                                    },
                                    {
                                      total_points: {
                                        [Op.like]: '%' + search + '%'
                                      }
                                    },
                                    {
                                      '$nominee_name.first_name$': {
                                        [Op.like]: '%' + search + '%'
                                      }
                                    },
                                    {
                                      '$nominee_name.last_name$': {
                                        [Op.like]: '%' + search + '%'
                                      }
                                    },
                                    {
                                      '$nominee_name.english_name$': {
                                        [Op.like]: '%' + search + '%'
                                      }
                                    },
                                  ]
                                },
                                include: [{
                                  model: User,
                                  as: 'nominee_name',
                                  attributes: ['first_name', 'last_name', 'english_name']
                                }],
                                order: [
                                  [table, col, type]
                                ],
                                limit: limit,
                                offset: offset,
                              }).then(breakdown => {
                                if (breakdown.length == 0) {
                                  res.status(400).send({message: 'There is no result'});
                                } else {
                                  res.status(200).json({
                                    'data': breakdown,
                                    'total_counts': data.count,
                                    'filtered_counts': data1.count,
                                    'offset': offset,
                                    'limit': limit,
                                    'pages': pages
                                  });
                                }
                              })
                                .catch(err => {
                                  res.status(400).send({message: err});
                                })
                            } else {
                              res.status(400).send({message: 'Wrong table'});
                            }
                          }
                        }
                      })
                      .catch(err => {
                        res.status(400).send({message1: err});
                      })
                  }
                }
              })
          }
        })
        .catch(err => {
          res.status(400).send({message: err});
        })
    })
    .catch(err => {
      res.status(400).send({message: err});
    })

    .catch(err => {
      res.status(400).send({message: err});
    })
})


//Voting
router.post('/voting_award', authorize(), (req, res) => {
  let today = new Date();
  let id_award = req.body.id;
  let first_vote = req.body.first_vote;
  let second_vote = req.body.second_vote;
  let third_vote = req.body.third_vote;

  Award.findOne({
    where: {
      id: id_award,
      // status: 2,
    }
  })
    .then(award => {
      if (!award) {
        res.status(400).send({message: 'There is no award'});
      } else {
        Voter.findOne({
          where: {
            id_award: id_award,
            id_user: req.decoded.id
          }
        })
          .then(voter => {
            if (!voter) {
              res.status(400).send({message: 'You are not allowed to vote this award'});
            } else {
              if (first_vote == req.decoded.id || second_vote == req.decoded.id || third_vote == req.decoded.id) {
                res.status(400).send({message: 'You can not vote for yourself'});
              } else {
                if (first_vote == second_vote || first_vote == third_vote || second_vote == third_vote) {
                  res.status(400).send({message: 'Your vote is duplicated'});
                } else {
                  let data = {
                    id: id_award,
                    id_voter: req.decoded.id,
                    id_nominee_first: first_vote,
                    id_nominee_second: second_vote,
                    id_nominee_third: third_vote,
                  }
                  let token_name = 'token_' + data.id;
                  let stream_name = 'award_' + data.id;
                  let key_name1 = 'nominee_' + data.id_nominee_first;
                  let key_name2 = 'nominee_' + data.id_nominee_second;
                  let key_name3 = 'nominee_' + data.id_nominee_third;

                  //List voter
                  multichain.initiateMultichain().listStreamKeyItems({
                    stream: stream_name,
                    key: 'voter'
                  })
                    .then(voters => {
                      console.log('Get list voter successfully');
                      for (var i = 0; i < voters.length; i++) {
                        //Get txid
                        let txid = voters[i].txid;
                        //Check id voter
                        multichain.initiateMultichain().getStreamItem({
                          stream: stream_name,
                          txid: txid
                        })
                          .then(voter => {
                            let id_voter = voter.data.json.id;
                            if (data.id_voter == id_voter) {
                              let address1 = voter.data.json.address;
                              multichain.initiateMultichain().getAddressBalances({
                                address: address1
                              }).then(qty => {
                                if (qty.length == 0) {
                                  Voter.update({
                                    vote_status: 0,
                                    // updated_at: today
                                  }, {
                                    where: {
                                      id_award: id_award,
                                      id_user: req.decoded.id
                                    }
                                  })
                                    .then(() => {
                                      res.status(400).send({message: 'You already voted this award'});
                                    })
                                } else {
                                  if (!checkVoteValid(id_award, first_vote, second_vote, third_vote)) {
                                    res.status(400).send({message: 'Your vote is invalid'});
                                  } else {
                                    multichain.grant(address1, 'receive,send');
                                    console.log('Get info voter successfully', address1);
                                    multichain.initiateMultichain().listStreamKeyItems({
                                      stream: stream_name,
                                      key: 'nominee'
                                    })
                                      .then(nominees => {
                                        console.log('Get list nominee successfully');

                                        async function sendTokenToNominee() {
                                          for (var i = 0; i < nominees.length; i++) {
                                            let txid1 = nominees[i].txid;
                                            await multichain.initiateMultichain().getStreamItem({
                                              stream: stream_name,
                                              txid: txid1
                                            })
                                              .then(nominee => {
                                                console.log('Get info nominee successfully');
                                                let id_nominee = nominee.data.json.id;
                                                let address2 = nominee.data.json.address;
                                                //First vote
                                                if (data.id_nominee_first == id_nominee) {
                                                  let amount = 5;

                                                  //Update result to database
                                                  // vote(data.id_nominee_first, amount);

                                                  console.log('Determined first_vote user');
                                                  // console.log(address1, address2, token_name, amount);
                                                  multichain.initiateMultichain().sendAssetFrom({
                                                    from: address1,
                                                    to: address2,
                                                    asset: token_name,
                                                    qty: amount
                                                  })
                                                    .then(() => {
                                                      console.log('Send token to first_vote user successfully');
                                                      multichain.initiateMultichain().getStreamKeySummary({
                                                        stream: stream_name,
                                                        key: key_name1,
                                                        mode: 'jsonobjectmerge'
                                                      })
                                                        .then(votes => {
                                                          let voteChange = votes.json.first_votes + 1;
                                                          multichain.initiateMultichain().publish({
                                                            stream: stream_name,
                                                            key: key_name1,
                                                            data: {
                                                              "json": {
                                                                "first_votes": voteChange,
                                                              }
                                                            }
                                                          })
                                                        })
                                                        .catch(err => {
                                                          console.log('Error when merge votes ' + err);
                                                        })
                                                    })
                                                    .catch(err => {
                                                      console.log('Error when send token ' + err);
                                                    })
                                                }

                                                //Second vote
                                                if (data.id_nominee_second == id_nominee) {
                                                  let amount = 3;

                                                  //Update result to database
                                                  // vote(data.id_nominee_second, amount);

                                                  console.log('Determined second_vote user');
                                                  multichain.initiateMultichain().sendAssetFrom({
                                                    from: address1,
                                                    to: address2,
                                                    asset: token_name,
                                                    qty: amount
                                                  })
                                                    .then(() => {
                                                      console.log('Send token to second_vote user successfully');

                                                      multichain.initiateMultichain().getStreamKeySummary({
                                                        stream: stream_name,
                                                        key: key_name2,
                                                        mode: 'jsonobjectmerge'
                                                      })
                                                        .then(votes => {
                                                          let voteChange = votes.json.second_votes + 1;
                                                          multichain.initiateMultichain().publish({
                                                              stream: stream_name,
                                                              key: key_name2,
                                                              data: {
                                                                "json": {
                                                                  "second_votes": voteChange,
                                                                }
                                                              }
                                                            }
                                                          )
                                                        })
                                                        .catch(err => {
                                                          console.log('Error when merge votes ' + err);
                                                          // res.status(400).send({ message: 'Error when merge token ' });
                                                        })
                                                    })
                                                    .catch(err => {
                                                      console.log('Error when send token ' + err);
                                                      //res.status(400).send({ message: 'Error when send token ' });
                                                    })
                                                }

                                                // Third_vote
                                                if (data.id_nominee_third == id_nominee) {
                                                  let amount = 1;

                                                  //Update result to database
                                                  // vote(data.id_nominee_third, amount);

                                                  console.log('Determined third_vote user');
                                                  multichain.initiateMultichain().sendAssetFrom({
                                                    from: address1,
                                                    to: address2,
                                                    asset: token_name,
                                                    qty: amount
                                                  })
                                                    .then(() => {
                                                      console.log('Send token to third_vote user successfully');

                                                      multichain.initiateMultichain().getStreamKeySummary({
                                                        stream: stream_name,
                                                        key: key_name3,
                                                        mode: 'jsonobjectmerge'
                                                      })
                                                        .then(votes => {
                                                          let voteChange = votes.json.third_votes + 1;
                                                          multichain.initiateMultichain().publish({
                                                            stream: stream_name,
                                                            key: key_name3,
                                                            data: {
                                                              "json": {
                                                                "third_votes": voteChange,
                                                              }
                                                            }
                                                          })
                                                        })
                                                        .catch(err => {
                                                          console.log('Error when merge votes ' + err);
                                                        })
                                                    })
                                                    .catch(err => {
                                                      console.log('Error when send token ' + err);
                                                    })
                                                }
                                              })
                                              .catch(err => {
                                                console.log('Error when get info nominee ' + err);
                                              })
                                          }
                                        }

                                        async function voteSuccess() {
                                          await Voter.update({
                                            vote_status: 0,
                                            // updated_at: today
                                          }, {
                                            where: {
                                              id_award: id_award,
                                              id_user: req.decoded.id
                                            }
                                          })
                                        }

                                        async function vote() {
                                          await sendTokenToNominee();
                                          await voteSuccess();
                                        }

                                        vote();
                                      })
                                      .catch(err => {
                                        console.log('Error when get list nominee ' + err);
                                      })
                                    res.status(200).send({message: 'You voted successfully'});
                                  }
                                }
                              })
                            }
                          })
                          .catch(err => {
                            console.log('Error when get info voter ' + err);
                          })
                      }
                    })
                    .catch(err => {
                      console.log('Error when get list voter ' + err);
                    })
                }
              }
            }
          })
          .catch(err => {
            res.status(400).send({message1: err});
          })
      }
    })
    .catch(err => {
      res.status(400).send({message: err});
    })
})

//Get type of award
router.get('/award_type', AwardController.getAwardTypes);

//Find an award
router.post('/find_an_award', AwardController.findAnAward);

//Get award for vote
router.get('/get_award', AwardController.getAwardForVoting);

//Update result
router.post('/update_result', AwardController.updateResult);


//Check status vote of voter
router.post('/check_status_voter', authorize(), (req, res) => {
  const today = new Date();
  const voter1 = req.decoded.id;
  const id_award = req.body.id_award;
  const stream_name = 'award_' + id_award;
  // //Check if voter has already voted for award or not
  Voter.findOne({
    where: {
      id_award: id_award,
      id_user: req.decoded.id
    }
  })
    .then(voter => {
      if (!voter) {
        res.status(400).send({message: 'You are not allowed to vote this award'});
      } else {
        //List voter
        multichain.initiateMultichain().listStreamKeyItems({
          stream: stream_name,
          key: 'voter'
        })
          .then(voters => {
            console.log('Get list voter successfully');
            for (var i = 0; i < voters.length; i++) {
              //Get txid
              let txid = voters[i].txid;
              //Check id voter
              multichain.initiateMultichain().getStreamItem({
                stream: stream_name,
                txid: txid
              })
                .then(voter => {
                  let id_voter = voter.data.json.id;
                  if (voter1 == id_voter) {
                    let address1 = voter.data.json.address;
                    multichain.initiateMultichain().getAddressBalances({
                      address: address1
                    }).then(qty => {
                      if (qty.length == 0) {
                        Voter.update({
                          vote_status: 0,
                          // updated_at: today
                        }, {
                          where: {
                            id_award: id_award,
                            id_user: req.decoded.id
                          }
                        })
                        res.status(400).send({message: 'You already vote for this award'});
                      } else {
                        res.status(200).send({message: 'You can vote for this award'});
                      }
                    })
                  }
                })
                .catch(err => {
                  console.log('Error when get list voter ' + err)
                })
            }
          })
          .catch(err => {
            console.log('Error when get list voter ' + err)
          })
      }
    })
    .catch(err => {
      console.log('Error when get list voter ' + err)
    })

})

//Finish award
router.post('/finish_award', (req, res) => {
  const today = new Date();
  const id_award = req.body.id
  Award.update({
    status: 0,
    date_end: today,
    // updated_at: today,
  }, {
    where: {
      id: req.body.id
    }
  })
    .then(() => {
      async function waitForUpdate() {
        await updateResult(id_award);
        await updatePercent(id_award);
        await chooseWinner(id_award);
      }

      waitForUpdate()
      res.status(200).send({message: 'Finish award successfully'});
    })
    .catch(err => {
      res.status(400).send({message: 'Error when finish' + err});
    })
})

async function updateResult(id) {
  const today = new Date();
  const id_award = id;
  const stream_name = 'award_' + id_award;

  await Breakdown.findAll({
    where: {
      id_award: id_award
    }
  })
    .then(nominees => {
      for (var i = 0; i < nominees.length; i++) {
        let id_nominee = nominees[i].id_nominee;
        let key_name = 'nominee_' + id_nominee;
        multichain.initiateMultichain().getStreamKeySummary({
          stream: stream_name,
          key: key_name,
          mode: 'jsonobjectmerge'
        })
          .then(result => {
            let total_points = result.json.first_votes * 5 + result.json.second_votes * 3 + result.json.third_votes * 1;
            Breakdown.update({
              first_votes: result.json.first_votes,
              second_votes: result.json.second_votes,
              third_votes: result.json.third_votes,
              total_points: total_points,
              // updated_at: today
            }, {
              where: {
                id_award: id_award,
                id_nominee: id_nominee
              }
            })
              .then(() => {
                calculate(id_award);
              })
              .catch(err => {
                console.log('Error when update result', err);
              })
          })
          .catch(err => {
            console.log('Error when get result from blockchain', err);
          })
      }
    })
    .catch(err => {
      console.log('Error when get result', err);
    })
}

function updateCurrentResult() {
  Award.findAll({
    where: {
      status: 2
    }
  })
    .then(awards => {
      if (awards.length === 0) {
        console.log('There is no award for updating right now');
      } else {
        for (let award of awards) {
          AwardController.updateAwardResult(award.id).then(breakdown => {
            console.log('Update successfully award' + award.id);
          })
        }
      }
    })
    .catch(err => {
      console.log('Error when get awards', err);
    })

}

async function updatePercent(id) {
  const today = new Date();
  const id_award = id;
  let sum = 0;
  await Breakdown.findAll({
    where: {
      id_award: id_award
    }
  })
    .then(nominees => {
      for (var i = 0; i < nominees.length; i++) {
        sum = sum + nominees[i].total_points;
      }
      for (var i = 0; i < nominees.length; i++) {
        let id_nominee = nominees[i].id_nominee;
        if (nominees[i].total_points == 0) {

        } else {
          let num = nominees[i].total_points / sum * 100;
          let percent = Math.round(num * 100) / 100;
          Breakdown.update({
            percent: percent,
            // updated_at: today
          }, {
            where: {
              id_award: id_award,
              id_nominee: id_nominee
            }
          })
        }
      }
      console.log('Update percent successfully');
    })
    .catch(err => {
      console.log('Error when update percent', err);
    })
}


async function calculate(id) {
  const award_id = id;
  await Breakdown.findAll({
    where: {
      id_award: award_id
    },
    order: [
      ['total_points', 'DESC']
    ]
  })
    .then(data => {

      for (var i = 0; i < data.length; i++) {

        for (var j = i + 1; j < data.length; j++) {

          //Check total point
          if (data[i].total_points == data[j].total_points) {
            //Check first vote
            if (data[i].first_votes < data[j].first_votes) {
              let tam = data[i];
              data[i] = data[j];
              data[j] = tam;

            } else {
              // = first vote
              if (data[i].first_votes = data[j].first_votes) {

                if (data[i].second_votes < data[j].second_votes) {
                  let tam1 = data[i];
                  data[i] = data[j];
                  data[j] = tam1;
                } else {
                  // = second vote
                  if (data[i].second_votes = data[j].second_votes) {

                    if (data[i].third_votes < data[j].third_votes) {
                      let tam2 = data[i];
                      data[i] = data[j];
                      data[j] = tam2;
                    } else {
                      // = third vote
                      if (data[i].third_votes = data[j].third_votes) {
                        let tam3 = data[i + 1];
                        data[i + 1] = data[j];
                        data[j] = tam3;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        updateRank(i + 1, data[i].id_nominee, award_id);
      }
    })
    .catch(err => {
      console.log('err', err)
    })
}

async function updateRank(i, id_nominee, award_id) {
  await Breakdown.update({
    rank: i
  }, {
    where: {
      id_nominee: id_nominee,
      id_award: award_id
    }
  })
}

function checkVoteValid(id, first_vote, second_vote, third_vote) {
  id_award = id;
  first_vote = first_vote;
  second_vote = second_vote;
  third_vote = third_vote;
  if (id_award == '' || first_vote == '' || second_vote == '' || third_vote == '') {
    return false;
  }
  return true;
}

async function chooseWinner(id) {
  const id_award = id;
  await Breakdown.findOne({
    where: {
      id_award: id_award,
      rank: 1
    }
  })
    .then(result => {
      const winner_data = {
        id_award: id_award,
        id_winner: result.id_nominee,
        percent: result.percent
      }
      Winner.findOne({
        where: {
          id_award: id_award
        }
      })
        .then(data => {
          if (!data) {
            Winner.create(winner_data);
          } else {
            Winner.update({
              id_winner: winner_data.id_winner,
              percent: winner_data.percent
            }, {
              where: {
                id_award: id_award
              }
            })
          }
        })
      console.log('Choose winner successfully');
    })
    .catch(err => {
      console.log('Err' + err)
    })
}


function finishAward(id) {
  let today = new Date();
  const award_id = id;
  Award.update({
    status: 0,
    // updated_at: today,
  }, {
    where: {
      id: award_id
    }
  })
    .then(() => {
      const stream_name = 'award_' + award_id;
      const asset_name = 'asset_' + award_id;
      const token_name = 'token_' + award_id;
      multichain.initiateMultichain().listStreamKeyItems({
        stream: stream_name,
        key: asset_name
      })
        .then(asset => {
          let asset_txid = asset[0].txid;
          console.log(asset_txid);
          multichain.initiateMultichain().getStreamItem({
            stream: stream_name,
            txid: asset_txid
          })
            .then(result => {
              //Get address of asset
              let address1 = result.data.json.address;
              multichain.initiateMultichain().listStreamKeyItems({
                stream: stream_name,
                key: 'voter',
              })
                .then(voters => {
                  for (var i = 0; i < voters.length; i++) {
                    let voter_txid = voters[i].txid;
                    multichain.initiateMultichain().getStreamItem({
                      stream: stream_name,
                      txid: voter_txid
                    })
                      .then(result1 => {
                        let address2 = result1.data.json.address;
                        grant(address2, 'receive');
                        sendAssetFrom(address2, address1, token_name, 9);
                        console.log('Successfully');
                      })
                  }
                })
            })

        })
    })
    .catch(err => {
      console.log('Err' + err);
    })
}

function checkDateAward() {
  let today = new Date();
  Award.findAll({
    where: {
      status: {
        [Op.gte]: 1,
      }
    }
  })
    .then(awards => {
      if (awards.length == 0) {
        console.log('There is no award for voting');
      } else {
        //Check date
        for (var i = 0; i < awards.length; i++) {

          //Start award
          if (awards[i].status == 1) {
            if (awards[i].date_start <= today) {
              console.log(awards[i].date_start, today);
              let id_award = awards[i].id;
              Award.update({
                status: 2,
                // updated_at: today
              }, {
                where: {
                  id: awards[i].id
                }
              })
                .then(() => {
                  console.log('Award ', id_award, ' has started!');
                })
            }
          }

          //End award
          if (awards[i].status == 2) {
            if (awards[i].date_end <= today) {
              let id_award1 = awards[i].id;
              Award.update({
                status: 0,
                // updated_at: today
              }, {
                where: {
                  id: id_award1
                }
              })
                .then(() => {
                  console.log('Award ', id_award1, ' has finished!');

                  async function waitForUpdate() {
                    await updateResult(id_award1);
                    await updatePercent(id_award1);
                    await chooseWinner(id_award1);
                  }

                  waitForUpdate();

                })
            }
          }
        }
        console.log('Up today');
      }
    })
}

function informUpcomingAward() {
  let today = new Date();
  Award.findAll({
    where: {
      status: {
        [Op.eq]: 1,
      }
    }
  })
    .then(awards => {
      if (awards.length == 0) {
        console.log('There is no award for voting');
      } else {
        for (var i = 0; i < awards.length; i++) {
          let dayBefore = moment(awards[i].date_start).subtract(1, 'days').utc().format();
          if (moment(dayBefore).isBefore(today)) {
            sendEmailWhenStart(awards[i].id);
          }
        }
      }

    })
}

function informAwardEndSoon() {
  let today = new Date();
  Award.findAll({
    where: {
      status: {
        [Op.eq]: 2,
      }
    }
  })
    .then(awards => {
      if (awards.length == 0) {
        console.log('There is no award for voting');
      } else {
        for (var i = 0; i < awards.length; i++) {
          let dayBefore = moment(awards[i].date_end).subtract(1, 'days').utc().format();
          if (moment(dayBefore).isBefore(today)) {
            sendEmailWhenEnd(awards[i].id);
          }
        }
      }

    })
}

function vote(id, amount) {
  Breakdown.findOne({
    where: {
      id_nominee: id
    }
  })
    .then(currentResult => {
      let pointChange = currentResult.total_points + amount;
      if (amount == 5) {
        let voteChange = currentResult.first_votes + 1;
        Breakdown.update({
          first_votes: voteChange,
          total_points: pointChange
        })
      }
      if (amount == 3) {
        let voteChange = currentResult.second_votes + 1;
        Breakdown.update({
          first_votes: voteChange,
          total_points: pointChange
        })
      }
      if (amount == 1) {
        let voteChange = currentResult.third_votes + 1;
        Breakdown.update({
          first_votes: voteChange,
          total_points: pointChange
        })
      }
    })
    .catch(err => {
      console.log('Error when update result to database ', err)
    })
}

function sendEmailWhenStart(id) {
  Voter.findAll({
    where: {
      id_award: id
    },
    include: [{
      model: Award,
      required: true,
      attributes: ['year', 'date_start', 'date_end'],
      include: [{
        model: Award_type,
        required: true,
        attributes: ['name']
      }]
    }]
  })
    .then(voters => {
      if (voters.length == 0) {
        console.log('There is no voter');
      } else {
        const year = voters[0].awardDetail.year;
        const date_start = voters[0].awardDetail.date_start;
        const date_end = voters[0].awardDetail.date_end;
        const name = voters[0].awardDetail.awardType.name;
        for (i = 0; i < voters.length; i++) {
          User.findOne({
            where: {
              id: voters[i].id_user
            }
          })
            .then(user => {
              let mailOptions = {
                from: `electronic.voting.system.enclave@gmail.com`,
                to: user.email,
                subject: `A New Upcoming Award `,
                html: `Dear Mr/Ms <strong>${user.username}</strong>, <br></br>` +
                  `<strong>The ${year} ${name} Awards </strong>is coming and you have been chosen to be one of the people who determine the winner. <br></br>` +
                  `<strong>Valid time: </strong> <i>${date_start}</i> <strong>to </strong> <i>${date_end}</i>. <br></br>` +
                  `We welcome you to join in this award. Please take your time and click <a href = "http://localhost:4000/index">here</a> to vote for your favorite person. <br></br>` +
                  `Thanks and best regard! <br></br>` +
                  `Electronic Voting system.<br></br>` +
                  `--------------------------------------------------------------------------` +
                  `<ul style="color:red;font-size:15px">
                                        <li><i>This email is sent automatically by Electronic Voting system. You do not need to reply this email.</i> </li>
                                        <li><i>If you can not access to system, please send contact admin to: electronic.voting.system.enclave@gmail.com</i></li>
                                    </ul>`
              }

              transporter.sendMail(mailOptions, (err, respone) => {
                if (err) {
                  console.log('Error when send email' + err);
                } else {
                  console.log('Send email successfully');
                }
              })
            })
            .catch(err => {
              console.log('Error' + err);
            })
        }
      }
    })
}

function sendEmailWhenEnd(id) {
  Voter.findAll({
    where: {
      id_award: id,
      vote_status: 1,
    },
    include: [{
      model: Award,
      required: true,
      attributes: ['year', 'date_start', 'date_end'],
      include: [{
        model: Award_type,
        required: true,
        attributes: ['name']
      }]
    }]
  })
    .then(voters => {
      if (voters.length == 0) {
        console.log('There is no voter');
      } else {
        const year = voters[0].awardDetail.year;
        //const date_start = voters[0].awardDetail.date_start;
        const date_end = voters[0].awardDetail.date_end;
        const name = voters[0].awardDetail.awardType.name;
        for (i = 0; i < voters.length; i++) {
          User.findOne({
            where: {
              id: voters[i].id_user
            }
          })
            .then(user => {
              let mailOptions = {
                from: `electronic.voting.system.enclave@gmail.com`,
                to: user.email,
                subject: `An Award Will End Soon `,
                html: `Dear Mr/Ms <strong>${user.username}</strong>, <br></br>` +
                  `<strong>The ${year} ${name} Awards </strong>is supposed to be end soon. <br></br>` +
                  `Please cast your vote before <strong>${date_end}</strong>. <br></br>` +
                  `Click <a href = "http://localhost:4000/index">here</a> to vote for your favorite person. <br></br>` +
                  `If you already voted for this award, please ignore this email.<br></br>` +
                  `Thanks and best regard! <br></br>` +
                  `Electronic Voting system. <br></br>` +
                  `-------------------------------------------------------------------------- <br></br>` +
                  `<ul style="color:red;font-size:15px">
                                        <li><i>This email is sent automatically by Electronic Voting system. You do not need to reply this email.</i> </li>
                                        <li><i>If you can not access to system, please send contact admin to: electronic.voting.system.enclave@gmail.com</i></li>
                                    </ul>`
              }
              transporter.sendMail(mailOptions, (err, respone) => {
                if (err) {
                  console.log('Error when send email' + err);
                } else {
                  console.log('Send email successfully');
                }
              })
            })
            .catch(err => {
              console.log('Error' + err);
            })
        }
      }
    })
}

console.log('Before job instantiation');
const checkAward = new CronJob('0,30 * * * * *', function () {
  const d = new Date();
  const a = moment.tz(d, "Asia/Ho_Chi_Minh");
  checkDateAward();
  console.log('--------------');
  console.log('Midnight:', d);
  console.log('Now: ', a.format());

});

const updateAward = new CronJob('0,30 * * * * *', function () {
  const d = new Date();
  var a = moment.tz(d, "Asia/Ho_Chi_Minh");
  updateCurrentResult();
  console.log('--------------');
  console.log('Midnight:', d);
  console.log('Now: ', a.format());
});

const informAward = new CronJob('0 0 0 * * *', function () {
  // informUpcomingAward();
  // informAwardEndSoon();
  console.log('--------------');
});

console.log('After job instantiation');
checkAward.start();
// checkAward.stop();
updateAward.start();
// informAward.start();
// informAward.stop();
module.exports = router;
