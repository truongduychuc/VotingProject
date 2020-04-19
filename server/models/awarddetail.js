'use strict';
module.exports = (sequelize, DataTypes) => {
  const awardDetail = sequelize.define('awardDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true
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
    prize: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo_url: DataTypes.STRING
  }, {});
  awardDetail.associate = function (db) {
    awardDetail.hasOne(db.finalResult, {foreignKey: 'id_award', as: 'winner', constraints: false});
    // awardDetail.hasOne(db.voter, {foreignKey: 'id_award', constraints: false});
    awardDetail.belongsToMany(db.user, {
      as: {singular: 'voter', plural: 'voters'},
      through: db.voter,
      foreignKey: 'id_award'
    });
    awardDetail.belongsTo(db.awardType, {foreignKey: 'type', constraints: false});
    awardDetail.belongsToMany(db.user, {as: 'nominees', through: db.nominee, foreignKey: 'id_award'});
    awardDetail.hasMany(db.votingBreakdown, {
      as: {singular: 'breakdown', plural: 'breakdowns'},
      foreignKey: 'id_award'
    });
    // awardDetail.hasMany(db.nominee, {foreignKey: 'id_award', constraints: false});
  };
  return awardDetail;
};
