const Sequelize = require('sequelize');
const sequelize = require('../config/bd');


const festas = sequelize.define('festa', {
    idFesta:{
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
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'idUsuario'
        }
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
    }
});


module.exports = festas