const express = require('express');
const router = express.Router();

const controllerFestas = require('../controller/controllerFestas');

router.get('/', controllerFestas.festas);
router.get('/novaFestaPagina', (req, res)=>{
    res.render('festas/criarFesta');
});
router.post('/novaFesta', controllerFestas.criarFesta);

module.exports = router;