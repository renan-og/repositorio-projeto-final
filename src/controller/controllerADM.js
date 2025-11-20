const usuarios = require('../model/modelUsuarios');
const funcionarios = require('../model/modelFuncionarios');
const festa_funcionario = require('../model/modelFesta_Funcionario');
const festasModel = require('../model/modelFestas');
const bcrypt = require('bcrypt');
const { where, INTEGER } = require('sequelize');

const listarFuncionarios = async (req, res) => {
    try {
        const todosFuncionarios = await funcionarios.findAll();

        res.status(201).render('ADM/listarFuncionarios', { todosFuncionarios });
    } catch (err) {
        res.status(500).render('ADM/listarFuncionarios');
    }
};

const cadastroFuncionario = async (req, res) =>
{
    try {
        const nome = req.body.nome;
        const CPF = req.body.CPF;
        const email = req.body.email;
        const funcao = req.body.funcao;
        var numeroFuncao = 0; 
        switch(funcao)
        {
            case "Chefe de cozinha":
                numero = 0;
            case "Ajudante de Cozinha":
                numero = 1;
            case "Garçom":
                numero = 2;
            case "Barman/Barwoman":
                numero = 3;
            case "Recepcionista":
                numero = 4;
            case "Segurança":
                numero = 5;
            case "Monitor":
                numero = 6;
            case "Recrador":
                numero = 7;
            case "Gerente de Eventos":
                numero = 8;
            case "Cerimonialista":
                numero = 9;
            case "Equipe de Limpeza":
                numero = 10;
        };
        const userName = String(nome+"_"+numeroFuncao);
        const senha = await bcrypt.hash(String(funcao + "123"), 10);

        const novoFuncionario = await funcionarios.create({
            nome: nome,
            userName: userName,
            CPF: CPF,
            email: email,
            senha: senha,
            funcao: funcao
        });
        res.render('pages/mainPageADM', { nome: req.session.usuario.nome });

    } catch(error) {
            console.error(error);
            res.status(500).render('ADM/contratarFuncionario', { error });
        }
};

const paginaContratarFuncionario = (req, res) => {
    res.render('ADM/contratarFuncionario');
}
//funções para editar os funcionarios 
//adicionar funcionario a festa 

const adicionarFuncionarioFestaPagina = async (req, res) => 
{
    try 
    {   
        const todasAsFestas = await festasModel.findAll();
        const todosFuncionarios = await funcionarios.findAll();
        res.render('ADM/addFuncionarioFesta', { todosFuncionarios, todasAsFestas });
    } catch (error) {
        console.error(error);
        res.status(500).render('ADM/addFuncionarioFesta', { error });
    }  
};

const adicionarFuncionarioFesta = async (req, res) =>
{
    try {
        const todosFuncionarios = await funcionarios.findAll();
        const todasAsFestas = await festasModel.findAll();
        const idFesta = parseInt(req.body.idFesta);
        const idFuncionario = parseInt(req.body.idFuncionario);
        const novaAtribuicao = await festa_funcionario.create({
            idFesta: idFesta,
            idFuncionario: idFuncionario
        });
        res.status(200).render('ADM/addFuncionarioFesta', { todosFuncionarios , todasAsFestas})
    } catch(error) {
        console.log("erro: "+ error);
        res.render('pages/mainPageADM', { nome: req.session.usuario.nome })
    }
}
const listarContratantes = async (req, res) => {
    try {
        const todosContratantes = await usuarios.findAll();

        res.status(201).render('ADM/listarUsuarios', { todosContratantes });
    } catch (err) {
        res.status(500).render('ADM/listarUsuarios', { erro: 'Erro ao buscar usuarios' });
    }
};

const excluirUsuario = async (req, res) =>
{
    try
    {
        const usuarioId = req.body.usuarioId;
    } catch(error)
    {
        console.error('Erro ao excluir usuario: '+error);
    }
}

const todasFestas = async (req, res) => {
    try {
        const todasFestas = await festasModel.findAll();
        res.status(200).render('ADM/todasAsFestas', { todasFestas }); //enviar todas as festas a página
    } catch (erro) {
        res.status(500).render('ADM/todasAsFestas', { erro });
    };
};

const festasContratante = async (req, res) => {
    try {
        const idUsuario = parseInt(req.body.idUsuario);
        const festasContratadas = await festasModel.findAll(
            {
                where: { idUsuario: idUsuario }
            }
        );
        res.status(200).render('ADM/festasContratadasADM', { festasContratadas }); //enviar todas as festas a página
    } catch (error) {
        console.error(error);
        res.status(500).render('ADM/festasContratadasADM', { error });
    }

}
//função apenas para carregar a pagina de edição
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
    } catch (error) {
        console.error(error)
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
    } catch (error) {
        console.error(error);
        res.status(500).render('ADM/editarFestaADM', { error });
    }
}

const excluirFesta = async (req, res) => {
    try {
        const idFesta = parseInt(req.body.idFesta);
        const festaExcluida = await festas.destroy({
            where:
            {
                id: idFesta
            }
        })
        console.log("Festa excluída com sucesso!!")
    } catch (error) {
        console.log("Erro ao excluir festa: " + error)
    }
};

module.exports =
{
    adicionarFuncionarioFestaPagina,
    paginaContratarFuncionario,
    listarFuncionarios,
    listarContratantes,
    cadastroFuncionario,
    todasFestas,
    editarFestasPage,
    atualizarFesta,
    excluirFesta,
    festasContratante,
    excluirUsuario,
    adicionarFuncionarioFesta
};
