const Sequelize = require('sequelize');
const db = require('../database/db');

const Voter = db.sequelize.define(
    'voter', {
        id_award: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        id_user: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        vote_ability: {
            type: Sequelize.TINYINT,
        },
        vote_status: {
            type: Sequelize.TINYINT
        },
        updated_at: {
            type: Sequelize.DATE
        }
    }, {
        timestamps: false
    }
)

module.exports = Voter;