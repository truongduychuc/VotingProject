const Sequelize = require('sequelize');
const db = require('../database/db');

const Role = Sequelize.define(
    'role', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,

        },
        name: {
            type: Sequelize.STRING
        },
    }
);

Role.associate = (models) => {
    Role.hasMany(models.User, {
        foreignKey: 'position',
    });
}

module.exports = Role;