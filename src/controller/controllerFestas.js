const festasModel = require('../model/modelFestas');

const festas = async ( req, res ) => {
    try {
        const todasFestas = await festasModel.findAll();
        res.status(200).render('ADM/todasAsFestas', { todasFestas }); //enviar todas as festas a página
    } catch (erro) {
        res.status(500).render('ADM/todasAsFestas', { erro });
    };
};

const criarFesta = async (req, res) => {
    try {
        const data = req.body.data;
        const horario = req.body.horario;
        const tema = req.body.tema;
        const local = req.body.local;
        const idUsuario = req.body.idUsuario;
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
        res.status(201).render('ADM/todasAsFestas')

    } catch (error) {
        console.log("erro")
        res.status(500).render(`usuario/criarFesta`, { error });
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