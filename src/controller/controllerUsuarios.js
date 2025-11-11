const usuarios = require('../model/modelUsuarios');

const listarFuncionarios = async (req, res) => {
    try {
        const todosFuncionarios = await funcionarios.findAll();
        res.render('pages/funcionariosPage', { funcionarios: todosFuncionarios});
    } catch (err) {
        res.status(500).render('pages/funcionariosPage', { erro: 'Erro ao buscar usuarios'});
    }
};

const cadastroContratante = async (req, res) =>
{
    try {
        const nome = req.body.usuario;
        const CPF = req.body.CPF;
        const email = req.body.email;
        const senha = req.body.senha;

        const novoContratante = await usuarios.create({
            nome: nome,
            CPF: CPF,
            email: email,
            senha: senha,
            tipo: 'contratante'
        })
        res.redirect('/');
    } catch(error) {
            console.error(error);
            res.status(500).render('pages/cadastroPage', { error });
        }
};
const cadastroFuncionario = async (req, res) =>
{
    try {
        const nome = req.body.usuario;
        const CPF = req.body.CPF;
        const email = req.body.email;
        const senha = req.body.senha;

        const novoUsuario = await usuarios.create({
            nome: nome,
            CPF: CPF,
            email: email,
            senha: senha,
            tipo: 'funcionario'
        });
        res.redirect('/');

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
        const usuarioExistente = await usuarios.findOne(
            {
                where: {nome: nome}
            }
        );
        if (!usuarioExistente)
            {
                res.status(404).render('pages/cadastroPage')//se o usuario ainda não for cadastrado/findOne não encontrar uma linha correspondente, ele é redirecionado para a pagina de cadastro   
            };
        //caso ja seja cadastrado, ele vai para a verificação da senha
        if(usuarioExistente.senha !== senha)
            {
             res.status(401).render('pages/mainPage', {erroSenha: "Senha incorreta"}); 
             return;  
            }
        //Em caso de login bem sucedido, o usuario é redirecionado diretamente para a página de contrato de festas
        req.session.usuario = 
        {
            id: usuarioExistente.idUsuario,
            nome: usuarioExistente.nome,
            email: usuarioExistente.email,
            tipo: usuarioExistente.tipo
        };
        res.status(200).render('usuario/criarFesta', { nome: usuarioExistente.nome });
    } catch (error) 
        {
            console.log('Ocorreu um erro inesperado: ' + error)
        }
};

module.exports = {
    listarFuncionarios,
    cadastroContratante,
    cadastroFuncionario,
    loginUsuario
}