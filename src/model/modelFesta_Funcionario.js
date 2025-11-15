const Sequelize = require('sequelize');
const sequelize = require('../config/bd');

const festa_funcionario = sequelize.define('festa_funcionario', {
    idJuncao:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idFesta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'festa',
            key: 'idFesta'
        }
    },
    idFuncionario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'funcionarios',
            key: 'idFuncionario'
        }
    }
}, {
    tableName: 'festa_funcionario',
    timestamps: false
});

module.exports = festa_funcionario;