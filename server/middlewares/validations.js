const {user:  User} = require('../models');
const {body} = require('express-validator');

const fieldExist = (key, value) => new Promise((resolve, reject) => {
  User.findOne({
    where: {
      [key]: value
    }
  }).then(user => {
    if (user) {
      const transformedKey = key.includes('_') ? key.replace('_', ' ') : key;
      reject(`The ${transformedKey} has been used`);
    } else {
      resolve(true);
    }
  }).catch(err => {
    reject(err);
  })
});

const emailExist = email => fieldExist('email', email);
const usernameExist = username => fieldExist('username', username);
const englishNameExist = englishName => fieldExist('english_name', englishName);

const registerRequest = [
  body('id_role').exists().toInt().isNumeric(),
  body('id_team').exists().toInt().isNumeric(),
  body('username').exists().isString().isLength({
    min: 6,
    max: 50
  }).bail().custom(usernameExist),
  body('first_name').exists().isString().isLength({
    max: 50
  }),
  body('english_name').exists().isString().isLength({
    max: 50
  }).bail().custom(englishNameExist),
  body('email').exists().normalizeEmail().isEmail().bail().custom(emailExist)
];
module.exports = {
  registerRequest
};
