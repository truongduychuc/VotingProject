const jwt = require('jsonwebtoken');
const Role = require('../models/role');

process.env.SECRET_KEY = 'secret';


function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        (req, res, next) => {
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
                        // authorize based on user role
                        Role.findOne({
                                where: {
                                    id: req.decoded.id_role
                                }
                            })
                            .then(role => {
                                if (roles.length && !roles.includes(role.name)) {
                                    // user's role is not authorized
                                    return res.status(401).json({ message: 'Unauthorized' });
                                }
                                next();
                            })
                            .catch(err => {
                                res.status(400).send({ message: err });
                            })
                    }
                });
            } else {
                res.status(401).send({ auth: false, message: 'No token provided.' });
            }
        }
    ]

}
module.exports = authorize;