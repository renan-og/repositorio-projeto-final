const funcionarios = require('../model/modelUsuarios');

exports.listarFuncionarios = async (req, res) => {
    try {
        const todosFuncionarios = await funcionarios.findAll();
        res.render('pages/funcionariosPage', { funcionarios: todosFuncionarios});
    } catch (err) {
        res.status(500).render('pages/funcionariosPage', { erro: 'Erro ao buscar tarefas'});
    }
};