'use strict';
const {user: userConstants, teams: teamConstants} = require('../helpers/constants');
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.org',
        username: 'admin',
        password: bcrypt.hashSync('password', 10),
        id_team: teamConstants.NO_TEAM_ID, // no team
        id_role: 1, // admin
        first_name: 'Admin',
        last_name: 'Admin',
        english_name: 'Admin',
        ava_url: 'uploads/avatars/defaut_ava.jpg',
        is_active: userConstants.STATUS_ACTIVE,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
