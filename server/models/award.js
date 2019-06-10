const Sequelize = require('sequelize');
const db = require('../database/db');

const Award = db.sequelize.define(
    'awardDetail', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.TINYINT
        },
        description: {
            type: Sequelize.STRING
        },
        date_start: {
            type: Sequelize.DATE
        },
        date_end: {
            type: Sequelize.DATE
        },
        prize: {
            type: Sequelize.INTEGER
        },
        item: {
            type: Sequelize.STRING
        },
        logo_url: {
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



module.exports = Award;