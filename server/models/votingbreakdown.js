'use strict';
module.exports = (sequelize, DataTypes) => {
  const votingBreakdown = sequelize.define('votingBreakdown', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_award: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'awardDetail',
        key: 'id'
      }
    },
    rank: DataTypes.INTEGER,
    id_nominee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    first_votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    second_vote:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    third_votes:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    percent: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    total_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});
  votingBreakdown.associate = function(db) {
    votingBreakdown.belongsTo(db.user, {foreignKey: 'id_nominee', as: 'nominee_name', constraints: false});
    votingBreakdown.belongsTo(db.awardDetail, {as: 'award', foreignKey: 'id_award'});
  };
  return votingBreakdown;
};
