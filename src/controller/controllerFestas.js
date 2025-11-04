const festasModel = require('../model/modelFestas');

const festas = async ( req, res ) => {
    try {
        const todasFestas = await festasModel.findAll();
        res.status(200).render('festas/todasAsFestas', { todasFestas }); //enviar todas as festas a página
    } catch (erro) {
        res.status(500).render('festas/todasAsFestas', { erro });
    };
};

const criarFesta = async (req, res) => {
    try {
        const data = req.body.data;
        const horario = req.body.horario;
        const tema = req.body.tema;
        const local = req.body.local;
        const contratanteId = req.body.contratanteId;
        const qtdConvidados = req.body.qtdConvidados;
        const aniversariante = req.body.aniversariante;

        const novaFesta = await festasModel.create({
            data: data,
            horario: horario,
            contratanteId: contratanteId,
            tema: tema,
            local: local,
            qtdConvidados: qtdConvidados,
            aniversariante: aniversariante
        });
        res.status(201).redirect('/festas')

    } catch (error) {
        res.status(500).render(`view/festas/criarFesta`)
    }
}
//apenas para admins do site 
const editarFestasPage = async (req,res) => {
    try {
        const todasFestas = await festasModel.findAll();
    };
}

module.exports = {
    festas,
    criarFesta
};