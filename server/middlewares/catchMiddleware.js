const {catchErrorRequest} = require('../helpers/validate');
const {HTTP} = require('../helpers/constants');

function catchRequestMiddleware(req, res, next) {
  if (catchErrorRequest(req)) {
    return res.status(HTTP.UNPROCESSABLE_ENTITY).send({message: catchErrorRequest(req)})
  } else {
    next();
  }
}

module.exports = catchRequestMiddleware;
