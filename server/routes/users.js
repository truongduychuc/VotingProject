const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const multer = require('multer')

const User = require('../models/user');

router.use(cors());

process.env.SECRET_KEY = 'secret';

//REGISTER
router.post('/register', (req, res) => {
    const today = new Date();

    const userData = {
        id_role: null,
        id_team: null,
        is_active: 1,
        vote_ability: null,
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
                if (req.body.position == "Admin") {
                    userData.id_role = 1;
                    userData.vote_ability = 0;
                }
                if (req.body.position == "Manager") {
                    userData.id_role = 2;
                    userData.vote_ability = 1;
                }
                if (req.body.position == "Developer") {
                    userData.id_role = 3;
                    userData.vote_ability = 1;
                }
                bcrypt.hash(userData.password, 10, (err, hash) => {
                        if (!hash) {
                            res.status(400).send({ 'err': err });
                        } else {
                            userData.password = hash;
                        }
                    })
                    // const hash = bcrypt.hashSync(userData.password, 10);
                    // userData.password = hash;
                User.create(userData)
                    .then(() => {
                        res.status(200).send({ message: "Created user successfully" });
                    })
                    .catch(err => {
                        res.status(200).send({ 'err': err });
                    })
            } else {
                res.status(400).send({ message: 'User already exists' });
            }
        })
        .catch(err => {
            res.send('error: ' + err);
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
                if (bcrypt.compare(req.body.password, user.password())) {
                    if (user.is_active == 1) {
                        //console.log(user.dataValues)
                        //console.log(user)
                        const payload = {
                            id: user.id,
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
                            token: token
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
            res.send('err: ' + err);
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
            res.send('err:' + err);
        });

});

//LIST
router.get('/list', (req, res) => {
    User.findAll({
            // where: {
            //     id_role: {
            //         [Op.gte]: [2]
            //     }
            // },
            attributes: ['id', 'id_team', 'position', 'first_name', 'last_name', 'english_name']
        })
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.send('err' + err);
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
        //con = user.correctPassword(req.body.old_password);
        //console.log(con)
        // console.log(user.password())
        // console.log(user.password)
        if (bcrypt.compare(req.body.old_password, user.password())) {
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
                res.status(400).send('err' + err);
            });
        } else {
            res.status(400).send("Incorrect old password");
        }
    }).catch(err => {
        res.status(400).send('err' + err)
    })
});

//UPDATE INFORMATION
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
            res.status(200).send("Updated successfully");
        }).catch(err => {
            res.status(400).send('err' + err);
        })
        // }).catch(err => {
        //     res.status(400).send('err' + err);
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
        res.status(200).send({ message: 'Uploaded avatar successfully', path: req.file.path })
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