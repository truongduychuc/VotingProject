const teams = {
  NO_TEAM_ID: 1
};
const user = {
  STATUS_ACTIVE: 1,
  // temporarily locked of left
  STATUS_INACTIVE: 0
};
const award = {
  // available for voting
  ACTIVE: 1,
  // temporarily locked
  INACTIVE: 0
};
const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500
};
module.exports = {
  teams,
  user,
  HTTP
};
