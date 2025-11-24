const usuarios = require('../model/modelUsuarios');
const festasModel = require('../model/modelFestas');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');

const cadastroContratante = async (req, res) =>
{
    try {
        const nome = req.body.nome;
        const userName = req.body.userName
        const CPF = req.body.CPF;
        const email = req.body.email;
        const senha = req.body.senha;

        const senhaHash = await bcrypt.hash(senha, 10);//codificação da senha no cadastro

        const novoContratante = await usuarios.create({
            nome: nome,
            userName: userName,
            CPF: CPF,
            email: email,
            senha: senhaHash,
        });
        req.session.usuario = 
        {
            idUsuario: novoContratante.idUsuario,
            nome: novoContratante.nome,
            email: novoContratante.email,
        };
        res.status(201).render('pages/contratanteMainPage', { nome: req.session.usuario.nome });
    } catch(error) {
            console.error(error);
            res.status(500).render('pages/cadastroPage', { error });
        }
};
//validação do login
const loginUsuario = async (req, res) => 
{
    try
    {
        const nome = req.body.usuario;
        const senha = req.body.senha;
        //finOne procura uma linha onde o valor de nome seja igual ao valor da requisição do usuario no login
        if(nome == 'admin' && senha == 'admin123'){
            req.session.usuario = 
            {
                userName: 'admin098',
                nome: 'Administrador',
                email: 'admin@partydotcom.com',
            };
            return res.status(201).render('pages/mainPageADM', { nome: req.session.usuario.nome })
        }
        const usuarioExistente = await usuarios.findOne({
            where:{
                nome: nome
            }
        });
        if (!usuarioExistente)
            {
                console.log('usuario n cadastrado')
                res.status(404).render('pages/cadastroPage')//se o usuario ainda não for cadastrado/findOne não encontrar uma linha correspondente, ele é redirecionado para a pagina de cadastro   
            };
        const verificacaoSenha = await bcrypt.compare(senha, usuarioExistente.senha);
        //caso ja seja cadastrado, ele vai para a verificação da senha
        if(!verificacaoSenha)//se a senha digitada não for igual a senha armazenada no banco de dados
            {
             res.status(401).render('pages/mainPage', {erroSenha: "Senha incorreta"}); //envia o aviso de senha incorreta
             return;  
            }
        //Em caso de login bem sucedido, o usuario é redirecionado diretamente para a página de contrato de festas
        //contratante
        req.session.usuario = 
        {
            idUsuario: usuarioExistente.idUsuario,
            nome: usuarioExistente.nome,
            email: usuarioExistente.email,
        };
        res.status(201).render('pages/contratanteMainPage', { nome: req.session.usuario.nome });
    

    } catch (error) 
        {
            console.log('Ocorreu um erro inesperado: ' + error)
        }
};
//realizar logaut
const logoutUsuario = (req, res) =>
{
    req.session.destroy((error) =>
    {
        if(error)
        {
            console.log('erro ao realizar logout: '+error)
        }else
        {
            res.clearCookie('sessaoUsuario');
            res.redirect('/');
        }
    })   
};
//funções dos contratantes
const festasUsuarioSessao = async ( req, res ) => {//para que o usuario logado possa ver suas festas contratadas
    try {
        const festasContratadas = await festasModel.findAll(
            {
                where: {idUsuario: req.session.usuario.idUsuario}
            }
        );
        res.status(200).render('usuario/festasContratadas', { festasContratadas, nome: req.session.usuario.nome }); //enviar todas as festas a página
    } catch (erro) {
        res.status(500).render('usuario/festasContratadas', { erro, festasContratadas: [] });
    };
};

const paginaCriarFesta = (req, res) => 
{
    res.render('usuario/criarFesta', { nome : req.session.usuario.nome});
}

const criarFesta = async (req, res) => {
    try {
        const data = req.body.data;
        const horario = req.body.horario;
        const tema = req.body.tema;
        const local = req.body.local;
        const idUsuario = parseInt(req.session.usuario.idUsuario);
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
        const festasContratadas = await festasModel.findAll(
            {
                where: {idUsuario: req.session.usuario.idUsuario}
            }
        );
        console.log("funcionou")
        res.status(201).render('usuario/festasContratadas', { nome: req.session.usuario.nome, festasContratadas });

    } catch (error) {
        console.error(error)
        res.status(500).render(`usuario/criarFesta`, { error });
    }
}
const paginaCadastro = (req, res) =>
{
    res.render('pages/cadastroPage')
};

const excluirConta = async (req, res) => {
    try{
        const usuario = await usuarios.findOne({
            where:{idUsuario: req.session.usuario.idUsuario}
        });
        await usuario.destroy();
        res.redirect('/');
    } catch(error){
        console.error("Erro inesperado: ");
    };
};

const editarInfosPagina = async (req, res) => {
    try{
            const usuario = await usuarios.findOne({
                where:{idUsuario: req.session.usuario.idUsuario}
            })
    }catch(error){
        console.error("Erro inesperado: ", error)
    }
}

const editarInfos = async (req, res) => {
    try{

    } catch(error){
        
    }
}

module.exports = {
    cadastroContratante,
    loginUsuario,
    logoutUsuario,
    festasUsuarioSessao,
    criarFesta,
    paginaCriarFesta,
    paginaCadastro,
    excluirConta
}