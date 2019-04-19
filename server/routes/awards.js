const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const multer = require('multer');
const cors = require('cors');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const authorize = require('../helpers/authorize');

const Award = require('../models/award');
const Voter = require('../models/voter');
const User = require('../models/user');
const Nominee = require('../models/nominee');
const Winner = require('../models/winner');
const Breakdown = require('../models/breakdown');
const multichain = require('../helpers/multichain');

router.use(cors());

Award.hasOne(Winner, { foreignKey: 'id_award', as: 'winner', constraints: false });
Winner.belongsTo(Award, { foreignKey: 'id_award', as: 'winner', constraints: false });

Winner.belongsTo(User, { foreignKey: 'id_winner', as: 'winner_name', constraints: false });
User.hasOne(Winner, { foreignKey: 'id_winner', as: 'winner_name', constraints: false });

Breakdown.belongsTo(User, { foreignKey: 'id_nominee', as: 'nominee_name' });

Award.hasOne(Nominee, { foreignKey: 'id_award' });
Nominee.belongsTo(User, { foreignKey: 'id_nominee', as: 'nominee_name' });

var moment = require('moment');



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

    // function addAward(users) {
    //     for (var i = 0; i <= users.length; i++) {
    //         voterData.id_user = users[i].id;
    //         Voter.create(voterData);
    //     }
    // }

    // function checkDateinput() {
    //     if (req.body.date_start > req.body.date_end) {
    //         res.status(400).send({ message: 'Date end must be greater than date start' });
    //         return false;
    //     } else {
    //         var con = moment(req.body.date_start).isBefore(today);
    //         if (con) {
    //             res.status(400).send({ message: 'Date start must be greater than today' });
    //             return false;
    //         } else {
    //             return true;
    //         }
    //     }
    // }

    // if ((req.body.year < (year - 1)) || (req.body.year > year)) {
    //     console.log(today);
    //     res.status(400).send({ message: 'Wrong year input' });
    // } else {
    // if (!checkDateinput()) {
    //     console.log('Date input wrong');
    // } else {
    Award.findAll({
            where: {
                name: req.body.name,
                year: 2000
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
                        //multichain.getInfo();
                        let stream_name = 'award_' + award.id;
                        console.log(stream_name);
                        multichain.createStream(stream_name);
                        voterData.id_award = award.id;
                        nomineeData.id_award = award.id;
                        //Find voter with role
                        const voter = req.body.id_role_voter;
                        if (voter.length == 0) {
                            res.status(400).send({ message: 'There is no voter' });
                        } else {
                            for (var j = 0; j < voter.length; j++) {
                                User.findAll({
                                        where: {
                                            id_role: voter[j]
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
                            }
                        }
                        // Find nominee with id
                        const nominee = req.body.id_nominee;
                        if (nominee.length == 0) {
                            res.status(400).send({ message: 'There is no nominee' });
                        } else {
                            for (var k = 0; k < nominee.length; k++) {
                                User.findAll({
                                        where: {
                                            id: nominee[k]
                                        }
                                    })
                                    .then(users => {
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
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(400).send({ error4: err })
                                    })
                            }
                        }
                        res.status(200).send({ message: 'Create award successfully.' });
                    })
                    .catch(err => {
                        res.status(400).send({ error2: err })
                    })
            }
        })
        .catch(err => {
            res.status(400).send({ error3: err })
        })
        // }
        // }
})


//LIST
router.get('/list', (req, res) => {
    Award.findAll({
            where: {
                status: 0,
                id: 30,
            },
            include: [{
                model: Nominee,
                attributes: ['id_nominee'],
                include: [{
                    model: User,
                    as: 'name',
                    attributes: ['english_name']
                }]
            }],
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

//UPLOAD LOGO
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
            //attributes: {},
            include: [{
                model: Winner,
                as: 'winner',
                attributes: ['id_winner', 'percent'],
                include: [{
                    model: User,
                    as: 'winner_name',
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
    console.log(table);
    Award.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(award => {
            if (!award) {
                res.status(400).send({ message: 'Award does not exist' });
            } else {
                if (award.status == 1) {
                    res.status(400).send({ message: 'This award is taking place' });
                } else {
                    console.log(1111111, award.name, award.year)
                    if (table == 'awardDetail') {
                        Award.findAll({
                                where: {
                                    name: award.name,
                                    year: {
                                        [Op.lte]: award.year
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
                                if (awards.length == 0) {
                                    res.status(400).send({ message: 'There is no winner' });
                                } else {
                                    res.status(200).json(awards);
                                }
                            })
                            .catch(err => {
                                res.status(400).send({ message1: err });
                            })
                    } else {
                        //table: finalResult -> winner, user -> winner_name
                        if (table == 'winner') {
                            Award.findAll({
                                    where: {
                                        name: award.name,
                                        year: {
                                            [Op.lte]: award.year
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
                                        res.status(400).send({ message: 'There is no winner' });
                                    } else {
                                        res.status(200).json(awards);
                                    }
                                })
                                .catch(err => {
                                    res.status(400).send({ message1: err });
                                })
                        } else {
                            if (table == 'winner_name') {
                                Award.findAll({
                                        where: {
                                            name: award.name,
                                            year: {
                                                [Op.lte]: award.year
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
                                            res.status(400).send({ message: 'There is no winner' });
                                        } else {
                                            res.status(200).json(awards);
                                        }
                                    })
                                    .catch(err => {
                                        res.status(400).send({ message1: err });
                                    })
                            } else {
                                res.status(400).send({ message: 'Wrong table' });
                            }
                        }
                    }
                }
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
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

    Breakdown.findAndCountAll({
            where: {
                id_award: req.params.id
            },
        })
        .then(data => {
            if (data.count == 0) {
                res.status(400).send({ message: 'There is no nominee', total_counts: data.count });
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
                                    res.status(400).send({ message: 'There is no result' });
                                } else {
                                    res.status(200).json({ 'data': breakdown, 'total_counts': data.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                }
                            })
                            .catch(err => {
                                res.status(400).send({ message: err });
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
                                        res.status(400).send({ message: 'There is no result' });
                                    } else {
                                        res.status(200).json({ 'data': breakdown, 'total_counts': data.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                    }
                                })
                                .catch(err => {
                                    res.status(400).send({ message: err });
                                })
                        } else {
                            res.status(400).send({ message: 'Wrong table' });
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
                                res.status(400).send({ message: 'There is no result', count: data1.count });
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
                                                res.status(400).send({ message: 'There is no result' });
                                            } else {
                                                res.status(200).json({ 'data': breakdown, 'total_counts': data.count, 'filtered_counts': data1.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                            }
                                        })
                                        .catch(err => {
                                            res.status(400).send({ message: err });
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
                                                    res.status(400).send({ message: 'There is no result' });
                                                } else {
                                                    res.status(200).json({ 'data': breakdown, 'total_counts': data.count, 'filtered_counts': data1.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                                }
                                            })
                                            .catch(err => {
                                                res.status(400).send({ message: err });
                                            })
                                    } else {
                                        res.status(400).send({ message: 'Wrong table' });
                                    }
                                }
                            }
                        })
                        .catch(err => {
                            res.status(400).send({ message1: err });
                        })

                }
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        })


    // Breakdown.findAll({
    //         where: {
    //             id_award: req.params.id
    //         },
    //         include: [{
    //             model: User,
    //             as: 'nominee_name',
    //             attributes: ['first_name', 'last_name', 'english_name']
    //         }],
    //         order: [
    //             ['rank', 'ASC']
    //         ]
    //     }).then(data => {
    //         res.status(200).send(data);
    //     })
    //     .catch(err => {
    //         res.status(400).send({ message: err });
    //     })
})
module.exports = router;