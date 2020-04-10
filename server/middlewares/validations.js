const {user: User, award: Award, awardType: AwardType} = require('../models');
const {body} = require('express-validator');
const {checkArrayNumberHasDuplicate} = require('../helpers/validate');

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
  body('id_role').exists({checkFalsy: true}).toInt().isNumeric(),
  body('id_team').exists({checkFalsy: true}).toInt().isNumeric(),
  body('username').notEmpty().isLength({
    min: 6,
    max: 50
  }).bail()
    .custom(usernameExist),
  body('first_name')
    .notEmpty()
    .isLength({max: 50}),
  body('english_name')
    .notEmpty()
    .isLength({max: 50})
    .bail()
    .custom(englishNameExist),
  body('email')
    .notEmpty()
    .normalizeEmail()
    .isEmail()
    .bail()
    .custom(emailExist)
];

// prevent initiating a same type of award happening or held in the same year
const sameAwardTypeExistInSameYear = (value, {req}) => new Promise((resolve, reject) => {
  Award.findOne({
    where: {
      year: value,
      type: req.body.type
    }
  }).then(award => {
    if (award) {
      reject('The same award already exists in this year!');
    } else {
      resolve();
    }
  }).catch(error => {
    reject(error);
  })
});

const dayEndAfterDayStart = (value, {req}) => {
  return (new Date(value)).getTime() > (new Date(req.body.date_start)).getTime();
};

// only allow year to be less than current year 1 or be current year
const yearLessThanOneOrCurrent = value => {
  return value >= (new Date()).getFullYear() - 1 && value <= (new Date()).getFullYear();
};

const noDuplicatedNomineeSelected = value => checkArrayNumberHasDuplicate(value);
const checkAwardTypeExist = value => new Promise((resolve, reject) => {
  AwardType.findOne({
    where: {
      id: value
    }
  }).then(type => {
    if (!type) {
      reject('Award type does not exist');
    } else {
      resolve()
    }
  }).catch(err => {
    reject(err);
  })
});

const checkAwardNameExists = value => new Promise((resolve, reject) => {
  AwardType.findOne({
    where: {
      name: value
    }
  }).then(awardType => {
    if (awardType) {
      reject('Award type name already exists');
    } else {
      resolve();
    }
  }).catch(err => {
    reject(err);
  })
});

const createAwardRequest = [
  body('type')
    .toInt()
    .isInt()
    .bail()
    .custom(checkAwardTypeExist),
  body('year')
    .exists({checkFalsy: true}).withMessage('Please select a year for holding award')
    .toInt()
    .bail()
    .custom(yearLessThanOneOrCurrent).withMessage('Year must be the last year or current year')
    .bail()
    .if(body('type').exists())
    .custom(sameAwardTypeExistInSameYear),
  body('description')
    .isString()
    .trim()
    .isLength({max: 255}).withMessage('Description can only be long as 255 characters as maximum'),
  body('date_start')
    .exists({checkFalsy: true}).withMessage('Please choose start date for the award.')
    .bail()
    .isBefore().withMessage('Start day must greater than today'),
  body('date_end')
    .exists({checkFalsy: true}).withMessage('Please choose end date for the award')
    .isBefore()
    .bail()
    .custom(dayEndAfterDayStart)
    .withMessage('End date must be after start day'),
  // prize contains only numeric
  body('prize')
    .exists({checkFalsy: true}).withMessage('Please give prize')
    .matches(/^\d+$/).withMessage('Prize can only contain numeric characters'),
  body('item').trim(),
  body('id_nominee')
    .exists().withMessage('Please include nominee list')
    .isArray({min: 1}).withMessage('Nominees should be an array')
    .bail()
    .custom(noDuplicatedNomineeSelected).withMessage('There are the same nominees selected, each one can only be chosen once'),
  body('name')
    .customSanitizer((value, {req}) => req.body.type !== '' && req.body.type != null ? null : value)
    .if(body('type').isEmpty())
    .notEmpty().withMessage('Award type name is required when creating new award type')
    .bail()
    .custom(checkAwardNameExists)
];

module.exports = {
  registerRequest,
  createAwardRequest
};
