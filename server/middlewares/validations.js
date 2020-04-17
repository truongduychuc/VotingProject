const {user: User, awardDetail: Award, awardType: AwardType, role: Role} = require('../models');
const {body} = require('express-validator');
const {checkArrayNumberHasDuplicate} = require('../helpers/validate');
const {asyncForEach} = require('../utils');
const winston = require('../config/winston');
const logger = require('../helpers/logging')(__filename, winston);
const Op = require('sequelize').Op;


const midnightDate = () => {
  const today = new Date();
  console.log(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
};

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

const noDuplicatedNomineeSelected = value => !checkArrayNumberHasDuplicate(value);
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
// check if role in id_voter_role array
const checkRolesExists = async value => {
  await asyncForEach(value, async(rID) => {
    const role = await Role.findOne({
      where: {
        id: rID
      }
    });
    if (!role) {
      throw 'Role does not exist'
    }
  });
  return true;
};
const checkNomineesExist = async value => {
  try {
    await asyncForEach(value, async (nominee) => {
      const user = await User.findOne({
        where: {
          id: nominee,
          is_active: true
        },
        include: [
          {
            model: Role,
            // b.c we used condition here then it only returns the matching relations
            // there's no need to required
            // required: true,
            where: {
              id: {
                [Op.ne]: 1 // admin
              }
            }
          }
        ]
      });
      if (!user) {
        throw 'Nominee does not exist';
      }
    });
    return true;
  } catch (e) {
    throw e;
  }
};

const createAwardRequest = [
  body('type')
    .if(body('type').exists({checkNull: true, checkFalsy: true}))
    .toInt()
    .isInt().withMessage('Type must be integer')
    .bail()
    .custom(checkAwardTypeExist),
  body('year')
    .exists({checkFalsy: true}).withMessage('Please select a year for holding award')
    .toInt().withMessage('Year must be integer')
    .bail()
    .custom(yearLessThanOneOrCurrent).withMessage('Year must be the last year or current year')
    .bail()
    .if(body('type').exists())
    .custom(sameAwardTypeExistInSameYear),
  body('description')
    .if(body('description').notEmpty())
    .isString()
    .trim()
    .isLength({max: 255}).withMessage('Description can only be long as 255 characters as maximum'),
  body('date_start')
    .exists({checkFalsy: true}).withMessage('Please choose start date for the award.')
    .bail()
    .isAfter().withMessage('Start day must greater than today'),
  body('date_end')
    .exists({checkFalsy: true}).withMessage('Please choose end date for the award')
    .bail()
    .toDate()
    .isAfter()
    .bail()
    .custom(dayEndAfterDayStart)
    .withMessage('End date must be after start day'),
  // prize contains only numeric
  body('prize')
    .exists({checkFalsy: true}).withMessage('Please give prize')
    .matches(/^\d+$/).withMessage('Prize can only contain numeric characters'),
  body('item')
    .if(body('item').notEmpty())
    .isString(),
  body('id_nominee')
    .exists({
      checkFalsy: true,
      checkNull: true
    }).withMessage('Please include nominee list')
    .isArray({min: 1}).withMessage('Nominees should be an array')
    .bail()
    .custom(noDuplicatedNomineeSelected).withMessage('There are the same nominees selected, each one can only be chosen once')
    .bail().custom(checkNomineesExist),
  body('name')
    .customSanitizer((value, {req}) => req.body.type !== '' && req.body.type != null ? null : value)
    .if(body('type').isEmpty())
    .notEmpty().withMessage('Award type name is required when creating new award type')
    .bail()
    .custom(checkAwardNameExists),
  body('id_role_voter')
    .exists().withMessage('Voter roles are required')
    .isArray({
      min: 1
    }).withMessage('Please identity whose role able to vote')
    .bail()
    .custom(checkRolesExists)
];

module.exports = {
  registerRequest,
  createAwardRequest
};
