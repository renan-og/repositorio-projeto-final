const { DataTypes } = require('sequelize');
const sequelize = rquire('../config/db');

const funcionarios = sequelize.define('funcionarios', {
    id: {
        type: DataTypes.STRING,
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
    }
}, {
    tableName: 'funcionarios',
    timestamps: false
});

module.exports = funcionarios;