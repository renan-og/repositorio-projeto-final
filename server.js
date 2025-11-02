const app = require('./src/app');
const PORT = 3000;

const sequelize = require('./src/config/bd');

sequelize.sync().then(() => {
    app.listen(PORT, ()=>{
        console.log(`servidor rodando na porta ${PORT}`);
});
}).catch(error => {
    console.error(`Erro ao sincronizar tabelas: ${error}`);//sequelize.sync para criar as tabelas no BD caso não existam
})
