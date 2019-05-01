const Sequelize = require('sequelize');
const db = require('../database/db');

const Breakdown = db.sequelize.define(
    'votingBreakdowns', {
        id_award: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        rank: {
            type: Sequelize.INTEGER
        },
        id_nominee: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        first_votes: {
            type: Sequelize.INTEGER
        },
        second_votes: {
            type: Sequelize.INTEGER
        },
        third_votes: {
            type: Sequelize.INTEGER
        },
        percent: {
            type: Sequelize.FLOAT
        },
        total_points: {
            type: Sequelize.INTEGER
        },
        updated_at: {
            type: Sequelize.DATE
        }
    }, {
        timestamps: false
    }
);

module.exports = Breakdown;