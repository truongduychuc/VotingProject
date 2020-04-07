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
  team.associate = function(models) {
    // associations can be defined here
  };
  return team;
};
