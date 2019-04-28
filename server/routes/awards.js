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

/*
API
/awards

createAward(admin): (post) /create
listAward: (get) /list
updateAward(admin): (put) /update/:id
uploadLogo(admin): (post) /upload_logo/:id
getAwardInfo: (get) /:id
getPastWinner: (get) /past_winner/:id
getRankingBreakdown: (get) /breakdown/:id

deleteAward(admin): (post) /delete/:id (not done)

*/




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
        created_at: today,
        updated_at: today
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

    //Check year and name for award

    // multichain.initiateMultichain().listStreamKeyItems({
    //     stream: "award_150",
    //     key: "nominee_1",
    //     verbose: true
    // })

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
                    //year: req.body.year
            }
        })
        .then(awards => {
            if (awards.length != 0) {
                res.status(400).send({ message: 'Award already exists.' });
            } else {
                //Create award
                awardData.year = year;
                //awardData.year = req.body.year;
                Award.create(awardData)
                    .then(award => {

                        //multichain.getInfo();
                        let stream_name = 'award_' + award.id;
                        let asset_name = 'asset_' + award.id;
                        let token_name = 'token_' + award.id;
                        console.log(stream_name);
                        //Create new stream
                        multichain.createStream(stream_name);
                        //Subscribe
                        multichain.subscribe(stream_name);
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
                                    "created_at": awardData.created_at,
                                    "updated_at": awardData.updated_at
                                }
                            }
                        }, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Input infomation of award to stream successfully');
                            }
                        });

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


                                            multichain.initiateMultichain().getNewAddress()
                                                .then(address => {
                                                    console.log('Get a new address for asset');
                                                    //Grant permission for asset
                                                    multichain.grant(address, 'receive,send');
                                                    let asset_data = {
                                                        id: 0,
                                                        address: address
                                                    }
                                                    multichain.publish(stream_name, asset_name, asset_data);
                                                    //Create new asset
                                                    multichain.issue(address, token_name, users.length * 9);
                                                })
                                                .then(() => {
                                                    for (var i = 0; i < users.length; i++) {
                                                        voterData.id_user = users[i].id;
                                                        let id = users[i].id;
                                                        multichain.initiateMultichain().listStreamKeyItems({
                                                                stream: stream_name,
                                                                key: asset_name,
                                                                verbose: true
                                                            })
                                                            .then(asset => {
                                                                let asset_txid = asset[0].txid;
                                                                console.log(asset_txid);
                                                                multichain.initiateMultichain().getStreamItem({
                                                                        stream: stream_name,
                                                                        txid: asset_txid
                                                                    })
                                                                    .then(result => {
                                                                        //Get address of asset
                                                                        address1 = result.data.json.address;
                                                                        //Get new address
                                                                        multichain.initiateMultichain().getNewAddress()
                                                                            .then(address2 => {
                                                                                console.log('Get new address for voter ');
                                                                                //Grant permission for voter
                                                                                multichain.grant(address2, 'receive,send');
                                                                                //Save data to stream
                                                                                let key_name1 = 'voter';
                                                                                User.findOne({
                                                                                        where: {
                                                                                            id: id
                                                                                        }
                                                                                    })
                                                                                    .then(user => {
                                                                                        let voter_data = {
                                                                                            id: user.id,
                                                                                            first_name: user.first_name,
                                                                                            last_name: user.last_name,
                                                                                            english_name: user.english_name,
                                                                                            address: address2
                                                                                        }
                                                                                        multichain.publishEmployee(stream_name, key_name1, voter_data);
                                                                                        //Send token to voter
                                                                                        multichain.sendAssetFrom(address1, address2, token_name, 9);
                                                                                        //Revoke permission
                                                                                        multichain.revoke(address2, 'receive,send');
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log('Error when send token ' + err);
                                                                                    })
                                                                            })
                                                                            .catch(err => {
                                                                                console.log('Error when get new address ' + err);
                                                                            })
                                                                    })
                                                                    .catch(err => {
                                                                        console.log('Error when get stream item ' + err);
                                                                    })
                                                            })
                                                            .catch(err => {
                                                                console.log('Error when list asset address ' + err);
                                                            })


                                                        //Add voter
                                                        Voter.create(voterData)
                                                            .then(() => {})
                                                            .catch(err => {
                                                                console.log('error0' + err)
                                                                res.status(400).send({ error0: err })
                                                            })
                                                    }

                                                })
                                                .catch(err => {
                                                    console.log('Error when set new address ' + err);
                                                })
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
                                        if (users.length == 0) {
                                            res.status(400).send({ message: 'User does not exist' })
                                        } else {
                                            for (var i = 0; i < users.length; i++) {
                                                nomineeData.id_team = users[i].id_team;
                                                nomineeData.id_nominee = users[i].id;
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
                                                    .then(() => {})
                                                    .catch(err => {
                                                        console.log('error0' + err)
                                                        res.status(400).send({ error5: err })
                                                    })
                                            }
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
                    as: 'nominee_name',
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

router.post('/voting_award', authorize(), (req, res) => {
    let today = new Date();
    let id_award = req.body.id;
    let first_vote = req.body.first_vote;
    let second_vote = req.body.second_vote;
    let third_vote = req.body.third_vote;

    Award.findOne({
            where: {
                id: id_award
            }
        })
        .then(award => {
            if (!award) {
                res.status(400).send({ message: 'There is no award' });
            } else {
                Voter.findOne({
                        where: {
                            id_award: id_award,
                            id_user: req.decoded.id
                        }
                    })
                    .then(voter => {
                        if (!voter) {
                            res.status(400).send({ message: 'You are not allowed to vote this award' });
                        } else {
                            let data = {
                                id: id_award,
                                id_voter: req.decoded.id,
                                id_nominee_first: first_vote,
                                id_nominee_second: second_vote,
                                id_nominee_third: third_vote,
                            }
                            let token_name = 'token_' + data.id;
                            let stream_name = 'award_' + data.id;
                            let key_name1 = 'nominee_' + data.id_nominee_first;
                            let key_name2 = 'nominee_' + data.id_nominee_second;
                            let key_name3 = 'nominee_' + data.id_nominee_third;
                            //List voter
                            multichain.initiateMultichain().listStreamKeyItems({
                                    stream: stream_name,
                                    key: 'voter'
                                })
                                .then(voters => {
                                    console.log('Get list voter successfully');
                                    for (var i = 0; i < voters.length; i++) {
                                        //Get txid
                                        let txid = voters[i].txid;
                                        //Check id voter
                                        multichain.initiateMultichain().getStreamItem({
                                                stream: stream_name,
                                                txid: txid
                                            })
                                            .then(voter => {
                                                let id_voter = voter.data.json.id;
                                                if (data.id_voter == id_voter) {
                                                    let address1 = voter.data.json.address;
                                                    multichain.initiateMultichain().getAddressBalances({
                                                        address: address1
                                                    }).then(qty => {
                                                        if (qty.length == 0) {
                                                            Voter.update({
                                                                    vote_status: 0,
                                                                    updated_at: today
                                                                }, {
                                                                    where: {
                                                                        id_award: id_award,
                                                                        id_user: req.decoded.id
                                                                    }
                                                                })
                                                                .then(() => {
                                                                    res.status(400).send({ message: 'You already voted this award' });
                                                                })
                                                        } else {
                                                            if (!checkVoteValid(id_award, first_vote, second_vote, third_vote)) {
                                                                res.status(400).send({ message: 'Your vote is invalid' });
                                                            } else {
                                                                multichain.grant(address1, 'receive,send');
                                                                console.log('Get info voter successfully', address1);
                                                                multichain.initiateMultichain().listStreamKeyItems({
                                                                        stream: stream_name,
                                                                        key: 'nominee'
                                                                    })
                                                                    .then(nominees => {
                                                                        console.log('Get list nominee successfully');
                                                                        for (var i = 0; i <= nominees.length; i++) {
                                                                            let txid1 = nominees[i].txid;
                                                                            multichain.initiateMultichain().getStreamItem({
                                                                                    stream: stream_name,
                                                                                    txid: txid1
                                                                                })
                                                                                .then(nominee => {
                                                                                    console.log('Get info nominee successfully');
                                                                                    let id_nominee = nominee.data.json.id;
                                                                                    let address2 = nominee.data.json.address;
                                                                                    //First vote
                                                                                    if (data.id_nominee_first == id_nominee) {

                                                                                        amount = 5;
                                                                                        console.log('Determined first_vote user');
                                                                                        // console.log(address1, address2, token_name, amount);
                                                                                        multichain.initiateMultichain().sendAssetFrom({
                                                                                                from: address1,
                                                                                                to: address2,
                                                                                                asset: token_name,
                                                                                                qty: amount
                                                                                            })
                                                                                            .then(() => {
                                                                                                console.log('Send token to first_vote user successfully');
                                                                                                multichain.initiateMultichain().getStreamKeySummary({
                                                                                                        stream: stream_name,
                                                                                                        key: key_name1,
                                                                                                        mode: 'jsonobjectmerge'
                                                                                                    })
                                                                                                    .then(votes => {
                                                                                                        let voteChange = votes.json.first_votes + 1;
                                                                                                        multichain.initiateMultichain().publish({
                                                                                                            stream: stream_name,
                                                                                                            key: key_name1,
                                                                                                            data: {
                                                                                                                "json": {
                                                                                                                    "first_votes": voteChange,
                                                                                                                }
                                                                                                            }
                                                                                                        })
                                                                                                    })
                                                                                                    .catch(err => {
                                                                                                        console.log('Error when merge votes ' + err);
                                                                                                    })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log('Error when send token ' + err);
                                                                                            })
                                                                                    }

                                                                                    //Second vote
                                                                                    if (data.id_nominee_second == id_nominee) {
                                                                                        amount = 3;
                                                                                        console.log('Determined second_vote user');
                                                                                        multichain.initiateMultichain().sendAssetFrom({
                                                                                                from: address1,
                                                                                                to: address2,
                                                                                                asset: token_name,
                                                                                                qty: amount
                                                                                            })
                                                                                            .then(() => {
                                                                                                console.log('Send token to second_vote user successfully');

                                                                                                multichain.initiateMultichain().getStreamKeySummary({
                                                                                                        stream: stream_name,
                                                                                                        key: key_name2,
                                                                                                        mode: 'jsonobjectmerge'
                                                                                                    })
                                                                                                    .then(votes => {
                                                                                                        let voteChange = votes.json.second_votes + 1;
                                                                                                        multichain.initiateMultichain().publish({
                                                                                                                stream: stream_name,
                                                                                                                key: key_name2,
                                                                                                                data: {
                                                                                                                    "json": {
                                                                                                                        "second_votes": voteChange,
                                                                                                                    }
                                                                                                                }
                                                                                                            }

                                                                                                        )
                                                                                                    })
                                                                                                    .catch(err => {
                                                                                                        console.log('Error when merge votes ' + err);
                                                                                                        // res.status(400).send({ message: 'Error when merge token ' });
                                                                                                    })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log('Error when send token ' + err);
                                                                                                //res.status(400).send({ message: 'Error when send token ' });
                                                                                            })
                                                                                    }

                                                                                    // Third_vote
                                                                                    if (data.id_nominee_third == id_nominee) {
                                                                                        amount = 1;
                                                                                        console.log('Determined third_vote user');
                                                                                        multichain.initiateMultichain().sendAssetFrom({
                                                                                                from: address1,
                                                                                                to: address2,
                                                                                                asset: token_name,
                                                                                                qty: amount
                                                                                            })
                                                                                            .then(() => {
                                                                                                console.log('Send token to third_vote user successfully');

                                                                                                multichain.initiateMultichain().getStreamKeySummary({
                                                                                                        stream: stream_name,
                                                                                                        key: key_name3,
                                                                                                        mode: 'jsonobjectmerge'
                                                                                                    })
                                                                                                    .then(votes => {
                                                                                                        let voteChange = votes.json.third_votes + 1;
                                                                                                        multichain.initiateMultichain().publish({
                                                                                                            stream: stream_name,
                                                                                                            key: key_name3,
                                                                                                            data: {
                                                                                                                "json": {
                                                                                                                    "third_votes": voteChange,
                                                                                                                }
                                                                                                            }
                                                                                                        })
                                                                                                    })
                                                                                                    .catch(err => {
                                                                                                        console.log('Error when merge votes ' + err);
                                                                                                    })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log('Error when send token ' + err);
                                                                                            })
                                                                                    }
                                                                                })
                                                                                .catch(err => {
                                                                                    console.log('Error when get info nominee ' + err);
                                                                                })
                                                                        }

                                                                    })
                                                                    .catch(err => {
                                                                        console.log('Error when get list nominee ' + err);
                                                                    })
                                                                res.status(200).send({ message: 'You voted successfully' });
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                            .catch(err => {
                                                console.log('Error when get info voter ' + err);
                                            })
                                    }
                                })
                                .catch(err => {
                                    console.log('Error when get list voter ' + err);
                                })
                        }
                    })
                    .catch(err => {
                        res.status(400).send({ message1: err });
                    })
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        })
})

// router.get('award_name', (req, res) => {
//     Award.findAll({

//     })
// })

function checkVoteValid(id, first_vote, second_vote, third_vote) {
    id_award = id;
    first_vote = first_vote;
    second_vote = second_vote;
    third_vote = third_vote;
    if (id_award == '' || first_vote == '' || second_vote == '' || third_vote == '') {
        return false;
    }
    return true;
}

router.get('/get/123', (req, res) => {
    multichain.initiateMultichain().getStreamKeySummary({
        stream: "award_150",
        key: "nominee_1",
        mode: "jsonobjectmerge"
    }, (err, info) => {
        console.log('Response: ' + JSON.stringify(info));

        res.header("Content-Type", 'application/json');

        res.json({ liststream: info });
    })
})

router.get('/get/getliststreamkey', (req, res) => {
    multichain.initiateMultichain().listStreamKeys({
        stream: "award_150",
        //key: "nominee_1",
        verbose: true
    }, (err, info) => {
        console.log('Response: ' + JSON.stringify(info));

        res.header("Content-Type", 'application/json');

        res.json({ liststream: info });
    })
})

router.get('/get/getliststreamkeyitem', (req, res) => {
    multichain.initiateMultichain().listStreamKeyItems({
        stream: "award_150",
        key: "nominee_1",
        verbose: true
    }, (err, info) => {
        console.log('Response: ' + JSON.stringify(info));

        res.header("Content-Type", 'application/json');

        res.json({ liststream: info });
    })
})
module.exports = router;