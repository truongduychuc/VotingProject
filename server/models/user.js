'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
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
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return () => this.getDataValue('password');
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    english_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    achievement: DataTypes.STRING,
    ava_url: DataTypes.STRING
  }, {});
  User.associate = function (db) {
    User.hasOne(db.finalResult, {foreignKey: 'id_winner', as: 'winner_name', constraints: false});
    User.belongsTo(db.team, {foreignKey: 'id_team', constraints: false});
    User.belongsTo(db.role, { foreignKey: 'id_role', constraints: false });
  };
  return User;
};
