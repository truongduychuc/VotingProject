const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define(
    'users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_role: {
            type: Sequelize.INTEGER
        },
        id_team: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.TINYINT
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        english_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.INTEGER
        },
        other: {
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
        instanceMethods: {
            toJSON: function() {
                const userObj = Object.assign({}, this.dataValues);

                delete userObj.password;

                return userObj
            }
        }
    }
);