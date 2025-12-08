const usuarios = require('../model/modelUsuarios');
const festasModel = require('../model/modelFestas');
const festa_funcionario = require('../model/modelFesta_Funcionario');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const { Op } = require('sequelize');
const funcionarios = require('../model/modelFuncionarios');

const cadastroContratante = async (req, res) =>
{
    try {

        
        const nome = req.body.nome;
        const userName = req.body.userName
        const cpf = req.body.CPF;
        const email = req.body.email;
        const senha = req.body.senha;
        
        const existente = await usuarios.findOne({
            where:{
                [Op.or]:[
                    {userName:userName},
                    {CPF:cpf},
                    {email:email},
                ]
            }
        })
        if(existente){ //faz a verificaçao para saber se existe algum campo com entrada duplicada 
            if(existente.userName == userName){
                res.status(500).render('pages/cadastroPage', { mensagem: "Nome de usuario ja cadastrado"});
                    console.log("Nome de usuario ja cadastrado");
                    return;
                }else if(existente.CPF == cpf){
                    res.status(500).render('pages/cadastroPage', { mensagem: "CPF ja cadastrado"});
                        console.log("CPF ja cadastrado");
                        return;
                }else if(existente.email == email){
                    res.status(500).render('pages/cadastroPage', { mensagem: "email ja cadastrado"});
                        console.log("email ja cadastrado");
                        return;
                }
            };

        if(nome == "" || userName == "" || cpf == "" || email == "" || senha == ""){
            res.status(500).render('pages/cadastroPage', { mensagem: "Campos em branco, preencha-os"});
            return
        }

        const senhaHash = await bcrypt.hash(senha, 10);//codificação da senha no cadastro

        const novoContratante = await usuarios.create({
            nome: nome,
            userName: userName,
            CPF: cpf,
            email: email,
            senha: senhaHash,
            tipo: "contratante"
        });
        res.redirect('/#login');
    } catch(error) {
            console.error(error);
            res.status(400).render('pages/paginaErro', { error });
        }
};
//validação do login
const loginUsuario = async (req, res) => 
{
    try
    {
        const userName = req.body.userName;
        const senha = req.body.senha;
        if(userName == "" && senha == ""){
            res.status(200).render('pages/mainPage', {erroSenha: "Preencha os campos acima"})
            return;
        };
        //finOne procura uma linha onde o valor de nome seja igual ao valor da requisição do usuario no login
        if(userName == 'admin' && senha == 'admin123'){
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
                userName: userName
            }
        });
        if(usuarioExistente){
            console.log("usuario encontrado");
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
                tipo: "contratante"
            };
            res.status(201).render('pages/contratanteMainPage', { nome: req.session.usuario.nome });
        }else if (usuarioExistente == null){
            const funcionarioExistente = await funcionarios.findOne({where:{userName:userName}});
            if(funcionarioExistente){
                console.log("FUNCIONARIO ENCONTRADO");
                const verificacaoSenha = await bcrypt.compare(senha, funcionarioExistente.senha);
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
                    idUsuario: funcionarioExistente.idFuncionario,
                    nome: funcionarioExistente.nome,
                    email: funcionarioExistente.email,
                    tipo: "Funcionario"
                };
    
                const todosFuncionarios = await funcionarios.findAll();
                const idsFuncionarios = todosFuncionarios.map(funcionario => funcionario.idFuncionario);//mapeia o array de funcionarios e cria um novo array apenas com os ids
                const juncoes = await festa_funcionario.findAll({where:{idFuncionario:req.session.usuario.idUsuario}});
    
                const idsFestas = juncoes.map(festa => festa.idFesta);
    
                const festasAtribuidas = await festasModel.findAll({where:{idFesta:{[Op.in]:idsFestas}}});
    
                res.status(201).render('pages/FuncionarioMainPage', { nome: req.session.usuario.nome, festas: festasAtribuidas });
            }else if(funcionarioExistente == null){
                res.status(200).render('pages/cadastroPage', {mensagem: "Parece que voce ainda nao esta cadastrado. Realize seu cadastro ja!!"});
                return;
            }
        }
        } catch (error) 
        {
            console.log('Ocorreu um erro inesperado: ' + error);
            res.status(401).render('pages/paginaErro', { error });
        }
};
//realizar logout
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
    } catch (error) {
        res.status(500).render('pages/paginaErro', { error: error });
    };
};

const paginaCriarFesta = (req, res) => 
{
    res.render('usuario/criarFesta', { mensagem: null, nome : req.session.usuario.nome});
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
        
        const festaExistente = await festasModel.findOne({where:{[Op.or]:{
            horario:horario,
            data:data,
            local
        }}});
        if(festaExistente){
            res.status(500).render('usuario/criarFesta', {mensagem: "Ja existe uma festa agendada para esse salão nessa data e horario, sentimos muito:<", nome: req.session.usuario.nome});
            return;
        }

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
        res.status(500).render(`pages/paginaErro`, { error: error });
    }
}
const paginaCadastro = (req, res) =>
{
    res.render('pages/cadastroPage', { mensagem: null });
};

const excluirConta = async (req, res) => {
    try{
        const festas = await festasModel.findAll({where:{idUsuario: req.session.usuario.idUsuario}});
        const idsFestas = festas.map(festaId => festaId.idFesta);

        await festa_funcionario.destroy({where:{idFesta:{[Op.in]:idsFestas}}});
        await festasModel.destroy({
            where: {idUsuario: req.session.usuario.idUsuario}
        })
        await usuarios.destroy({
            where:{idUsuario: req.session.usuario.idUsuario}
        });

        res.redirect('/');
    } catch(error){
        console.error("Erro inesperado: ");
        res.status(401).render('pages/paginaErro', { error: error });
    };
};

const paginaPerfil = async (req, res) => {
    try{
            if(!req.session.usuario){
                console.log("nennhuma sessao ativa");
                res.render('pages/cadastroPage', { mensagem: null });
                return;
            }else if(req.session.usuario.tipo == "contratante"){
                const usuario = await usuarios.findOne({
                    where:{idUsuario: req.session.usuario.idUsuario}
                });
                res.status(200).render('usuario/perfilUsuario', { mensagem:null, usuario: usuario });
            }else if(req.session.usuario.tipo == "funcionario"){
                const funcionario = await funcionarios.findOne({
                    where:{idFuncionario: req.session.usuario.idUsuario}
                });
                res.status(200).render('usuario/perfilUsuario', { mensagem:null, usuario: funcionario });
            }
    }catch(error){
        console.error("Erro inesperado: ", error);
        res.status(400).render('pages/paginaErro', { error: error });
    };
};

const editarInfos = async (req, res) => {
    try{
        console.log("chegou pelo menos na edição");
        if(req.session.usuario.tipo == "contratante"){
            console.log("chegou na edição");
            const usuarioLogado = await usuarios.findOne({
                where:{
                        idUsuario: req.session.usuario.idUsuario
                    }
                });
                const senhaNua = req.body.novaSenha;
                const confirmarSenha = req.body.confirmarSenha;
                const confirmSenha = await bcrypt.compare(confirmarSenha, usuarioLogado.senha);
                
                if(confirmSenha){
                    console.log("a autenticaçao funcionou");
                    const userName = req.body.userName;
                    const novaSenhaHash = await bcrypt.hash(senhaNua, 10);
                    if(senhaNua==null || senhaNua == ""){
                        console.log("editou o nome")
                        const usuarioEditado = await usuarios.update({
                        userName: userName
                        }, {
                            where:{
                                idUsuario: req.session.usuario.idUsuario
                            }
                        });
                        res.status(200).render('usuario/perfilUsuario', { mensagem: "Atualização realizada com sucesso", usuario: usuarioEditado});
                        return;

                    }else if(userName=="" || userName == null){
                        console.log("editou a senha");
                        const usuarioEditado = await usuarios.update({
                        senha: novaSenhaHash
                        }, {
                            where:{
                                idUsuario: req.session.usuario.idUsuario
                            }
                        });
                        res.status(200).render('usuario/perfilUsuario', { mensagem: "Atualização realizada com sucesso", usuario: usuarioEditado});
                        return;
                    }
                }else{
                    res.status(200).render('usuario/perfilUsuario', { mensagem: "Nada a alterar", usuario: usuarioLogado});
                    return
                };
        }else if(req.session.usuario.tipo == "funcionario"){
            const FuncionarioLogado = await funcionarios.findOne({
                where:{
                        idFuncionario: req.session.usuario.idUsuario
                    }
                });
                const senhaNua = req.body.novaSenha;
                const confirmarSenha = req.body.confirmarSenha;
                const confirmSenha = await bcrypt.compare(confirmarSenha, FuncionarioLogado.senha);
                
                if(confirmSenha){
                    console.log("a autenticaçao funcionou");
                    const userName = req.body.userName;
                    const novaSenhaHash = await bcrypt.hash(senhaNua, 10);
                    if(senhaNua==""){
                        const FuncionarioEditado = await funcionarios.update({
                        userName: userName
                        }, {
                            where:{
                                idFuncionario: req.session.usuario.idUsuario
                            }
                        });
                        res.status(200).render('usuario/perfilUsuario', { mensagem: "Atualização realizada com sucesso", usuario: FuncionarioEditado});
                        return;

                    }else if(userName==""){
                        const FuncionarioEditado = await funcionarios.update({
                        senha: novaSenhaHash
                        }, {
                            where:{
                                idFuncionario: req.session.usuario.idUsuario
                            }
                        });
                        res.status(200).render('usuario/perfilUsuario', { mensagem: "Atualização realizada com sucesso", usuario: usuarioEditado});
                        return;
                    }else{
                        const FuncionarioEditado = await funcionarios.update({
                        senha: novaSenhaHash,
                        userName: userName
                        }, {
                            where:{
                                idFuncionario: req.session.usuario.idUsuario
                            }
                        });
                        res.status(200).render('usuario/perfilUsuario', { mensagem: "Atualização realizada com sucesso", usuario: usuarioEditado});
                        return;
                    }
                }else{
                    return
                };
        }
        
    } catch(error){
        console.log("ERRO: " + error);
        res.status(500).render('pages/paginaErro', {error: error});
    }
};

module.exports = {
    cadastroContratante,
    loginUsuario,
    logoutUsuario,
    festasUsuarioSessao,
    criarFesta,
    paginaCriarFesta,
    paginaCadastro,
    paginaPerfil,
    editarInfos,
    excluirConta
};