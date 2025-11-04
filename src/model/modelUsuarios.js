const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const usuarios = sequelize.define('usuarios', {//criação do modedlo da tabela de usuarios 
    idUsuario: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CPF: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {//se é funcionário, adm ou contratante 
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});


module.exports = usuarios;