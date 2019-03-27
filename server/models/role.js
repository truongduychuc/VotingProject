const Sequelize = require('sequelize');
const db = require('../database/db');

const Role = db.sequelize.define(
    'roles', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING
        },
    },{
        timestamps: false,
    }
);

// Role.associate = (models) => {
//     Role.hasMany(models.User, {
//         foreignKey: 'position',
//     });
// }

module.exports = Role;