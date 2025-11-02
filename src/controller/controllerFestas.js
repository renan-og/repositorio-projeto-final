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

        const novaFesta = await festasModel.create({
            data: data,
            horario: horario,
            contratanteId: contratanteId,
            tema: tema,
            local: local,
            qtdConvidados: qtdConvidados
        });
        res.status(201).redirect('/festas')

    } catch (error) {
        console.error(`Erro ao criar festa: ${error}`)
    }
}

module.exports = {
    festas,
    criarFesta
};