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
  AwardType.associate = function (db) {
    AwardType.hasMany(db.awardDetail, {as: 'awards', foreignKey: 'type', constraints: false});
  };
  return AwardType;
};
