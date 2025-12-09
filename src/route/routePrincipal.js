const express = require('express');
const router = express.Router();

const controllerPrincipal = require("../controller/controllerPrincipal");

router.get('/', controllerPrincipal.mainPage);
router.get('/sobre', controllerPrincipal.sobre);

//router.get('/login', controllerPrincipal.loginPage)

module.exports = router;
