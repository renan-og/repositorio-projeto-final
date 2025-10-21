const festas = require('../model/modelFestas');

const festas = async ( req, res ) => {
    try {
        const todasFestas = await festas.findALL();
        res.status(200).render('view/festas/todasAsFestas', { todasFestas }); //enviar todas as festas a página
    } catch (erro) {
        res.status(500).render('view/festas/todasAsFestas', { erro });
    };
};