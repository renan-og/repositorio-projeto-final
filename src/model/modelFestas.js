const Sequelize = require('sequelize');
const dB = require('../config/bd');

const festas = dB.define('Festa', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    data:{
        type: Sequelize.DATE,
        allowNull: false
    },
    horario:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tema:{
        type: Sequelize.STRING,
        allowNull: false
    },
    contratanteId:{
        type: Sequelize.INTEGER,

    }
});

module.exports = festas