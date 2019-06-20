const Sequelize = require('sequelize');
const db = require('../database/db');

const Team = db.sequelize.define(
    'team', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING
        },
    }, {
        timestamps: false,
    }
);

module.exports = Team;