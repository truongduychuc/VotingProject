const {
  user: User,
  awardDetail: Award,
  finalResult: Winner,
  nominee: Nominee,
  role: Role,
  voter: Voter,
  votingBreakdown: Breakdown,
  awardType: AwardType
} = require('../models');

const multichain = require('../helpers/multichain');
const {catchErrorRequest} = require('../helpers/validate');
const {HTTP} = require('../helpers/constants');

/**@api
 * Create a new award, only used by admin account
 * @param req
 * @param res
 */
async function store(req, res) {
  if (catchErrorRequest(req)) {
    return res.status(HTTP.UNPROCESSABLE_ENTITY).send({message: catchErrorRequest(req)})
  }
  const createdAt = new Date();
  const updatedAt = new Date();
  const awardData = {
    type: req.body.type,
    description: req.body.description,
    year: req.body.year,
    status: 1,
    date_start: req.body.date_start,
    date_end: req.body.date_end,
    prize: req.body.prize,
    item: req.body.item
  };
  const voterData = {
    id_award: null,
    id_user: null,
    vote_status: 1
  };
  const nomineeData = {
    id_award: null,
    id_team: null,
    id_nominee: null,
  };

  const nomineeVotes = {
    id_award: null,
    rank: null,
    id_nominee: null,
    first_votes: 0,
    second_votes: 0,
    third_votes: 0,
    percent: 0,
    total_points: 0
  };

  const check = () => !(req.body.type === 0 || req.body.type === '' || req.body.type == null);


  //Check year and name for award
  // multichain.initiateMultichain().listStreamKeyItems({
  //     stream: "award_150",
  //     key: "nominee_1",
  //     verbose: true
  // })
  if (!check()) {
    const awardType = await AwardType.create({name: req.body.name});
    awardData.type = awardType.id;
  }
  const newAward = await Award.create(awardData);
  let streamName = 'award_' + newAward.id;
  let assetName = 'asset_' + newAward.id;
  let tokenName = 'token_' + newAward.id;

  voterData.id_award = newAward.id;
  nomineeData.id_award = newAward.id;
  nomineeVotes.id_award = newAward.id;

  async function subscribe() {
    await multichain.initiateMultichain().subscribe({
      stream: streamName
    }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Subscribe stream successfully');
      }
    });
  }

  async function test() {
    await multichain.createStream(streamName);
    await subscribe();
  }

  await test();
  // add information
  multichain.initiateMultichain().publish({
    stream: streamName,
    key: "information",
    data: {
      "json": {
        "id": awardData.id,
        "name": awardData.name,
        "date_start": awardData.date_start,
        "date_end": awardData.date_end,
        "created_at": newAward.createdAt,
        "updated_at": newAward.updatedAt
      }
    }
  });


  //
  if (check()) {
    Award.findAll({
      where: {
        type: req.body.type,
        year: req.body.year
      }
    })
      .then(awards => {
        if (awards.length !== 0) {
          res.status(400).send({message: 'Award already exists.'});
        } else {
          Award.create(awardData)
            .then(award => {
              let stream_name = 'award_' + award.id;
              let asset_name = 'asset_' + award.id;
              let token_name = 'token_' + award.id;
              //Create new stream
              // multichain.createStream(stream_name);

              voterData.id_award = award.id;
              nomineeData.id_award = award.id;
              nomineeVotes.id_award = award.id;

              //Subscribe
              //multichain.subscribe(stream_name);
              async function subscribe() {
                await multichain.initiateMultichain().subscribe({
                  stream: stream_name
                }, (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Subscribe stream successfully');
                  }
                })

              }

              async function test() {
                await multichain.createStream(stream_name);
                await subscribe();
              }

              test();

              //Add infomation
              multichain.initiateMultichain().publish({
                stream: stream_name,
                key: 'information',
                data: {
                  "json": {
                    "id": awardData.id,
                    "name": awardData.name,
                    "year": awardData.year,
                    "date_start": awardData.date_start,
                    "date_end": awardData.date_end,
                    "created_at": createdAt,
                    "updated_at": updatedAt
                  }
                }
              }, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Input infomation of award to stream successfully');
                }
              });

              //Find voter with role
              const voter = req.body.id_role_voter;
              if (voter.length === 0) {
                res.status(400).send({message: 'There is no voter'});
              } else {
                multichain.initiateMultichain().getNewAddress()
                  .then(address => {
                    //Grant permission for asset
                    async function permission() {
                      await multichain.initiateMultichain().grant({
                        addresses: address,
                        permissions: 'receive,send'
                      });
                    }

                    //Create new asset
                    async function asset() {
                      await multichain.initiateMultichain().issue({
                        address: address,
                        asset: token_name,
                        qty: 100 * 9,
                        units: 0.1
                      }, (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('Create asset successfully');
                        }
                      })
                    }

                    async function createAsset() {
                      await permission();
                      await asset();
                    }

                    //Insert asset data
                    let asset_data = {
                      id: 0,
                      address: address
                    }
                    multichain.publish(stream_name, asset_name, asset_data);

                    //console.log('Input asset data to stream successfully');

                    async function addVoterAndSendToken() {
                      for (var j = 0; j < voter.length; j++) {
                        await User.findAll({
                          where: {
                            id_role: voter[j],
                            is_active: 1
                          }
                        })
                          .then(users => {
                            if (users.length == 0) {
                              res.status(400).send({message: 'There is user does not exist'});
                            } else {
                              console.log('------------------');
                              console.log('123');
                              console.log('------------------');
                              // async function createVoter() {
                              for (var i = 0; i < users.length; i++) {
                                voterData.id_user = users[i].id;
                                let id = users[i].id;

                                console.log('------------');
                                console.log(stream_name, asset_name, token_name);
                                console.log('------------');

                                //Get address of asset
                                const address1 = address;

                                //Get new address
                                multichain.initiateMultichain().getNewAddress()
                                  .then(address2 => {
                                    async function permissionForVoter() {
                                      //Grant permission for voter
                                      await multichain.initiateMultichain().grant({
                                        addresses: address2,
                                        permissions: 'receive,send'
                                      }, (err) => {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          console.log('Grant voter permission successfully');
                                        }
                                      });

                                    }

                                    async function sendTokenToVoter() {
                                      await User.findOne({
                                        where: {
                                          id: id
                                        }
                                      })
                                        .then(user => {
                                          //Save data to stream
                                          let voter_data = {
                                            id: user.id,
                                            first_name: user.first_name,
                                            last_name: user.last_name,
                                            english_name: user.english_name,
                                            address: address2
                                          };

                                          let key_name1 = 'voter';

                                          multichain.publishEmployee(stream_name, key_name1, voter_data);

                                          //Send token to voter
                                          multichain.sendAssetFrom(address1, address2, token_name, 9);

                                          //Revoke permission
                                          //multichain.revoke(address2, 'receive');
                                        })
                                        .catch(err => {
                                          console.log('Error when send token ' + err);
                                        })
                                    }

                                    async function voter() {
                                      await permissionForVoter();
                                      await sendTokenToVoter();
                                    }

                                    voter();

                                  })
                                  .catch(err => {
                                    console.log('Error when get new address ' + err);
                                  })


                                //Add voter
                                Voter.create(voterData)
                                  .then(() => {
                                  })
                                  .catch(err => {
                                    console.log('error0 ' + err);
                                    // res.status(400).send({ error0: err });
                                  })
                              }
                            }

                            // async function test() {
                            //     // await createAsset();
                            //     await createVoter();
                            // }
                            // test();
                            // }
                          })
                          .catch(err => {
                            res.status(400).send({error1: err})
                          })
                      }
                    }

                    async function run() {
                      await createAsset();
                      await addVoterAndSendToken();
                    }

                    run();

                  })
                  .catch(err => {
                    console.log('Error when set new address ' + err);
                  })
              }


              // Find nominee with id
              const nominee = req.body.id_nominee;
              if (nominee.length === 0) {
                res.status(400).send({message: 'There is no nominee'});
              } else {
                for (var k = 0; k < nominee.length; k++) {
                  User.findAll({
                    where: {
                      id: nominee[k],
                      is_active: 1
                    }
                  })
                    .then(users => {
                      if (users.length === 0) {
                        // res.status(400).send({ message: 'User does not exist' });
                      } else {
                        for (var i = 0; i < users.length; i++) {
                          nomineeData.id_team = users[i].id_team;
                          nomineeData.id_nominee = users[i].id;

                          nomineeVotes.id_nominee = users[i].id;
                          nomineeVotes.rank = i + 1;
                          let nominee_data = {
                            id: users[i].id,
                            first_name: users[i].first_name,
                            last_name: users[i].last_name,
                            english_name: users[i].english_name
                          }
                          multichain.setNominee(stream_name, nominee_data);
                          multichain.setNomineeVote(stream_name, nominee_data);

                          //Add nominee default votes
                          Breakdown.create(nomineeVotes)
                            .then(() => {
                            })
                            .catch(err => {
                              console.log('Error when add nominee to breakdown ' + err);
                              //res.status(400).send({ error6: err });
                            });
                          //Add nominee
                          Nominee.create(nomineeData)
                            .then(() => {
                            })
                            .catch(err => {
                              console.log('Error when add nominee to nominee ' + err);
                              //res.status(400).send({ error5: err });
                            })
                        }
                      }
                    })
                    .catch(err => {
                      console.log(err);
                      // res.status(400).send({ error4: err })
                    })
                }
              }
              res.status(200).send({message: 'Create award successfully.'});
            })
            .catch(err => {
              // console.log(err);
              // res.status(400).send({ error2: err })
            })
        }
      })
      .catch(err => {
        // console.log(err);
        // res.status(400).send({ error3: err })
      })
  } else {
    AwardType.findAll({
      where: {
        name: req.body.name
      }
    })
      .then(result => {
        if (result.length !== 0) {
          res.status(400).send({message: 'New award name is already exist'});
        } else {
          AwardType.create({name: req.body.name})
            .then(() => {
              AwardType.findOne({
                where: {
                  name: req.body.name
                }
              })
                .then(award => {
                  awardData.type = award.id;
                  Award.create(awardData)
                    .then(award => {
                      let stream_name = 'award_' + award.id;
                      let asset_name = 'asset_' + award.id;
                      let token_name = 'token_' + award.id;
                      //Create new stream
                      // multichain.createStream(stream_name);

                      voterData.id_award = award.id;
                      nomineeData.id_award = award.id;
                      nomineeVotes.id_award = award.id;

                      //Subscribe
                      async function subscribe() {
                        await multichain.initiateMultichain().subscribe({
                          stream: stream_name
                        }, (err) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log('Subscribe stream successfully');
                          }
                        })

                      }

                      async function test() {
                        await multichain.createStream(stream_name);
                        await subscribe();
                      }

                      test();

                      //Add infomation
                      multichain.initiateMultichain().publish({
                        stream: stream_name,
                        key: 'information',
                        data: {
                          "json": {
                            "id": awardData.id,
                            "name": awardData.name,
                            "year": awardData.year,
                            "date_start": awardData.date_start,
                            "date_end": awardData.date_end,
                            "created_at": createdAt,
                            "updated_at": updatedAt
                          }
                        }
                      }, (err, info) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('Input infomation of award to stream successfully');
                        }
                      });

                      //Find voter with role
                      const voter = req.body.id_role_voter;
                      if (voter.length === 0) {
                        res.status(400).send({message: 'There is no voter'});
                      } else {
                        multichain.initiateMultichain().getNewAddress()
                          .then(address => {
                            //Grant permission for asset
                            async function permission() {
                              await multichain.initiateMultichain().grant({
                                addresses: address,
                                permissions: 'receive,send'
                              });
                            }

                            //Create new asset
                            async function asset() {
                              await multichain.initiateMultichain().issue({
                                address: address,
                                asset: token_name,
                                qty: 100 * 9,
                                units: 0.1
                              }, (err) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  console.log('Create asset successfully');
                                }
                              })
                            }

                            async function createAsset() {
                              await permission();
                              await asset();
                            }

                            //Insert asset data
                            let asset_data = {
                              id: 0,
                              address: address
                            };
                            multichain.publish(stream_name, asset_name, asset_data);

                            //console.log('Input asset data to stream successfully');

                            async function addVoterAndSendToken() {
                              for (var j = 0; j < voter.length; j++) {
                                await User.findAll({
                                  where: {
                                    id_role: voter[j],
                                    is_active: 1
                                  }
                                })
                                  .then(users => {
                                    if (users.length === 0) {
                                      res.status(400).send({message: 'There is user does not exist'});
                                    } else {
                                      console.log('------------------');
                                      console.log('123');
                                      console.log('------------------');
                                      // async function createVoter() {
                                      for (var i = 0; i < users.length; i++) {
                                        voterData.id_user = users[i].id;
                                        let id = users[i].id;

                                        console.log('------------');
                                        console.log(stream_name, asset_name, token_name);
                                        console.log('------------');

                                        //Get address of asset
                                        const address1 = address;

                                        //Get new address
                                        multichain.initiateMultichain().getNewAddress()
                                          .then(address2 => {
                                            async function permissionForVoter() {
                                              //Grant permission for voter
                                              await multichain.initiateMultichain().grant({
                                                addresses: address2,
                                                permissions: 'receive,send'
                                              }, (err) => {
                                                if (err) {
                                                  console.log(err);
                                                } else {
                                                  console.log('Grant voter permission successfully');
                                                }
                                              });

                                            }

                                            async function sendTokenToVoter() {
                                              await User.findOne({
                                                where: {
                                                  id: id
                                                }
                                              })
                                                .then(user => {
                                                  //Save data to stream
                                                  let voter_data = {
                                                    id: user.id,
                                                    first_name: user.first_name,
                                                    last_name: user.last_name,
                                                    english_name: user.english_name,
                                                    address: address2
                                                  };

                                                  let key_name1 = 'voter';

                                                  multichain.publishEmployee(stream_name, key_name1, voter_data);

                                                  //Send token to voter
                                                  multichain.sendAssetFrom(address1, address2, token_name, 9);

                                                  //Revoke permission
                                                  //multichain.revoke(address2, 'receive');
                                                })
                                                .catch(err => {
                                                  console.log('Error when send token ' + err);
                                                })
                                            }

                                            async function voter() {
                                              await permissionForVoter();
                                              await sendTokenToVoter();
                                            }

                                            voter();

                                          })
                                          .catch(err => {
                                            console.log('Error when get new address ' + err);
                                          })


                                        //Add voter
                                        Voter.create(voterData)
                                          .then(() => {
                                          })
                                          .catch(err => {
                                            console.log('error0 ' + err);
                                            // res.status(400).send({ error0: err });
                                          })
                                      }
                                    }

                                    // async function test() {
                                    //     // await createAsset();
                                    //     await createVoter();
                                    // }
                                    // test();
                                    // }
                                  })
                                  .catch(err => {
                                    res.status(400).send({error1: err})
                                  })
                              }
                            }

                            async function run() {
                              await createAsset();
                              await addVoterAndSendToken();
                            }

                            run();

                          })
                          .catch(err => {
                            console.log('Error when set new address ' + err);
                          })
                      }


                      // Find nominee with id
                      const nominee = req.body.id_nominee;
                      if (nominee.length === 0) {
                        res.status(400).send({message: 'There is no nominee'});
                      } else {
                        for (var k = 0; k < nominee.length; k++) {
                          User.findAll({
                            where: {
                              id: nominee[k],
                              is_active: 1
                            }
                          })
                            .then(users => {
                              if (users.length === 0) {
                                //res.status(400).send({ message: 'User does not exist' });
                              } else {
                                for (var i = 0; i < users.length; i++) {
                                  nomineeData.id_team = users[i].id_team;
                                  nomineeData.id_nominee = users[i].id;
                                  nomineeVotes.id_nominee = users[i].id;
                                  nomineeVotes.rank = i + 1;
                                  let nominee_data = {
                                    id: users[i].id,
                                    first_name: users[i].first_name,
                                    last_name: users[i].last_name,
                                    english_name: users[i].english_name
                                  }
                                  multichain.setNominee(stream_name, nominee_data);
                                  multichain.setNomineeVote(stream_name, nominee_data);

                                  //Add nominee
                                  Nominee.create(nomineeData)
                                    .then(() => {
                                    })
                                    .catch(err => {
                                      console.log('Error when add nominee to nominee ' + err);
                                      //res.status(400).send({ error5: err });
                                    })

                                  //Add nominee default votes
                                  Breakdown.create(nomineeVotes)
                                    .then(() => {
                                    })
                                    .catch(err => {
                                      console.log('Error when add nominee to breakdown ' + err);
                                      res.status(400).send({error6: err});
                                    })
                                }
                              }
                            })
                            .catch(err => {
                              console.log(err);
                              // res.status(400).send({ error4: err })
                            })
                        }
                      }
                      res.status(200).send({message: 'Create award successfully.'});
                    })
                    .catch(err => {
                      // console.log(err);
                      // res.status(400).send({ error2: err })
                    })
                })
                .catch(err => {
                  res.status(400).send({message: 'Error when get type from new type award', err});
                })
            })
        }
      })
      .catch(err => {
        res.status(400).send({message: 'Error when check new award name', err});
      })
  }
}

module.exports = {
  store
};
