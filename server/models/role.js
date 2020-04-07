'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_deletable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};
