const usuarios = require('../model/modelUsuarios');
const funcionarios = require('../model/modelFuncionarios');
const admins = require('../model/modelAdmin')
const festa_funcionario = require('../model/modelFesta_Funcionario');
const festasModel = require('../model/modelFestas');
const { where } = require('sequelize');

const loginAdmin = async (req, res) => 
{
    try
    {
        const nome = req.body.usuario;
        const senha = req.body.senha;
        //finOne procura uma linha onde o valor de nome seja igual ao valor da requisição do usuario no login
        const adminExistente = await admins.findOne(
            {
                where: {nome: nome}
            }
        );
        if (!adminExistente)
            {
                res.status(404).render('pages/cadastroPage')//se o usuario ainda não for cadastrado/findOne não encontrar uma linha correspondente, ele é redirecionado para a pagina de cadastro   
            };
        const verificacaoSenha = await bcrypt.compare(senha, adminExistente.senha);
        //caso ja seja cadastrado, ele vai para a verificação da senha
        if(!verificacaoSenha)//se a senha digitada não for igual a senha armazenada no banco de dados
            {
             res.status(401).render('pages/mainPage', {erroSenha: "Senha incorreta"}); //envia o aviso de senha incorreta
             return;  
            }
        //Em caso de login bem sucedido, o usuario é redirecionado diretamente para a página de contrato de festas
        req.session.usuario = 
        {
            idUsuario: adminExistente.idUsuario,
            nome: adminExistente.nome,
            email: adminExistente.email,
            tipo: adminExistente.tipo
        };
        res.status(201).render('pages/contratanteMainPage', { nome: req.session.usuario.nome });
    } catch (error) 
        {
            console.log('Ocorreu um erro inesperado: ' + error)
        }
};

const listarFuncionarios = async (req, res) => {
    try {
        const todosFuncionarios = await funcionarios.findAll();
        res.render('ADM/listarUsuarios', { funcionarios: todosFuncionarios });
    } catch (err) {
        res.status(500).render('ADM/listarUsuarios', { erro: 'Erro ao buscar usuarios' });
    }
};

const cadastroFuncionario = async (req, res) =>
{
    try {
        const nome = req.body.usuario;
        const CPF = req.body.CPF;
        const email = req.body.email;
        const senha = req.body.senha;
        const funcao = req.body.funcao;

        const novoFuncionario = await funcionarios.create({
            nome: nome,
            CPF: CPF,
            email: email,
            senha: senha,
            funcao: funcao
        });
        res.redirect('/');

    } catch(error) {
            console.error(error);
            res.status(500).render('pages/cadastroPage', { error });
        }
};
//funções para editar os funcionarios 
//adicionar funcionario a festa 
const adicionarFuncionarioFesta = async (req, res) =>
{
    try {
        const idFesta = req.body.idFesta;
        const idFuncionario = req.body.idFuncionario;
        const funcionarios = await funcionarios.findAll();
        const novaAtribuicao = await festa_funcionario.create({
            idFesta: idFesta,
            idFuncionario: idFuncionario
        });
        res.status(200).render('ADM/addFuncionarioFesta', { funcionarios ,mensagem: "Funcionario adicionado com sucesso!"})
    } catch(error) {
        console.log
    }
}
const listarContratantes = async (req, res) => {
    try {
        const todosContratantes = await usuarios.findAll();
        const totalFestas = await festas.sum('idUsuario', {
            where:{idUsuario: todosContratantes.idUsuario}
        })
        res.render('ADM/listarUsuarios', { contratantes: todosContratantes, totalFestas });
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
