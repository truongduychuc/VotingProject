const User = require('../models/user');
const Nominee = require('../models/nominee');

function listUserForNominating(req, res) {
  User.findAll({
    where: {
      is_active: 1,
      id_role: {
        [Op.gt]: [1]
      }
    },

    attributes: ['id', 'english_name', 'id_team']
  })
    .then(data => {
      if (data.length === 0) {
        res.status(200).send({message: 'There is no nominee'});
      } else {
        res.status(200).send({data: data});
      }
    })
    .catch(err => {
      res.status(400).send({message: 'Error when get list', err});
    })
}

function listNomineesForVoting(req, res) {
  Nominee.findAll({
    where: {
      id_award: req.body.id_award
    },
    attributes: ['id_nominee'],
    include: {
      model: User,
      // Change name when get name for nominee
      as: 'nominee_name_1',
      attributes: ['first_name', 'last_name', 'english_name', 'id_team', 'ava_url']
    }
  })
    .then(data => {
      if (data.length === 0) {
        res.status(200).send({message: 'There is no nominee for this award'});
      } else {
        res.status(200).send({data: data});
      }
    })
    .catch(err => {
      res.status(400).send({message: 'Error when get list', err});
    })
}


module.exports = {
  listUserForNominating,
  listNomineesForVoting
};
