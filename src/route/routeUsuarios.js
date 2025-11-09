const express = require('express');
const router = express.Router();

const controllerUsuarios = require('../controller/controllerUsuarios');

router.get('/funcionarios', controllerUsuarios.listarFuncionarios);

module.exports = router;