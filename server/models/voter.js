'use strict';
module.exports = (sequelize, DataTypes) => {
  const voter = sequelize.define('voter', {
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
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    vote_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {});
  voter.associate = function(models) {
    // associations can be defined here
  };
  return voter;
};
