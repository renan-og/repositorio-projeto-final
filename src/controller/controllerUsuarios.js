const funcionarios = require('../model/modelUsuarios');

const listarFuncionarios = async (req, res) => {
    try {
        const todosFuncionarios = await funcionarios.findAll();
        res.render('pages/funcionariosPage', { funcionarios: todosFuncionarios});
    } catch (err) {
        res.status(500).render('pages/funcionariosPage', { erro: 'Erro ao buscar usuarios'});
    }
};

const cadastrarUsuario = async (req, res) =>
{
    try {
        const nome = req.body.nome;
        const CPF = req.body.CPF;
        const email = req.body.email;
        const senha = req.body.senha;
        const tipoFuncionario = 'funcionario';
        const tipoContratante = 'contratante';

        const novoUsuario = await funcionarios.create({
            nome: nome,
            CPF: CPF,
            email: email,
            senha: senha,
        })

    } catch(error) {
            console.error(error);
            res.status(500).render('pages/cadastroUsuario', { error });
        }
}