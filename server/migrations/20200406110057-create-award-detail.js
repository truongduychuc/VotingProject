'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('awardDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'awardTypes',
          key: 'id'
        }
      },
      year: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.STRING
      },
      date_start: {
        allowNull: false,
        type: Sequelize.DATE
      },
      date_end: {
        allowNull: false,
        type: Sequelize.DATE
      },
      prize: {
        type: Sequelize.STRING
      },
      logo_url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('awardDetails');
  }
};
