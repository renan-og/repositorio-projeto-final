const funcionarios = require('../model/modelFuncionarios');

exports.listarFuncionarios = async (req, res) => {
    try {
        const funcionarios = await funcionarios.findAll();
        res.render('pages/funcionariosPage');
    } catch (err) {
        res.status(500).render('pages/funcionariosPage', { erro: 'Erro ao buscar tarefas'});
    }
};