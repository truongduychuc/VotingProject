const Role = require('../models/role');

function index(req, res) {
  Role.findAll()
    .then(roles => {
      // if (roles.length === 0) {
      //   res.status(400).send({message: 'There is no role'})
      // } else {
        res.status(200).json(roles);
      // }
    })
    .catch(err => {
      res.status(400).send({message: err});
    })
}

module.exports = {
  index
};
