const express = require('express');
const router = express.Router();

const controllerUsuarios = require('../controller/controllerUsuarios');
const controllerFestas = require('../controller/controllerFestas')

router.post('/cadastroContratante', controllerUsuarios.cadastroContratante);

router.post('/cadastroFuncionario', controllerUsuarios.cadastroFuncionario);

router.post('/login', controllerUsuarios.loginUsuario);

router.get('/novaFestaPagina', (req, res)=>{//renderizar a pagina de criação
    res.render('usuario/criarFesta', { nome : req.session.usuario.nome});
});

router.post('/novaFesta', controllerFestas.criarFesta);

module.exports = router;