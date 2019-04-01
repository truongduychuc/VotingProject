const Sequelize = require('sequelize');
const db = require('../database/db');

const Nominee = db.sequelize.define(
    'awardNominee', {
        id_award: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_team: {
            type: Sequelize.INTEGER
        },
        id_nominee: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    }
);

module.exports = Nominee;