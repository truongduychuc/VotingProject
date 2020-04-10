'use strict';
module.exports = (sequelize, DataTypes) => {
  const awardDetail = sequelize.define('awardDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type:  DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'awardType',
        key: 'id'
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    description: DataTypes.STRING,
    date_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    prize: DataTypes.STRING,
    logo_url: DataTypes.STRING
  }, {});
  awardDetail.associate = function(db) {
    awardDetail.hasOne(db.finalResult, {foreignKey: 'id_award', as: 'winner', constraints: false});
    awardDetail.hasOne(db.voter, {foreignKey: 'id_award', constraints: false});
    awardDetail.belongsTo(db.awardType, {foreignKey: 'type', constraints: false});
  };
  return awardDetail;
};
