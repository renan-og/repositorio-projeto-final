const usuario = require('./modelUsuarios');
const festas = require('./modelFestas')

festas.belongsTo(usuario, { foreignKey: 'idUsuario' });

usuarios.hasMany(festas, { foreignKey: 'idUsuario' });