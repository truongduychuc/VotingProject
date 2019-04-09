const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const multer = require('multer');
const cors = require('cors');

const authorize = require('../helpers/authorize');

const Award = require('../models/award');
const Voter = require('../models/voter');
const User = require('../models/user');
const Nominee = require('../models/nominee');
const Winner = require('../models/winner');
const Breakdown = require('../models/breakdown');


Award.hasOne(Winner, { foreignKey: 'id_award' });
Winner.belongsTo(User, { foreignKey: 'id_winner' });
Breakdown.belongsTo(User, { foreignKey: 'id_nominee' });

var moment = require('moment');

router.use(cors());

//CREATE AN AWARD
router.post('/create', (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const awardData = {
        name: req.body.name,
        description: null,
        year: null,
        status: 1,
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
    const nomineeData = {
        id_award: null,
        id_team: null,
        id_nominee: null,
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

    // function addAward(users) {
    //     for (var i = 0; i <= users.length; i++) {
    //         voterData.id_user = users[i].id;
    //         Voter.create(voterData);
    //     }
    // }

    function checkDateinput() {
        if (req.body.date_start > req.body.date_end) {
            res.status(400).send({ message: 'Date end must be greater than date start' });
            return false;
        } else {
            var con = moment(req.body.date_start).isBefore(today);
            if (con) {
                res.status(400).send({ message: 'Date start must be greater than today' });
                return false;
            } else {
                return true;
            }
        }
    }

    if ((req.body.year < (year - 1)) || (req.body.year > year)) {

        console.log(today);
        res.status(400).send({ message: 'Wrong year input' });
    } else {
        if (!checkDateinput()) {
            console.log('Date input wrong');
        } else {
            Award.findAll({
                    where: {
                        name: req.body.name,
                        year: req.body.year
                    }
                })
                .then(awards => {
                    if (awards.length != 0) {
                        res.status(400).send({ message: 'Award already exists.' });
                    } else {
                        //Create award
                        awardData.year = year;
                        Award.create(awardData)
                            .then(award => {
                                voterData.id_award = award.id;
                                nomineeData.id_award = award.id;
                                //Find voter with role
                                User.findAll({
                                        where: {
                                            id_role: req.body.id_role_voter
                                        }
                                    })
                                    .then(users => {
                                        if (users.length == 0) {
                                            res.status(400).send({ message: 'There is no user' });
                                        } else {
                                            for (var i = 0; i < users.length; i++) {
                                                voterData.id_user = users[i].id;
                                                //Add voter
                                                Voter.create(voterData)
                                                    .then(() => {})
                                                    .catch(err => {
                                                        console.log('error0' + err)
                                                        res.status(400).send({ error0: err })
                                                    })
                                            }

                                        }
                                    })
                                    .catch(err => {
                                        res.status(400).send({ error1: err })
                                    })
                                    // .then(() => {

                                // })
                                // Find nominee with id
                                User.findAll({
                                        where: {
                                            id: req.body.id_nominee
                                        }
                                    })
                                    .then(users => {
                                        //console.log(users);
                                        for (var i = 0; i < users.length; i++) {
                                            nomineeData.id_team = users[i].id_team;
                                            nomineeData.id_nominee = users[i].id;
                                            //Add nominee
                                            Nominee.create(nomineeData)
                                                .then(() => {})
                                                .catch(err => {
                                                    console.log('error0' + err)
                                                    res.status(400).send({ error5: err })
                                                })
                                        }
                                        res.status(200).send({ message: 'Create award successfully.' });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(400).send({ error4: err })
                                    })

                            })
                            .catch(err => {
                                res.status(400).send({ error2: err })
                            })
                    }
                })
                .catch(err => {
                    res.status(400).send({ error3: err })
                })
        }
    }
})


//LIST
router.get('/list', (req, res) => {
    Award.findAll({
            where: {
                status: 0
            },
            order: [
                ['date_start', 'DESC']
            ],
        })
        .then(awards => {
            if (awards.length === 0) {
                res.status(400).send({ message: 'There is no award' })
            } else {
                res.status(200).json(awards);
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        });
});


//UPDATE AWARD INFORMATION
router.put('update/:id', (req, res) => {
    const today = new Date();
    if (!checkDateinput()) {
        console.log('Date input wrong');
    } else {
        Award.update({
                status: req.body.status,
                description: req.body.description,
                date_start: req.body.date_start,
                date_end: req.body.date_end,
                prize: req.body.prize,
                item: req.body.item,
                update_at: today
            }, {
                where: {
                    id: req.params.id
                }
            })
            .then(() => {
                res.status(200).send({ message: 'Updated successfully' });
            })
            .catch(err => {
                res.status(400).send({ message: err });
            })
    }

})

//UPLOAD AVATAR
const storage = multer.diskStorage({
    destination: (res, file, cb) => {
        cb(null, './uploads/logos')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname)
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

router.post('/upload_logo/:id', upload.single('logo'), (req, res, next) => {
    console.log(req.file);
    if (req.file === undefined) {
        res.status(404).send({ message: 'Wrong type input' })
    } else {
        Award.update({
            logo_url: req.file.path
        }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.status(200).send({ message: 'Uploaded logo successfully', path: req.file.path });
        }).catch(err => {
            res.status(400).send('err' + err);
        })
    }

})

//DISPLAY AWARD
router.get('/:id', (req, res) => {
    Award.findOne({
            where: {
                id: req.params.id
            },
            attributes: {},
            include: [{
                model: Winner,
                attributes: ['id_winner', 'percent'],
                include: [{
                    model: User,
                    attributes: ['first_name', 'last_name', 'english_name']
                }]
            }]
        })
        .then(award => {
            if (!award) {
                res.status(400).send({ message: 'Award does not exist' });
            } else {
                res.status(200).send(award);
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        })
})

//RANKING BREAKDOWN
router.get('/breakdown/:id', (req, res) => {
    Breakdown.findAll({
            where: {
                id_award: req.params.id
            },
            include: [{
                model: User,
                attributes: ['first_name', 'last_name', 'english_name']
            }]

        }).then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(400).send({ message: err });
        })
})
module.exports = router;