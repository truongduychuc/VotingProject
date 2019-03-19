const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
    //const multer = require('multer')

const User = require('../models/User')

users.use(cors())

process.env.SECRET_KEY = 'secret'

//REGISTER
users.post('/register', (req, res) => {
    const today = new Date()

    const userData = {
        id_role: null,
        id_team: null,
        is_active: 1,
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        english_name: req.body.english_name,
        email: req.body.email,
        created_at: today,
        updated_at: null
    }

    User.findOne({
            where: {
                username: req.body.username
            }
        })
        //TODO bcrypt
        .then(user => {
            if (!user) {
                if (req.body.position == "Manager") {
                    userData.id_role = 2;
                }
                if (req.body.position == "Engineer") {
                    userData.id_role = 3;
                }
                const hash = bcrypt.hashSync(userData.password, 10)
                userData.password = hash
                User.create(userData)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 86400
                        })
                        res.json({ token: token, user: userData })
                    })
                    .catch(err => {
                        res.status(200).send({ 'err': err })
                    })
            } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//LOGIN
users.post('/authenticate', (req, res) => {
    User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                if (user.is_active == 1) {
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 86400
                    })
                    let body = {
                        id: user.id,
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        token: token
                    }
                    res.json(body)
                } else {
                    res.status(403).send('Your account has been temporarily locked')
                }
            } else {
                res.send({ auth: false, token: null })
            }
        })
        .catch(err => {
            res.send('err: ' + err)
        })
})

//STORAGE
users.use((req, res, next) => {
    // it go here
    var token = req.headers['authorization']
    if (token) {
        //console.log(token);
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                //next();
                return res.send({ auth: false, message: err });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).send({ auth: false, message: 'No token provided.' });
    }
})

//LIST
users.get('/list', (req, res) => {
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
            where: {
                id: req.decoded.id
            }
        })
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.send('User does not exist')
            }
        })
        .catch(err => {
            res.send('err:' + err)
        })
        // User.findAll()
        //     .then(users => {
        //         res.json(users)
        //     })
        //     .catch(err => {
        //         res.send('err' + err)
        //     })
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
module.exports = users