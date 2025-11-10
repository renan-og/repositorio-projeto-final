const path = require('path');
const mainPage = (req, res)=>{
    res.render("pages/mainPage");
};
const login = (req, res)=>{
    
}

module.exports = {
    mainPage,
    login
}