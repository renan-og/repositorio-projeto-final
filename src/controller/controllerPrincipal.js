const path = require('path');
const mainPage = (req, res)=>{
    res.render("pages/mainPage", {erroSenha: null});
};

const sobre = (req, res)=>{
    res.render('pages/sobre')
}

module.exports = {
    mainPage,
    sobre
}