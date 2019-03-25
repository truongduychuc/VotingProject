const Sequelize = require('sequelize')
const db = require('../database/db')
const crypto = require('crypto')

const User = db.sequelize.define(
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
        vote_ability: {
            type: Sequelize.TINYINT
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
            get() {
                return () => this.getDataValue('password')
            }
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
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
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
        // instanceMethods: {
        //     toJson: function() {
        //         delete this.dataValues.password;
        //         return JSON.stringify(this.dataValues);
        //     }
        // },
        timestamps: false,
    }
);

module.exports = User



// User.prototype.correctPassword = function(candidatePwd) {
//     return User.encryptPassword(candidatePwd, this.salt()) === this.password()
// }
// User.encryptPassword = function(plainText) {
//     return crypto
//         .createHash('RSA-SHA256')
//         .update(plainText)
//         .update(salt)
//         .digest('hex')
// }

// const setSaltAndPassword = user => {
//     if (user.changed('password')) {
//         user.salt = User.generateSalt()
//         user.password = User.encryptPassword(user.password(), user.salt())

//     }
// }

// User.beforeCreate(setSaltAndPassword)
// User.beforeUpdate(setSaltAndPassword)
// User.beforeBulkCreate(users => {
//     users.forEach(setSaltAndPassword)
// })