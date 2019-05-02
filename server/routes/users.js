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
const Team = require('../models/team');

router.use(cors());

process.env.SECRET_KEY = 'secret';

Role.hasMany(User, { foreignKey: 'id_role', constraints: false });
User.belongsTo(Role, { foreignKey: 'id_role', constraints: false });
Team.hasMany(User, { foreignKey: 'id_team', constraints: false });
User.belongsTo(Team, { foreignKey: 'id_team', constraints: false });

/*
API
/users

login: (post) /authenticate
createUser(admin): (post) /register
getRole: (get) /role
getTeam: (get) /team
getProfile: (get) /profile
getProfileById: (get) /profile/:id
listUser: (get) /list
listUser(admin): (get) /list/admin
changePassword: (put) /change_password
resetPassword(admin): (put) /reset_password/:id
updateProfile: (put) /update_profile
updateProfile(admin): (put) /update/:id
uploadAvatar: (post) /upload_avatar
listForNominating: (get) /list_for_nominating
deleteUser(admin): (post) /delete/:id

*/


//REGISTER
router.post('/register', (req, res) => {
    const today = new Date();
    if (req.body.id_team == '') {
        req.body.id_team = 99;
    }
    const userData = {
        id_role: req.body.id_role,
        id_team: req.body.id_team,
        is_active: 1,
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        english_name: req.body.english_name,
        email: req.body.email,
        ava_url: 'uploads/avatars/undefined_2019-04-26T03:22:00.179Z_defaut_ava.jpg',
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
            },
            include: [{
                model: Role
            }]
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
                            // username: user.username,
                            // email: user.email
                        }
                        let token = jwt.sign(payload, process.env.SECRET_KEY, {
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
                        res.json(body);
                    } else {
                        res.status(403).send({ message: 'Your account has been temporarily locked' });
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

//ROLE
router.get('/role', (req, res) => {
    Role.findAll()
        .then(roles => {
            if (roles.length == 0) {
                res.status(400).send({ message: 'There is no role' })
            } else {
                res.status(200).json(roles);
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        })
})

//TEAM
router.get('/team', (req, res) => {
    Team.findAll()
        .then(teams => {
            if (teams.length == 0) {
                res.status(400).send({ message: 'There is no team' })
            } else {
                res.status(200).json(teams);
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        })
})

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
            },
            attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'phone', 'address', 'other',
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
                res.status(400).send({ message: 'User does not exist' });
            } else {
                if (user.team == null) {
                    res.status(200).send({ user, message: 'User have not had a team yet' });
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
                                res.status(200).send({ user, message: 'This user has no direct manager' });
                            } else {
                                res.status(200).send({ user, directManager: directManager });
                            }
                        })
                        .catch(err => {
                            res.status(400).send({ message: err });
                        });
                }
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
                    },
                    attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'phone', 'is_active', 'address', 'other',
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
                        res.status(400).send({ message: 'User does not exist' });
                    } else {
                        if (user.team == null) {
                            res.status(200).send({ user, message: 'User have not had a team yet' });
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
                                        res.status(200).send({ user, message: 'This user has no direct manager' });
                                    } else {
                                        res.status(200).send({ user, directManager: directManager });
                                    }
                                })
                                .catch(err => {
                                    res.status(400).send({ message: err });
                                });
                        }
                    }
                })
                .catch(err => {
                    res.status(400).send({ message: err });
                })
        }
    }).catch(err => {
        res.status(400).send({ message2: err });
    })
})

//LIST
router.get('/list', (req, res) => {
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

    //Search
    let search = req.query.search;

    // Make lowercase
    // search = search.toLowerCase();

    //Count total entries
    User.findAndCountAll({
            where: {
                id_role: {
                    [Op.gt]: [1]
                },
                is_active: {
                    [Op.gte]: [1]
                }
            }
        })
        .then(data => {
            if (data.count == 0) {
                res.status(400).send({ message: 'There is no user', total_counts: data.count })
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
                        console.log(111111);
                        User.findAll({
                                where: {
                                    id_role: {
                                        [Op.gt]: [1]
                                    },
                                    is_active: {
                                        [Op.gte]: [1]
                                    }
                                },
                                attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
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
                            .then(users => {
                                if (users.length == 0) {
                                    res.status(400).send({ message: 'There is no user' });
                                } else {
                                    res.status(200).json({ 'data': users, 'total_counts': data.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                }
                            })
                            .catch(err => {
                                res.status(400).send({ message1: err })
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
                                    attributes: ['id', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
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
                                        res.status(400).send({ message: 'There is no user' });
                                    } else {
                                        res.status(200).json({ 'data': users, 'total_counts': data.count, 'offset': offset, 'limit': limit, 'pages': pages });
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
                // search != '' && search != null
                else {
                    console.log(2222);
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
                                res.status(400).send({ message: 'There is no result', count: data1.count })
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
                                                res.status(400).send({ message: 'There is no user' });
                                            } else {
                                                res.status(200).json({ 'data': users, 'total_counts': data.count, 'filtered_counts': data1.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                            }
                                        })
                                        .catch(err => {
                                            res.status(400).send({ message1: err })
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
                                                    res.status(400).send({ message: 'There is no user' });
                                                } else {
                                                    res.status(200).json({ 'data': users, 'total_counts': data.count, 'filtered_counts': data1.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                                }
                                            })
                                            .catch(err => {
                                                res.status(400).send({ message1: err })
                                            })
                                    } else {
                                        res.status(400).send({ message: 'Wrong table' })
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
})

//LIST (admin role)
router.get('/list/admin', authorize('admin'), (req, res) => {
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
    //Search
    let search = req.query.search;

    // Make lowercase
    // search = search.toLowerCase();

    //Count total entries
    User.findAndCountAll({
            // where: {
            //     id_role: {
            //         [Op.gt]: [1]
            //     },
            //     is_active: {
            //         [Op.gte]: [1]
            //     }
            // }
        })
        .then(data => {
            if (data.count == 0) {
                res.status(400).send({ message: 'There is no user', total_counts: data.count })
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
                        console.log(111111);
                        User.findAll({
                                // where: {
                                //     id_role: {
                                //         [Op.gt]: [1]
                                //     },
                                //     is_active: {
                                //         [Op.gte]: [1]
                                //     }
                                // },
                                attributes: ['id', 'is_active', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
                                include: [{
                                        model: Role,
                                        required: true,
                                        //attributes: ['name']  
                                    },
                                    {
                                        model: Team,
                                        //required: true,
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
                            .then(users => {
                                if (users.length == 0) {
                                    res.status(400).send({ message: 'There is no user' });
                                } else {
                                    res.status(200).json({ 'data': users, 'total_counts': data.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                }
                            })
                            .catch(err => {
                                res.status(400).send({ message1: err })
                            })
                    } else {
                        if (table == 'role' || table == 'team') {
                            User.findAll({
                                    // where: {
                                    //     id_role: {
                                    //         [Op.gt]: [1]
                                    //     },
                                    //     is_active: {
                                    //         [Op.gte]: [1]
                                    //     }
                                    // },
                                    attributes: ['id', 'is_active', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
                                    include: [{
                                            model: Role,
                                            required: true,
                                            //attributes: ['name']  
                                        },
                                        {
                                            model: Team,
                                            //required: true,
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
                                        res.status(400).send({ message: 'There is no user' });
                                    } else {
                                        res.status(200).json({ 'data': users, 'total_counts': data.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                    }
                                })
                                .catch(err => {
                                    res.status(400).send({ message1: err })
                                })
                        } else {
                            res.status(400).send({ message: 'Wrong table' })
                        }
                    }
                }
                // search != '' && search != null
                else {
                    console.log(2222);
                    // let totalCount = data.count;
                    User.findAndCountAll({
                            where: {
                                // id_role: {
                                //     [Op.gt]: [1]
                                // },
                                // is_active: {
                                //     [Op.gte]: [1]
                                // },
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
                                    //attributes: ['name']  
                                },
                                {
                                    model: Team,
                                    //required: true,
                                    //attributes: ['name']
                                }
                            ],
                        })
                        .then(data1 => {
                            if (data1.count == 0) {
                                res.status(400).send({ message: 'There is no result', total_counts: data1.count })
                            } else {
                                let pages = Math.ceil(data1.count / limit);
                                offset = limit * (page - 1);
                                if (page > pages) {
                                    offset = limit * (pages - 1);
                                }
                                console.log(data1, page, pages, offset, limit);
                                if (table == 'user') {
                                    User.findAll({
                                            where: {
                                                // id_role: {
                                                //     [Op.gt]: [1]
                                                // },
                                                // is_active: {
                                                //     [Op.gte]: [1]
                                                // },
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
                                            attributes: ['id', 'is_active', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
                                            include: [{
                                                    model: Role,
                                                    required: true,
                                                    //attributes: ['name']  
                                                },
                                                {
                                                    model: Team,
                                                    //required: true,
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
                                        .then(users => {
                                            if (users.length == 0) {
                                                res.status(400).send({ message: 'There is no result' });
                                            } else {
                                                res.status(200).json({ 'data': users, 'total_counts': data.count, 'filtered_counts': data1.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                            }
                                        })
                                        .catch(err => {
                                            res.status(400).send({ message1: err })
                                        })
                                } else {
                                    if (table == 'role' || table == 'team') {
                                        User.findAll({
                                                where: {
                                                    // id_role: {
                                                    //     [Op.gt]: [1]
                                                    // },
                                                    // is_active: {
                                                    //     [Op.gte]: [1]
                                                    // },
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
                                                attributes: ['id', 'is_active', 'first_name', 'last_name', 'english_name', 'email', 'ava_url'],
                                                include: [{
                                                        model: Role,
                                                        required: true,
                                                        //attributes: ['name']  
                                                    },
                                                    {
                                                        model: Team,
                                                        //required: true,
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
                                                    res.status(400).send({ message: 'There is no user' });
                                                } else {
                                                    res.status(200).json({ 'data': users, 'total_counts': data.count, 'filtered_counts': data1.count, 'offset': offset, 'limit': limit, 'pages': pages });
                                                }
                                            })
                                            .catch(err => {
                                                res.status(400).send({ message1: err })
                                            })
                                    } else {
                                        res.status(400).send({ message: 'Wrong table' })
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
})

//CHANGE_PASSWORD
router.put('/change_password', authorize(), (req, res) => {
    const today = new Date()
    User.findOne({
        where: {
            id: req.decoded.id
        }
    }).then(user => {
        if (!user) {
            res.status(400)({ message: 'User does not exist' });
        } else {
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
                    res.status(200).send({ message: 'Updated successfully' });
                }).catch(err => {
                    res.status(400).send({ message: err });
                });
            } else {
                res.status(400).send({ message: 'Incorrect old password' });
            }
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
            //console.log(req.body.id_team)
            if (req.body.id_team == '') {
                req.body.id_team = 99
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
        cb(null, './uploads/avatars/')
    },
    filename: (req, file, cb) => {
        cb(null, req.decoded.username + '_' + new Date().toISOString() + '_' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    //validate image type
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

//LIST USER FOR NOMINATING
router.get('/list_for_nominating', (req, res) => {
    Team.findAll({
            order: [
                ['name']
            ],
            include: [{
                model: User,
                where: {
                    is_active: 1
                },
                attributes: ['id', 'english_name'],
            }]
        })
        .then(data => {
            if (data.length == 0) {
                res.status(200).send({ message: 'There is no nominee' });
            } else {
                res.status(200).send({ data: data });
            }
        })
        .catch(err => {
            res.status(400).send({ message: 'Error when get list', err });
        })
})


//DELETE
router.post('/delete/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
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