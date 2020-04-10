'use strict';
module.exports = (sequelize, DataTypes) => {
  const team = sequelize.define('team', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  team.associate = function(db) {
    team.hasMany(db.user, {foreignKey: 'id_team', constraints: false});
  };
  return team;
};
