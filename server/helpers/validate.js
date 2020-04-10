const {validationResult} = require('express-validator');

const catchErrorRequest = req => {
  const errors = validationResult(req).formatWith(err => err.msg);
  const firstErrorMessage = errorMsgArray => errorMsgArray[0];
  if (!errors.isEmpty()) {
    return firstErrorMessage(errors.array());
  } else {
    return false;
  }
};

const checkArrayNumberHasDuplicate = arr => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (typeof arr[i] !== 'number' || typeof arr[i] !== 'string' || isNaN(arr[i])) {
      throw new TypeError('Invalid array element, they must be number');
    }
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        console.log(i, j);
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
