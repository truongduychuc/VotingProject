'use strict';
module.exports = (sequelize, DataTypes) => {
  const AwardType = sequelize.define('awardType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {});
  AwardType.associate = function(models) {
    // associations can be defined here
  };
  return AwardType;
};
