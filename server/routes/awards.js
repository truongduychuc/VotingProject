const express = require('express');
const router = express.Router();

const Award = require('../models/award');
const Voter = require('../models/voter');
const User = require('../models/user');

router.post('/create', (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const awardData = {
        name: req.body.name,
        description: req.body.description,
        year: null,
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        prize: req.body.prize,
        item: req.body.item,
        create_at: today,
        update_at: today
    }
    const voterData = {
        id_award: null,
        id_user: null,
        vote_ability: 1,
        vote_status: 1,
        updated_at: today
    }

    // function addVoter(i, users) {
    //     return new Promise((resolve, reject) => {
    //         resolve(voterData.id_user === users[i].id)
    //     })
    // }
    // async function add(users) {
    //     for (var i = 0; i <= users.length; i++) {
    //         await addVoter(i, users);
    //         Voter.create(voterData);
    //     }
    // }
    function add(users) {
        for (var i = 0; i <= users.length; i++) {
            voterData.id_user = users[i].id;
            cb();
        }
    }
    var cb = function() {
        Voter.create(voterData);
    }

    Award.findAll({
        where: {
            name: req.body.name,
            year: year
        }
    }).then(awards => {
        //console.log(awards);
        if (awards.length == 0) {
            awardData.year = year;
            Award.create(awardData)
                .then(award => {
                    voterData.id_award = award.id;
                    User.findAll({
                            where: {
                                id_role: req.body.id_role
                            }
                        }).then(users => {
                            //res.status(200).send({ message: "OK" })
                            // for (var i = 0; i <= users.length; i++) {
                            //     add(users, i);
                            //     addVoter();
                            //     //console.log(users[i].id);
                            // }
                            add(users);
                            // //id_user === users[0].id_user;
                            //Voter.create(voterData);\
                            res.status(200).send({ message: 'Create award successfully.' });
                        })
                        .catch(err => {
                            res.status(400).send({ error1: err })
                        })
                })
                .catch(err => {
                    res.status(400).send({ error2: err })
                })
        } else {
            res.status(400).send({ message: 'Award already exists.' });
        }
    }).catch(err => {
        res.status(400).send({ error3: err })
    })

})
module.exports = router;