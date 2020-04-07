'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('votingBreakdowns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_award: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'awardDetails',
          key: 'id'
        }
      },
      rank: {
        type: Sequelize.INTEGER
      },
      id_nominee: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      first_votes: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      second_vote: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      third_votes: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      percent: {
        type: Sequelize.FLOAT
      },
      total_points: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('votingBreakdowns');
  }
};
