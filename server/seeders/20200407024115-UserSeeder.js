'use strict';
const bcrypt = require('bcrypt');
const {teams: teamConstants, user: userConstants} = require('../helpers/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('users', [
     {
       email: 'gray@example.org',
       username: 'gray',
       password: bcrypt.hashSync('password', 10),
       id_team: teamConstants.NO_TEAM_ID, // no team
       id_role: 1, // admin
       first_name: 'Chuc',
       last_name: 'Truong Duy',
       english_name: 'Gray',
       ava_url: 'uploads/avatars/defaut_ava.jpg',
       is_active: userConstants.STATUS_ACTIVE,
       createdAt: Sequelize.fn('NOW'),
       updatedAt: Sequelize.fn('NOW')
     }
   ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
