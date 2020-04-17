const {validationResult} = require('express-validator');
const winston = require('../config/winston');
const logger = require('../helpers/logging')(__filename, winston);

const catchErrorRequest = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation error: ' + JSON.stringify(errors));
  }
  const firstErrorMessage = errorMsgArray => errorMsgArray[0];
  if (!errors.isEmpty()) {
    return firstErrorMessage(errors.formatWith(err => err.msg).array());
  } else {
    return false;
  }
};

const checkArrayNumberHasDuplicate = arr => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (typeof arr[i] !== 'number' && typeof arr[i] !== 'string' && isNaN(arr[i])) {
      throw new TypeError('Invalid array element, they must be number');
    }
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        return true;
      }
    }
  }
  return false;
};

module.exports = {
  catchErrorRequest,
  checkArrayNumberHasDuplicate
};
