'use strict';
const bcrypt = require('bcrypt');
const path = require('path');
const {teams: teamConstants, user: userConstants} = require('../helpers/constants');
const fakeNameReader = require('../helpers/fake-name-reader');
module.exports = {
  up: (queryInterface, Sequelize) => {
    const personList = fakeNameReader(path.join(__dirname, '../public/assets/names.txt'));
    const userRecords = personList.map(p => {
      const {firstName, lastName, englishName, username} = p;
      const email = p.username + '@example.org';
      return {
        email,
        username,
        password: bcrypt.hashSync('password', 10),
        id_team: teamConstants.NO_TEAM_ID, // no team,
        id_role: 2,
        first_name: firstName,
        last_name: lastName,
        english_name: englishName,
        ava_url: 'uploads/avatars/defaut_ava.jpg',
        is_active: true,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    });
    return queryInterface.bulkInsert('users', [
      {
        email: 'gray@example.org',
        username: 'gray',
        password: bcrypt.hashSync('password', 10),
        id_team: teamConstants.NO_TEAM_ID, // no team
        id_role: 2, // engineer
        first_name: 'Chuc',
        last_name: 'Truong Duy',
        english_name: 'Gray',
        ava_url: 'uploads/avatars/defaut_ava.jpg',
        is_active: userConstants.STATUS_ACTIVE,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      ...userRecords
    ])
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.bulkDelete('finalResults', null, {transaction: t}),
        queryInterface.bulkDelete('votingbreakdowns', null, {transaction: t}),
        queryInterface.bulkDelete('voters', null, {transaction: t}),
        queryInterface.bulkDelete('nominees', null, {transaction: t}),
        queryInterface.bulkDelete('users', null, {transaction: t})
      ])
    })
  }
};
