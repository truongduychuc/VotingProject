const Sequelize = require('sequelize');
const db = require('../database/db');

const Winner = db.sequelize.define(
    'finalResult', {
        id_award: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_winner: {
            type: Sequelize.INTEGER
        },
        percent: {
            type: Sequelize.FLOAT
        }
    }, {
        timestamps: false
    }
);

module.exports = Winner;