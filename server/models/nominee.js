const Sequelize = require('sequelize');
const db = require('../database/db');

const Nominee = db.sequelize.define(
    'nominee', {
        id_award: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        id_team: {
            type: Sequelize.INTEGER,

        },
        id_nominee: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        updated_at: {
            type: Sequelize.DATE
        }
    }, {
        timestamps: false
    }
);

module.exports = Nominee;