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
                        res.send('error: ' + err)
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
        .then(user => {

        })
        .catch(err => {
            res.send('err: ' + err)
        })
    })
})

module.exports = users