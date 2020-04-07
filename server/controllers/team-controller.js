const {team: Team}= require('../models');

function index(req, res) {
  Team.findAll()
    .then(teams => {
      // if (teams.length === 0) {
      //   res.status(400).send({message: 'There is no team'})
      // } else {
        res.status(200).json(teams);
      // }
    })
    .catch(err => {
      res.status(400).send({message: err});
    })
}

module.exports = {
  index
};
