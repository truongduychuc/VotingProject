const Sequelize = require('sequelize');
const db = require('../database/db');

const Award_type = db.sequelize.define(
    'awardType', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    }, {
        timestamps: false,
    }
);

module.exports = Award_type;