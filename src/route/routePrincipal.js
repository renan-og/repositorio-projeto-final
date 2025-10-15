const express = require('express');
const router = express.Router();

const controllerPrincipal = require("../controller/controllerPrincipal");

router.get('/', controllerPrincipal.mainPage);

module.exports = router;
