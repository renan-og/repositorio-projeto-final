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

const rotasFestas = require('./route/routeFestas');
app.use('/festas', rotasFestas);

//const rotasContratantes = require('.routes/');

const rotaPaginaPrincipal = require('./route/routePrincipal');
app.use('/', rotaPaginaPrincipal)

module.exports = app;
