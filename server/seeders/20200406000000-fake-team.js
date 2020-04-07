'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('teams', [
      {
        id: 1,
        name: 'No team',
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('teams', null, {});
  }
};
