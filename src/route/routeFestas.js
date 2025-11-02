const express = require('express');
const router = express.Router();

const controllerFestas = require('../controller/controllerFestas');

router.get('/todasAsFestas', controllerFestas.festas);

module.exports = router;