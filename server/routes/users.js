const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const multer = require('multer');

const authorize = require('../helpers/authorize');

const User = require('../models/user');
const Role = require('../models/role');

router.use(cors());

process.env.SECRET_KEY = 'secret';

User.belongsTo(Role, { foreignKey: 'id_role' });


//REGISTER
router.post('/register', (req, res) => {
    const today = new Date();

    const userData = {
        id_role: req.body.id_role,
        id_team: null,
        is_active: 1,
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        english_name: req.body.english_name,
        email: req.body.email,
        created_at: today,
        updated_at: today
    };

    User.findOne({
            where: {
                username: req.body.username
            }
        })
        //TODO bcrypt
        .then(user => {
            if (!user) {
                const hash = bcrypt.hashSync(userData.password, 10)
                userData.password = hash;
                //Create user
                User.create(userData)
                    .then(() => {
                        res.status(200).send({ message: 'Created user successfully' });
                    })
                    .catch(err => {
                        res.status(400).send({ message: err });
                    })
            } else {
                res.status(400).send({ message: 'User already exists' });
            }
        })
        .catch(err => {
            res.send({ message: err });
        })
})

//LOGIN
router.post('/authenticate', (req, res) => {
    User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            if (!user) {
                res.status(404).send({ message: 'Username or password is not correct!' })
            } else {
                if (bcrypt.compareSync(req.body.password, user.password())) {
                    if (user.is_active == 1) {
                        const payload = {
                            id: user.id,
                            id_role: user.id_role,
                            username: user.username,
                            email: user.email
                        }
                        let token = jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 86400
                        });
                        const body = {
                            id: user.id,
                            username: user.username,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            english_name: user.english_name,
                            position: user.position,
                            token: token,
                        };
                        res.json(body);
                    } else {
                        res.status(403).send({message: 'Your account has been temporarily locked'});
                    }
                } else {
                    res.status(404).send({ message: 'Username or password is not correct!', token: null });
                }
            }

        })
        .catch(err => {
            res.status(400).send({ message: err });
        })
});

//STORAGE
// router.use(authenticate);

// router.use((req, res, next) => {
//     // it go here
//     var token = req.headers['authorization'];
//     if (token) {
//         //console.log(token);
//         jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//             if (err) {
//                 //next();
//                 return res.status(401).send({ auth: false, message: err });
//             } else {
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         res.status(401).send({ auth: false, message: 'No token provided.' });
//     }
// });

//PROFILE
router.get('/profile', authorize(), (req, res) => {
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    User.findOne({
            where: {
                id: req.decoded.id
            }
        })
        .then(user => {
            if (!user) {
                res.status(400).send({ message: 'User does not exist' });
            } else {
                res.status(200).send(user);
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        });
});

//GET USER BY ID
router.get('/profile/:id', authorize(), (req, res) => {
    const id = parseInt(req.params.id);
    Role.findOne({
        where: {
            id: req.decoded.id_role
        }
    }).then(role => {
        // only allow admins to access other user records
        if (id !== req.decoded.id && role.name !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
            User.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(user => {
                    if (!user) {
                        res.status(400).send({ message: 'User does not exist' });
                    } else {
                        res.status(200).send(user);
                    }
                })
                .catch(err => {
                    res.status(400).send({ message1: err });
                });
        }
    }).catch(err => {
        res.status(400).send({ message2: err });
    })
})

//LIST
router.get('/list', authorize(), (req, res) => {
    User.findAll({
            where: {
                is_active: {
                    [Op.gte]: [1]
                }
            },
            attributes: ['id', 'id_team', 'first_name', 'last_name', 'english_name'],
            include: [{
                model: Role,
                //attributes: ['name']
            }]
        })
        .then(users => {
            if (users.length == 0) {
                res.status(400).send({ message: 'There is no user' })
            } else {
                res.status(200).json(users);
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        });
});

//CHANGE_PASSWORD
router.put('/change_password', authorize(), (req, res) => {
    const today = new Date()
    User.findOne({
        where: {
            id: req.decoded.id
        }
    }).then(user => {
        if (bcrypt.compareSync(req.body.old_password, user.password())) {
            const hash = bcrypt.hashSync(req.body.new_password, 10);
            User.update({
                password: hash,
                updated_at: today
            }, {
                where: {
                    id: req.decoded.id
                }
            }).then(() => {
                res.status(200).send({message: 'Updated successfully'});
            }).catch(err => {
                res.status(400).send({ message: err });
            });
        } else {
            res.status(400).send({message: 'Incorrect old password'});
        }
    }).catch(err => {
        res.status(400).send({ message: err });
    })
});

//RESET PASSWORD
router.put('/reset_password/:id', authorize('admin'), (req, res) => {
    const today = new Date();
    const hash = bcrypt.hashSync('123456', 10)
    User.findOne({
        where: {
            id: req.params.id
        }
    }).then(user => {
        if (!user) {
            res.status(400).send({ message: 'User does not exist' });
        } else {
            User.update({
                password: hash,
                updated_at: today
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).send({ message: 'Reset password successfully' });
            }).catch(err => {
                res.status(400).send({ message1: err });
            })
        }
    }).catch(err => {
        res.status(400).send({ message2: err });
    })
});

//UPDATE USER INFORMATION
router.put('/update/:id', authorize('admin'), (req, res) => {
    const today = new Date();
    //const id = req.params.id;
    User.findOne({
        where: {
            id: req.params.id
        }
    }).then(user => {
        if (!user) {
            res.status(400).send({ message: 'User does not exist' });
        } else {
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
                other: req.body.other,
                updated_at: today
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).send({ message: 'Updated successfully' });
            }).catch(err => {
                res.status(400).send({ message1: err });
            })
        }
    }).catch(err => {
        res.status(400).send({ message2: err });
    })
})


//UPDATE PERSONAL INFORMATION
router.put('/update_profile', authorize(), (req, res) => {
    const today = new Date()
    User.update({
        phone: req.body.phone,
        address: req.body.address,
        other: req.body.other,
        updated_at: today
    }, {
        where: {
            id: req.decoded.id
        }
    }).then(() => {
        res.status(200).send({ message: 'Updated successfully' });
    }).catch(err => {
        res.status(400).send({ message: err });
    })
})

//UPLOAD AVATAR
const storage = multer.diskStorage({
    destination: (res, file, cb) => {
        cb(null, './uploads/avatar/')
    },
    filename: (req, file, cb) => {
        cb(null, req.decoded.username + '_' + new Date().toISOString() + '_' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.post('/upload_avatar', authorize(), upload.single('avatar'), (req, res, next) => {
    //console.log(req.file);
    if (req.file === undefined) {
        res.status(404).send({ message: 'Wrong type input' })
    } else {
        User.update({
            ava_url: req.file.path
        }, {
            where: {
                id: req.decoded.id
            }
        }).then(() => {
            res.status(200).send({ message: 'Uploaded avatar successfully', path: req.file.path });
        }).catch(err => {
            res.status(400).send('err' + err);
        })
    }

})

//DELETE

router.post('/delete_user', (req, res) => {
    User.destroy({
        where: {
            id: req.body.id
        }
    }).then(user => {
        if (!user) {
            res.status(400).send({ message: 'User does not exist' })
        } else {
            res.status(200).send({ message: 'Delete successfully' })
        }
    })
})

// router.post('/', (req, res) => {
//     //To calculate Total Count use MySQL count function
//     var query = "Select count(*) as TotalCount from ??";
//     // Mention table from where you want to fetch records example-users
//     var table = ["users"];
//     query = mysql.format(query, table);
//     connection.query(query, function(err, rows) {
//         if (err) {
//             return err;
//         } else {

//             //store Total count in variable
//             let totalCount = rows[0].TotalCount

//             if (req.body.start == '' || req.body.limit == '') {
//                 let startNum = 0;
//                 let LimitNum = 10;
//             } else {
//                 //parse int Convert String to number 
//                 let startNum = parseInt(req.body.start);
//                 let LimitNum = parseInt(req.body.limit);
//             }
//         }

//         var query = "Select * from ?? ORDER BY created_at DESC limit ? OFFSET ?";
//         //Mention table from where you want to fetch records example-users & send limit and start 
//         var table = ["users", LimitNum, startNum];
//         query = mysql.format(query, table);
//         connection.query(query, function(err, rest) {
//             if (err) {
//                 res.json(err);
//             } else {
//                 // Total Count varibale display total Count in Db and data display the records
//                 res.json({ "Total Count": totalCount, "data": rest })
//             }
//         });
//     });
// })

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

module.exports = router;