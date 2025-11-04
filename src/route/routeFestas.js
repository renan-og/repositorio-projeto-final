const express = require('express');
const router = express.Router();

const controllerFestas = require('../controller/controllerFestas');

router.get('/', controllerFestas.festas);
router.get('/novaFestaPagina', (req, res)=>{//renderizar a pagina de criação
    res.render('festas/criarFesta');
});
router.post('/novaFesta', controllerFestas.criarFesta);

/*router.get('/editarFestaADMPage', (req, res)=>{//renderizar a pagina de edição
    res.render('festas/editarFestaADM');
});*/

router.patch('/editarFestaADM', controllerFestas.editarFestasPage);
module.exports = router;