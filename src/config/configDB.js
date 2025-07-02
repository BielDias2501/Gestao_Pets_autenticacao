const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // ou PostgreSQL se quiser
});

module.exports = sequelize;
