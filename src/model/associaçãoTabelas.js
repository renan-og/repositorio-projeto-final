const usuario = require('./modelUsuarios');
const festas = require('./modelFestas');
const funcionarios = require('./modelFuncionarios')
const festa_funcionario = require('./modelFesta_Funcionario')

festas.belongsTo(usuario, { foreignKey: 'idUsuario' });

usuario.hasMany(festas, { foreignKey: 'idUsuario' });

festas.belongsToMany(funcionarios, { 
    through: festa_funcionario, 
    foreignKey: 'idFesta',
    otherKey: 'idFuncionario'
});

funcionarios.belongsToMany(festa, { 
    through: festa_funcionario,
    foreignKey: 'idFuncionario',
    otherKey: 'idFesta'
});