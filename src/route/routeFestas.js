const express = require('express');
const router = express.Router();

const controllerFestas = require('../controller/controllerFestas');

router.get('/', controllerFestas.festas);
router.get('/novaFestaPagina', (req, res)=>{//renderizar a pagina de criação
    res.render('usuario/criarFesta');
});
router.post('/novaFesta', controllerFestas.criarFesta);
router.get('/editarFestaPage', (req, res) => {
    res.render('ADM/editarFesta')
})

/*router.get('/editarFestaADMPage', (req, res)=>{//renderizar a pagina de edição
    res.render('festas/editarFestaADM');
});*/
module.exports = router;