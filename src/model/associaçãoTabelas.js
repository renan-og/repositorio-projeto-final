const usuario = require('./modelUsuarios');
const festas = require('./modelFestas')

festas.belongsTo(usuario, { foreignKey: 'idUsuario' });

usuario.hasMany(festas, { foreignKey: 'idUsuario' });