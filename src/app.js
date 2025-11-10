const session = require('express-session');
const express = require('express');
const app = express();

const methodOverride = require('method-override');
app.use(methodOverride("_method"));

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configurando o uso de sessões
app.use(session(
    {
        secret: 'chave-ultra-secreta-da-sessao',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            maxAge: 60000 
        } //duração da sessão 1 minuto
    }
    )
)

const rotasFestas = require('./route/routeFestas');
app.use('/festas', rotasFestas);

const rotasUsuarios = require('./route/routeUsuarios');
app.use('/usuarios', rotasUsuarios)

const rotaPaginaPrincipal = require('./route/routePrincipal');
app.use('/', rotaPaginaPrincipal)

module.exports = app;
