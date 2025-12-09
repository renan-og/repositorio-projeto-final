const usuarios = require('../model/modelUsuarios');
const funcionarios = require('../model/modelFuncionarios');
const festa_funcionario = require('../model/modelFesta_Funcionario');
const festasModel = require('../model/modelFestas');
const bcrypt = require('bcrypt');
const { where, INTEGER } = require('sequelize');
const { Op } = require('sequelize');
const festas = require('../model/modelFestas');

const listarFuncionarios = async (req, res) => {
    try {
        const todosFuncionarios = await funcionarios.findAll();


        res.status(201).render('ADM/listarFuncionarios', { todosFuncionarios: todosFuncionarios });
    } catch (error) {
        res.status(500).render('pages/paginaErro', {error:error});
    }
};

const cadastroFuncionario = async (req, res) =>
{
    try {
        const nome = req.body.nome;
        const cpf = req.body.cpf;
        const email = req.body.email;
        const funcao = req.body.funcao;
        var numero = 0; 
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
        const existente = await funcionarios.findOne({
                    where:{
                        [Op.or]:[
                            {CPF:cpf},
                            {email:email}
                    ]
                }
            });
            if(existente){
            if(existente.CPF == cpf){
                res.status(500).render('ADM/contratarFuncionario', { mensagem: "Funcionarios ja cadastrado"});
                    console.log("CPF ja cadastrado");
                    return;
            }else if(existente.email == email){
                res.satus(500).render('ADM/contratarFuncionario', { mensagem: "Funcionario ja cadastrado"});
            };
        };

        const userName = String(nome+"_"+numero);
        const senha = await bcrypt.hash(String(funcao + "123"), 10);

        const novoFuncionario = await funcionarios.create({
            nome: nome,
            userName: userName,
            CPF: cpf,
            email: email,
            senha: senha,
            funcao: funcao,
            tipo: "Funcionario"
        });
        res.render('pages/mainPageADM', { nome: req.session.usuario.nome });

    } catch(error) {
            console.error(error);
            res.status(500).render('ADM/contratarFuncionario', { error });
        }
};

const paginaContratarFuncionario = (req, res) => {
    res.render('ADM/contratarFuncionario', { mensagem: null});
} 

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

const excluirFuncionario = async (req, res) =>
{
    try
    {
        const todosFuncionarios = await funcionarios.findAll();
        const idsFuncionarios = todosFuncionarios.map(funcionario => funcionario.idFuncionario);//mapeia o array de funcionarios e cria um novo array apenas com os ids
        const juncoes = await festa_funcionario.findAll({where:{idFuncionario:{[Op.in]:idsFuncionarios}}});

        const idsFestas = juncoes.map(festa => festa.idFesta);

        const festasAtribuidas = await festasModel.findAll({where:{idFesta:{[Op.in]:idsFestas}}});

        const idFuncionario = req.body.idFuncionario;
        await funcionarios.destroy({where:{idFuncionario: idFuncionario}});

        res.status(201).render('ADM/listarFuncionarios', { todosFuncionarios, festasAtribuidas: festasAtribuidas });
    } catch(error)
    {
        console.error('Erro ao excluir usuario: '+error);
        res.status(400).render('pages/paginaErro', { error: error });
    }
}

const todasFestas = async (req, res) => {
    try {
        const todasFestas = await festasModel.findAll();

        res.status(200).render('ADM/todasAsFestas', { todasFestas: todasFestas}); //enviar todas as festas a página
    } catch (error) {
        res.status(500).render('pages/paginaErro', { error });
    };
};

const festasContratante = async (req, res) => {
    try {
        
        const reqIdUsuario = parseInt(req.body.idUsuario);
        const festasContratadas = await festasModel.findAll(
            {
                where: { idUsuario: reqIdUsuario }
            }
        );
        console.log("ID USUARIO: " + reqIdUsuario);
        res.status(200).render('ADM/festasContratante', { festasContratadas }); //enviar todas as festas a página
    } catch (error) {
        console.error("ERRO INESPERADO",error);
        res.status(500).render('pages/paginaErro', { error });
    };

};
//função apenas para carregar a pagina de edição
const editarFestasPage = async (req, res) => {

    try {
        const idFesta = parseInt(req.query.idFesta)

        const festa = await festasModel.findByPk(idFesta);//encontra a festa de acordo com a chave primaria

        const qtdConvidados = festa.qtdConvidados
        const horario = festa.horario
        const data = festa.data
        res.render('ADM/editarFestaADM', {//renderiza a view com os dados a seguir
            idFesta: idFesta,
            qtdConvidados,
            horario,
            data
        });
    } catch (error) {
        console.error(error)
        console.log("Deu erro", error)
        res.status(500).render('pages/paginaErro', { error });
    };
};
//função que de fato edita a festa
const atualizarFesta = async (req, res) => {
    try {
        const idFesta = parseInt(req.body.idFesta);
        const qtdConvidados = parseInt(req.body.qtdConvidados)
        const horario = req.body.horario
        const data = req.body.data

        const edicao = await festasModel.update({
            qtdConvidados: qtdConvidados,
            horario: horario,
            data: data
        }, {
            where: {
                idFesta: idFesta//encontra a festa com o mesmo id enviado pela view
            }
        });
        res.status(200).render('ADM/editarFestaADM', { mensagem: "Festa atualizada com sucesso!", idFesta, qtdConvidados, horario, data });
        console.log("Festa atualizada com sucesso!");
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/paginaErro', { error });
    }
};

const excluirFesta = async (req, res) => {
    try {
        const idFesta = parseInt(req.body.idFesta);
        const festaExcluida = await festas.destroy({
            where:
            {
                idFesta: idFesta
            }
        })
        console.log("Festa excluída com sucesso!!");
        const todasFestas = await festasModel.findAll();

        res.status(200).render('ADM/todasAsFestas', { todasFestas: todasFestas}); //

    } catch (error) {
        console.log("pages/paginaErro: " + error)
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
    excluirFuncionario,
    adicionarFuncionarioFesta
};
