const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const multer = require('multer')

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
                // if (req.body.position == "Admin") {
                //     userData.id_role = 1;

                // }
                // if (req.body.position == "Manager") {
                //     userData.id_role = 2;

                // }
                // if (req.body.position == "Developer") {
                //     userData.id_role = 3;

                // }

                const hash = bcrypt.hashSync(userData.password, 10)
                userData.password = hash;

                User.create(userData)
                    .then(() => {
                        res.status(200).send({ message: "Created user successfully" });
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
                        //console.log(user.dataValues)
                        //console.log(user)
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
                        res.status(403).send('Your account has been temporarily locked');
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
router.use((req, res, next) => {
    // it go here
    var token = req.headers['authorization'];
    if (token) {
        //console.log(token);
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                //next();
                return res.status(401).send({ auth: false, message: err });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).send({ auth: false, message: 'No token provided.' });
    }
});

//PROFILE
router.get('/profile', (req, res) => {
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    User.findOne({
            where: {
                id: req.decoded.id
            }
        })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.send('User does not exist');
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        });
});

//LIST
router.get('/list', (req, res) => {
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
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(400).send({ message: err });
        });
});

//CHANGE_PASSWORD
router.put('/change_password', (req, res) => {
    const today = new Date()
    User.findOne({
        where: {
            id: req.decoded.id
        }
    }).then(user => {
        if (bcrypt.compareSync(req.body.old_password, user.password())) {
            const hash = bcrypt.hash(req.body.new_password, 10);
            User.update({
                password: hash,
                updated_at: today
            }, {
                where: {
                    id: req.decoded.id
                }
            }).then(() => {
                res.status(200).send("Updated successfully");
            }).catch(err => {
                res.status(400).send({ message: err });
            });
        } else {
            res.status(400).send("Incorrect old password");
        }
    }).catch(err => {
        res.status(400).send({ message: err });
    })
});

//RESET PASSWORD
router.put('/reset_password/:id', authorize('1'), (req, res) => {
    const today = new Date();
    const hash = bcrypt.hashSync('123456', 10)
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
        res.status(400).send({ message: err });
    })
})

//UPDATE USER INFORMATION
router.put('/update/:id', authorize('1'), (req, res) => {
    const today = new Date();
    //const id = req.params.id;
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
        res.status(400).send({ message: err });
    })
})


//UPDATE PERSONAL INFORMATION
router.put('/update', (req, res) => {
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
        cb(null, './uploads/')
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

router.post('/upload_avatar', upload.single('avatar'), (req, res, next) => {
    console.log(req.file);
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

function authorize(id_role) {
    return [
        // authorize based on user role
        (req, res, next) => {
            if (!(id_role == req.decoded.id_role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }
            // authentication and authorization successful
            next();
        }
    ];
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
module.exports = router;