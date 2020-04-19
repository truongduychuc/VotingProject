const {
  user: User,
  role: Role,
  finalResult: Winner,
  voter: Voter,
  nominee: Nominee,
  team: Team,
  votingBreakdown: Breakdown
} = require('../models');

const bcrypt = require('bcrypt');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const nodemailer = require('nodemailer');

const {teams: teamConstants, user: userConstants, HTTP} = require('../helpers/constants');
const {catchErrorRequest} = require('../helpers/validate');
const jwt = require('jsonwebtoken');
const winston = require('../config/winston.js');
const logger = require('../helpers/logging')(__filename, winston);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.EMAIL_ADDRESS}`,
    pass: `${process.env.EMAIL_PASSWORD}`
  },
});


function register(req, res) {
  const emptyIdTeam = req.body.id_team === '' || req.body.id_team === undefined || req.body.id_team == null;
  if (emptyIdTeam) {
    req.body.id_team = teamConstants.NO_TEAM_ID;
  }
  const userData = {
    id_role: req.body.id_role,
    id_team: req.body.id_team,
    is_active: userConstants.STATUS_ACTIVE,
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    english_name: req.body.english_name,
    email: req.body.email,
    ava_url: 'uploads/avatars/defaut_ava.jpg',
    // created_at: today,
    // updated_at: today,
    password: bcrypt.hashSync(req.body.password, 10)
  };

  User.create(userData)
    .then(() => {
      res.status(200).send({message: 'Created user successfully', data: userData});
    })
    .catch(err => {
      res.status(400).send({message: err});
    })
}

function authenticate(req, res) {
  const isActiveUser = user => user && user.is_active;

  User.findOne({
    where: {
      username: req.body.username
    },
    include: [{
      model: Role
    }]
  })
    .then(user => {

      if (!user) {
        res.status(404).send({message: 'Username is not found!'})
      } else {
        if (bcrypt.compareSync(req.body.password, user.password())) {
          if (isActiveUser(user)) {

            const payload = {
              id: user.id,
              id_role: user.id_role,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: 86400
            });
            const body = {
              //id: user.id,
              //username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              english_name: user.english_name,
              position: user.role.name,
              token: token,
            };

            res.status(200).json(body);
          } else {
            res.status(403).send({message: 'Your account has been temporarily locked'});
          }
        } else {
          res.status(404).send({message: 'Password is incorrect'});
        }
      }

    })
    .catch(err => {
      res.status(400).send({message: err});
    })
}

function getProfile(req, res) {
  const authUser = req.user;
  User.findOne({
    where: {
      id_team: authUser.team.id,
      id_role: 2
    },
    attributes: ['first_name', 'last_name', 'english_name'],
  })
    .then(directManager => {
      if (!directManager) {
        res.status(200).send({user: authUser, message: 'This user has no direct manager'});
      } else {
        res.status(200).send({user: authUser, directManager: directManager});
      }
    })
    .catch(err => {
      res.status(400).send({message: err});
    });
}

function getProfileById(req, res) {
  const id = parseInt(req.params.id);
  Role.findOne({
    where: {
      id: req.decoded.id_role
    }
  }).then(role => {
    // only allow admins to access other user records
    if (id !== req.decoded.id && role.name !== 'admin') {
      return res.status(401).json({message: 'Unauthorized'});
    } else {
      User.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'phone', 'is_active', 'address', 'achievement',
          'ava_url'
        ],
        include: [{
          model: Role,
          //attributes: ['name']
        }, {
          model: Team,
          //attributes: ['name']
        }]
      })
        .then(user => {
          if (!user) {
            res.status(400).send({message: 'User does not exist'});
          } else {
            if (user.team == null) {
              res.status(200).send({user, message: 'User has not had a team yet'});
            } else {
              User.findOne({
                where: {
                  id_team: user.team.id,
                  id_role: 2
                },
                attributes: ['first_name', 'last_name', 'english_name'],
              })
                .then(directManager => {
                  if (!directManager) {
                    res.status(200).send({user, message: 'This user has no direct manager'});
                  } else {
                    res.status(200).send({user, directManager: directManager});
                  }
                })
                .catch(err => {
                  res.status(400).send({message: err});
                });
            }
          }
        })
        .catch(err => {
          res.status(400).send({message: err});
        })
    }
  }).catch(err => {
    res.status(400).send({message2: err});
  })
}

function listUser(req, res) {
  let limit = 10; //number of records per page
  let page = 1;
  let col = 'first_name';
  let type = 'ASC';
  let table = 'user';
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
  let search = req.query.search;
  const authUser = req.user;
  const isAdmin = () => authUser.role.name.toLowerCase() === 'admin';
  const condition = !isAdmin() ? {
    id_role: {
      [Op.gt]: [1]
    },
    is_active: {
      [Op.gte]: [1]
    }
  } : {};
  const adminQueryAdditionalAttributes = isAdmin() ? ['is_active'] : [];

  //Count total entries
  User.findAndCountAll({
    where: {
      ...condition
    }
  })
    .then(data => {
      if (data.count == 0) {
        res.status(400).send({message: 'There is no user', total_counts: data.count})
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
          if (table == 'user') {
            User.findAndCountAll({
              where: {
                ...condition
              },
              attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'ava_url', ...adminQueryAdditionalAttributes],
              include: [{
                model: Role,
                required: true,
                //attributes: ['name']
              },
                {
                  model: Team,
                  // required: true,
                  //attributes: ['name']
                }
              ],
              order: [
                [col, type]
              ],
              limit: limit,
              offset: offset,
              //$sort: { id: 1 }
            })
              .then(recordAndMeta => {
                if (recordAndMeta.count== 0) {
                  res.status(400).send({message: 'There is no user'});
                } else {
                  res.status(200).json({
                    data: recordAndMeta.rows,
                    meta: {
                      total_counts: recordAndMeta.count,
                      filtered_counts: recordAndMeta.count,
                      offset: offset,
                      limit: limit,
                      pages: pages
                    }
                  });
                }
              })
              .catch(err => {
                res.status(400).send({message1: err})
              })
          } else {
            if (table == 'role' || table == 'team') {
              User.findAll({
                where: {
                  id_role: {
                    [Op.gt]: [1]
                  },
                  is_active: {
                    [Op.gte]: [1]
                  }
                },
                attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'ava_url', ...adminQueryAdditionalAttributes],
                include: [{
                  model: Role,
                  required: true,
                  //attributes: ['name']
                },
                  {
                    model: Team,
                    // required: true,
                    //attributes: ['name']
                  }
                ],
                order: [
                  [table, col, type]
                ],
                limit: limit,
                offset: offset,
                //$sort: { id: 1 }
              })
                .then(users => {
                  if (users.length == 0) {
                    res.status(400).send({message: 'There is no user'});
                  } else {
                    res.status(200).json({
                      data: users,
                      meta: {
                        total_counts: data.count,
                        filtered_counts: users.count,
                        offset: offset,
                        limit: limit,
                        pages: pages
                      }
                    });
                  }
                })
                .catch(err => {

                  res.status(400).send({message1: err});
                })
            } else {
              res.status(400).send({message: 'Wrong table'});
            }
          }
        }
        // search != '' && search != null
        else {
          User.findAndCountAll({
            where: {
              id_role: {
                [Op.gt]: [1]
              },
              is_active: {
                [Op.gte]: [1]
              },
              [Op.or]: [{
                first_name: {
                  [Op.like]: '%' + search + '%'
                }
              },
                {
                  last_name: {
                    [Op.like]: '%' + search + '%'
                  }
                },
                {
                  english_name: {
                    [Op.like]: '%' + search + '%'
                  }
                },
                {
                  email: {
                    [Op.like]: '%' + search + '%'
                  }
                },
                {
                  '$role.name$': {
                    [Op.like]: '%' + search + '%'
                  }
                },
                {
                  '$team.name$': {
                    [Op.like]: '%' + search + '%'
                  }
                }
              ]
            },
            include: [{
              model: Role,
              required: true,
            },
              {
                model: Team,
                // required: true,
              }
            ],
          })
            .then(data1 => {
              if (data1.count == 0) {
                res.status(400).send({message: 'There is no result', count: data1.count})
              } else {
                console.log(data1.count);
                let pages = Math.ceil(data1.count / limit);
                offset = limit * (page - 1);
                if (page > pages) {
                  offset = limit * (pages - 1);
                }
                //console.log(data1, page, pages, offset, limit);
                if (table == 'user') {
                  User.findAll({
                    where: {
                      id_role: {
                        [Op.gt]: [1]
                      },
                      is_active: {
                        [Op.gte]: [1]
                      },
                      [Op.or]: [{
                        first_name: {
                          [Op.like]: '%' + search + '%'
                        }
                      },
                        {
                          last_name: {
                            [Op.like]: '%' + search + '%'
                          }
                        },
                        {
                          english_name: {
                            [Op.like]: '%' + search + '%'
                          }
                        },
                        {
                          email: {
                            [Op.like]: '%' + search + '%'
                          }
                        },
                        {
                          '$role.name$': {
                            [Op.like]: '%' + search + '%'
                          }
                        },
                        {
                          '$team.name$': {
                            [Op.like]: '%' + search + '%'
                          }
                        }
                      ]
                    },
                    attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
                    include: [{
                      model: Role,
                      required: true,
                    },
                      {
                        model: Team,
                        // required: true,
                      }
                    ],
                    order: [
                      [col, type]
                    ],
                    limit: limit,
                    offset: offset,
                    //$sort: { id: 1 }
                  })
                    .then(users => {
                      if (users.length == 0) {
                        res.status(400).send({message: 'There is no user'});
                      } else {
                        res.status(200).json({
                          data: users,
                          meta: {
                            total_counts: data.count,
                            filtered_counts: data1.count,
                            offset: offset,
                            limit: limit,
                            pages: pages
                          }
                        });
                      }
                    })
                    .catch(err => {
                      res.status(400).send({message1: err})
                    })
                } else {
                  if (table == 'role' || table == 'team') {
                    User.findAll({
                      where: {
                        id_role: {
                          [Op.gt]: [1]
                        },
                        is_active: {
                          [Op.gte]: [1]
                        },
                        [Op.or]: [{
                          first_name: {
                            [Op.like]: '%' + search + '%'
                          }
                        },
                          {
                            last_name: {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            english_name: {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            email: {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            '$role.name$': {
                              [Op.like]: '%' + search + '%'
                            }
                          },
                          {
                            '$team.name$': {
                              [Op.like]: '%' + search + '%'
                            }
                          }
                        ]
                      },
                      attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
                      include: [{
                        model: Role,
                        required: true,
                      },
                        {
                          model: Team,
                        }
                      ],
                      order: [
                        [table, col, type]
                      ],
                      limit: limit,
                      offset: offset,
                      //$sort: { id: 1 }
                    })
                      .then(users => {
                        if (users.length == 0) {
                          res.status(400).send({message: 'There is no user'});
                        } else {
                          res.status(200).json({
                            data: users,
                            meta: {
                              total_counts: data.count,
                              filtered_counts: data1.count,
                              offset: offset,
                              limit: limit,
                              pages: pages
                            }
                          });
                        }
                      })
                      .catch(err => {
                        res.status(400).send({message1: err})
                      })
                  } else {
                    res.status(400).send({message: 'Wrong table'})
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
    .catch(err => {
      res.status(400).send({message: err});
    })
}

function changePassword(req, res) {
  // const today = new Date();
  User.findOne({
    where: {
      id: req.decoded.id
    }
  }).then(user => {
    if (!user) {
      res.status(400)({message: 'User does not exist'});
    } else {
      if (bcrypt.compareSync(req.body.old_password, user.password())) {
        const hash = bcrypt.hashSync(req.body.new_password, 10);
        User.update({
          password: hash,
          // updated_at: today
        }, {
          where: {
            id: req.decoded.id
          }
        }).then(() => {
          res.status(200).send({message: 'Updated successfully'});
        }).catch(err => {
          res.status(400).send({message: err});
        });
      } else {
        res.status(400).send({message: 'Incorrect old password'});
      }
    }
  }).catch(err => {
    res.status(400).send({message: err});
  })
}


function resetPassword(req, res) {
  // const today = new Date();
  const hash = bcrypt.hashSync('123456', 10);
  User.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => {
    if (!user) {
      res.status(400).send({message: 'User does not exist'});
    } else {
      User.update({
        password: hash,
        // updated_at: today
      }, {
        where: {
          id: req.params.id
        }
      }).then(() => {
        res.status(200).send({message: 'Reset password successfully'});
      }).catch(err => {
        res.status(400).send({message1: err});
      })
    }
  }).catch(err => {
    res.status(400).send({message2: err});
  })
}

/**
 * update a user's information
 * for admin
 * */
function updateUserInfo(req, res) {
  // const today = new Date();
  User.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => {
    if (!user) {
      res.status(400).send({message: 'User does not exist'});
    } else {
      //console.log(req.body.id_team)
      if (req.body.id_team === '') {
        req.body.id_team = userConstants.NO_TEAM_ID;
      }
      User.update({
        id_role: req.body.id_role,
        id_team: req.body.id_team,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        english_name: req.body.english_name,
        is_active: req.body.is_active,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        achievement: req.body.achievement,
        // updated_at: today
      }, {
        where: {
          id: req.params.id
        }
      }).then(() => {
        res.status(200).send({message: 'Updated successfully'});
      }).catch(err => {
        res.status(400).send({message1: err});
      })
    }
  }).catch(err => {
    res.status(400).send({message2: err});
  })
}

function updatePersonalProfile(req, res) {
  // const today = new Date();
  User.update({
    phone: req.body.phone,
    address: req.body.address,
    achievement: req.body.achievement,
    // updated_at: today
  }, {
    where: {
      id: req.decoded.id
    }
  }).then(() => {
    res.status(200).send({message: 'Updated successfully'});
  }).catch(err => {
    res.status(400).send({message: err});
  })
}

function uploadAvatar(req, res) {
  if (req.file === undefined) {
    res.status(404).send({message: 'Wrong type input'})
  } else {
    User.update({
      ava_url: req.file.path
    }, {
      where: {
        id: req.decoded.id
      }
    }).then(() => {
      res.status(200).send({message: 'Uploaded avatar successfully', path: req.file.path});
    }).catch(err => {
      res.status(400).send('err' + err);
    })
  }
}

function deleteUser(req, res) {
  const userId = req.params.id;
  // you are deleting your using auth account
  if (userId == req.user.id) {
    return res.status(400).send({message: 'You can not delete your own account', error: 'ERROR_DELETE_USING_ACCOUNT'});
  }
  User.findOne({
    where: {
      id: req.params.id,
    },
    include: [{
      model: Role
    }]
  }).then(user => {
    if (!user) {
      res.status(400).send({message: 'User does not exist'});
    } else {
      if (!user.role) {
        res.status(500).send({message: 'Error in role of this user, check your system'});
      }
      if (!user.role.user_deletable) {
        res.status(400).send({message: `You cannot delete user bringing ${user.role.name.toLowerCase()} role`});
      } else {
        Winner.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(() => {
            Voter.destroy({
              where: {
                id: req.params.id
              }
            })
              .then(() => {
                Nominee.destroy({
                  where: {
                    id: req.params.id
                  }
                })
                  .then(() => {
                    Breakdown.destroy({
                      where: {
                        id: req.params.id
                      }
                    })
                      .then(() => {
                        User.destroy({
                          where: {
                            id: req.params.id
                          }
                        })
                          .then(() => {
                            res.status(200).send({message: 'Delete successfully'})
                          })
                      })
                  })
              })
          })
      }

    }
  })
    .catch(err => {
      res.status(400).send({message: 'Error when delete this user ' + err});
    })
}

function forgotPassword(req, res) {
  User.findOne({
    where: {
      email: req.body.email,
    }
  })
    .then(user => {
      if (user.is_active == 0) {
        res.status(200).send({message: 'Your account has been suspended, please send email to electronic.voting.system.enclave@gmail.com for more information'});
      } else {
        if (user) {
          const payload = {
            id: user.id,
            id_role: user.id_role,
            // username: user.username,
            // email: user.email
          }
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600
          });
          const mailOptions = {
            from: `electronic.voting.system.enclave@gmail.com`,
            to: req.body.email,
            subject: `Link To Reset Password`,
            html: `Dear Mr/Ms <strong>${user.username}</strong>, <br></br>` +
              `You are receiving this because you (or someone else) have requested to change password of your account. <br></br>` +
              `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:<br></br>` +
              `Click <a href = "http://localhost:4000/reset_password/${token}">here</a> <br></br>` +
              `If you did not request this, please ignore this email and your password will remain unchanged.<br></br>` +
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
              console.log('Send email successfully', respone, token);
            }
          })
        }
        res.status(200).send({message: 'If your email is correct, you will receive your reset email'});
      }
    })
    .catch(err => {
      res.status(400).send({message: err});
    })
}

// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// }

module.exports = {
  register,
  authenticate,
  getProfile,
  getProfileById,
  listUser,
  changePassword,
  resetPassword,
  updateUserInfo,
  updatePersonalProfile,
  uploadAvatar,
  deleteUser,
  forgotPassword
};
