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
      allowNull: false
    },
    second_vote:  {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    third_votes:  {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    percent: DataTypes.FLOAT,
    total_points: DataTypes.INTEGER
  }, {});
  votingBreakdown.associate = function(db) {
    votingBreakdown.belongsTo(db.user, {foreignKey: 'id_nominee', as: 'nominee_name', constraints: false});
  };
  return votingBreakdown;
};
