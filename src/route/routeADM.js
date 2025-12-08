const express = require('express');
const router = express.Router();

const controllerADM = require('../controller/controllerADM');

router.get('/getFuncionarios', controllerADM.listarFuncionarios);//listar funcionarios
router.get('/getContratantes', controllerADM.listarContratantes);//listar usuarios 
router.get('/setFuncionarioPagina', controllerADM.paginaContratarFuncionario);//pagina de contrato
router.post('/setFuncionario', controllerADM.cadastroFuncionario);//contratar funcionario
router.get('/setFuncionarioFestaPagina', controllerADM.adicionarFuncionarioFestaPagina)//atribuir um funcionario a uma festa
router.post('/setFuncionarioFesta', controllerADM.adicionarFuncionarioFesta)//atribuir um funcionario a uma festa
router.get('/getFestas', controllerADM.todasFestas);//ver todas as festas
router.post('/getFestasContratante', controllerADM.festasContratante);//ver festas de um contratante
router.post('/excluirFuncionario', controllerADM.excluirFuncionario);//excluir um usuario
router.post('/excluirFesta', controllerADM.excluirFesta);//excluir uma festa
router.get('/paginaEditarFesta', controllerADM.editarFestasPage);//pagina de edição de festa
router.post('atualizarFesta', controllerADM.atualizarFesta);//editar uma festa

module.exports = router