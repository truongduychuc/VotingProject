const Sequelize = require('sequelize');
const db = {};
const sequelize = new Sequelize('voting_project', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;