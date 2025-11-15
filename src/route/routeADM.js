const express = require('express');
const router = express.Router();

const controllerADM = require('../controller/controllerADM');

router.get('/getFuncionarios', controllerADM.listarFuncionarios);
router.get('/getContratantes', controllerADM.listarContratantes);
router.post('/setFuncionario', controllerADM.cadastroFuncionario);
router.post('/setFuncionarioFesta', controllerADM.adicionarFuncionarioFesta)
router.get('/getFestas', controllerADM.todasFestas);
router.get('/getFestasContratante', controllerADM.festasContratante);
router.post('/excluirUsuario', controllerADM.excluirUsuario);
router.post('/excluirFesta', controllerADM.excluirFesta);
router.get('/paginaEditarFesta', controllerADM.editarFestasPage);
router.post('atualizarFesta', controllerADM.atualizarFesta);

module.exports = router