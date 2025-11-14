const { DataTypes } = require  ('sequelize');
const sequelize = require('../config/bd');

const funcionarios = sequelize.define('funcionarios', 
    {
        idFuncionario: {
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
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: DataTypes.STRING
        },
        funcao: {
            type: DataTypes.STRING,
            allowNull: false    
        }
    }, {
        tableName: 'funcionarios',
        timestamps: false
    }
);

module.exports = funcionarios;