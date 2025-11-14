const express = require('express');
const router = express.Router();

const controllerUsuarios = require('../controller/controllerUsuarios');

router.post('/cadastroContratante', controllerUsuarios.cadastroContratante);

router.post('/login', controllerUsuarios.loginUsuario);

router.post('/logout', controllerUsuarios.logoutUsuario)

router.get('/novaFestaPagina', controllerUsuarios.paginaCriarFesta);

router.post('/novaFesta', controllerUsuarios.criarFesta);

router.get('/festasContratadas', controllerUsuarios.festasUsuarioSessao);
router.get('/cadastrar', controllerUsuarios.paginaCadastro);

module.exports = router;