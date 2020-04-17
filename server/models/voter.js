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
      allowNull: false,
      defaultValue: true
    }
  }, {});
  voter.associate = function(db) {
    voter.belongsTo(db.awardDetail, {foreignKey: 'id_award', constraints: false});
    voter.belongsTo(db.user, {foreignKey: 'id_user', constraints: false});
  };
  return voter;
};
