const express = require('express');
const router = express.Router();

const controllerFestas = require('../controller/controllerFestas');

router.get('/', controllerFestas.festas);
router.get('/festasContratadas', controllerFestas.festasUsuarioSessao)//mostrar as festas do usuario logado
router.get('/novaFestaPagina', (req, res)=>{//renderizar a pagina de criação
    res.render('usuario/criarFesta', { nome : req.session.usuario.nome});
});
router.post('/novaFesta', controllerFestas.criarFesta);
router.get('/editarFestaPage', controllerFestas.editarFestasPage);
router.patch('/atualizarFesta', controllerFestas.atualizarFesta);
/*router.get('/editarFestaADMPage', (req, res)=>{//renderizar a pagina de edição
    res.render('festas/editarFestaADM');
});*/
module.exports = router;