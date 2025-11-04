const Sequelize = require('sequelize');
const dB = require('../config/bd');
const usuario = require('./modelUsuarios');

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
    idUsuario:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    local: {
        type: Sequelize.STRING,
        allowNull: false
    },
    qtdConvidados: {
        type:Sequelize.INTEGER,
        allowNull: false
    },
    aniversariante:{
        type: Sequelize.STRING,
        allowNull: false
    },
});
festas.belongsTo(usuario, { foreignKey: 'idUsuario' });

module.exports = festas