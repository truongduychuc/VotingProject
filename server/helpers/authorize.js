const jwt = require('jsonwebtoken');
const {role: Role, user: User, team: Team} = require('../models');
const {HTTP} = require('../helpers/constants');

function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return [
    (req, res, next) => {
      // it go here
      let token = req.header('Authorization');
      if (token) {
        const EMPTY_STR = '';
        token = (token && (token.startsWith('Bearer') || token.includes('Bearer'))) ? token.replace('Bearer ', EMPTY_STR) : EMPTY_STR;
        const secretKey = process.env.SECRET_KEY || 'secret';
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            return res.status(HTTP.UNAUTHORIZED).send({
              auth: false,
              message: err,
              error: "UNAUTHORIZED"
            });
          } else {
            req.decoded = decoded;
            // authorize based on user role
            Role.findOne({
              where: {
                id: req.decoded.id_role
              }
            })
              .then(role => {
                const {name} = role;
                const lowerCaseRoleName = name ? name.toLowerCase() : '';
                const lowerCaseRoleArr = roles.length > 0 ? roles.map(e => e.toLowerCase()) : [];
                if (lowerCaseRoleArr.length > 0 && !lowerCaseRoleArr.includes(lowerCaseRoleName)) {
                  // user's role is not authorized
                  return res.status(HTTP.FORBIDDEN).json({message: 'You don\'t have right to access this}'});
                } else {
                  User.findOne({
                    where: {
                      id: decoded.id
                    },
                    include: [
                      {model: Role},
                      {model: Team}
                    ]
                  }).then(user => {
                    if (user) {
                      req.user = user;
                      next();
                    } else {
                      res.status(HTTP.SERVER_ERROR).send({message: 'Can not find auth user'});
                    }
                  }).catch(err => {
                    res.status(HTTP.SERVER_ERROR).send({message: 'Error when getting user', error: err});
                  });
                }
              })
              .catch(err => {
                res.status(HTTP.BAD_REQUEST).send({message: err});
              })
          }
        });
      } else {
        res.status(HTTP.UNAUTHORIZED).send({auth: false, message: 'No token provided.'});
      }
    }
  ]

}

module.exports = authorize;
