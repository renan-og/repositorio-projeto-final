const express = require('express');
const router = express.Router();

const controllerFestas = require('../controller/controllerFestas');

router.get('/', controllerFestas.festas);

module.exports = router;