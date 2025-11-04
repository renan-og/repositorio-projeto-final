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
        const contratanteId = req.body.idUsuario;
        const qtdConvidados = req.body.qtdConvidados;
        const aniversariante = req.body.aniversariante;

        const novaFesta = await festasModel.create({
            data: data,
            horario: horario,
            idUsuario: idUsuario,
            tema: tema,
            local: local,
            qtdConvidados: qtdConvidados,
            aniversariante: aniversariante
        });
        console.log("funcionou")
        res.status(201).redirect('/festas/')

    } catch (error) {
        console.log("erro")
        res.status(500).render(`festas/criarFesta`, { error });
    }
}
//apenas para admins do site 
const editarFestasPage = async (req,res) => {
    try {
        const todasFestas = await festasModel.findAll();
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    festas,
    criarFesta
};