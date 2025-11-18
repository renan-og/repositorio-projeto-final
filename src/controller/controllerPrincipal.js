const path = require('path');
const mainPage = (req, res)=>{
    res.render("pages/mainPage", {erroSenha: null});
};
const verificarAutenticacao = (req, res)=>{
    if (req.body.usuario.funcao === 'admin' && req.body.usuario.senha === 'admin123') 
    {

    }
};

module.exports = {
    mainPage,
    verificarAutenticacao
}