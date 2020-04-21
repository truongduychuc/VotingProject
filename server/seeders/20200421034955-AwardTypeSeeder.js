'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('awardTypes', [
      {
        name: 'Rookie of The Year',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('awardTypes', null, {});
  }
};
