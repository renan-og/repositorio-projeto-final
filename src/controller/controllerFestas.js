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
        res.status(201).redirect('/festas/')

    } catch (error) {
        console.error(error)
        res.status(500).render(`usuario/criarFesta`, { error });
    }
}
//apenas para admins do site 
const editarFestasPage = async (req, res) => {

        try {
            const festaId = parseInt(req.query.festaId)

            const festa = await festasModel.findByPk(festaId);

        const qtdConvidados = festa.qtdConvidados 
        const horario = festa.horario
        const data = festa.data
        res.render('ADM/editarFestaADM', {
            festaId, 
            qtdConvidados, 
            horario, 
            data
        });
    } catch (error) { console.error(error)
        console.log("Deu erro", error)
        res.status(500).render('ADM/editarFestaADM', { error });
    };
}
//função que de fato edita a festa
const atualizarFesta = async (req, res) => {
    try {
        const festaId = parseInt(req.body.festaId);
        const qtdConvidados = parseInt(req.body.qtdConvidados) 
        const horario = req.body.horario
        const data = req.body.data

        const edicao = await festasModel.update({
            qtdConvidados: qtdConvidados,
            horario: horario,
            data: data
        }, {
            where: {
                id: festaId
            }
        });
        res.status(200).render('ADM/editarFestaADM', { mensagem: "Festa atualizada com sucesso!", festaId, qtdConvidados, horario, data });
        console.log("Festa atualizada com sucesso!");
    } catch(error){
        console.error(error);
        res.status(500).render('ADM/editarFestaADM', { error });
    }
}

module.exports = {
    festas,
    criarFesta,
    editarFestasPage,
    atualizarFesta
}