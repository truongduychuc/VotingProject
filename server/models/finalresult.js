'use strict';
module.exports = (sequelize, DataTypes) => {
  const finalResult = sequelize.define('finalResult', {
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
    id_winner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    percent: DataTypes.FLOAT
  }, {});
  finalResult.associate = function(models) {
    // associations can be defined here
  };
  return finalResult;
};
