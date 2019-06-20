const jwt = require('jsonwebtoken');

process.env.SECRET_KEY = 'secret';

authenticate = (req, res, next) => {
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
    };    


module.exports = authenticate;