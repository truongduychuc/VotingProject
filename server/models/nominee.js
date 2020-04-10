'use strict';

module.exports = (sequelize, DataTypes) => {
  const nominee = sequelize.define('nominee', {
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
    id_team: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'team',
        key: 'id'
      }
    },
    id_nominee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {});
  nominee.associate = function(db) {
    nominee.belongsTo(db.user, {foreignKey: 'id_nominee', as: 'nominee_name_1'});
    nominee.belongsTo(db.user, {foreignKey: 'id_nominee', as: 'nominee_name', constraints: false})
  };
  return nominee;
};
