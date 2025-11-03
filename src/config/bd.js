const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('partydotcom', 'root', 'H@memaranha27', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => console.log('Conectado ao MySQL com Sequelize!')).catch(err => console.error('Erro ao conectar:', err));

module.exports = sequelize;