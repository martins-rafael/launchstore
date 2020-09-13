const User = require('../models/User');

async function post(req, res, next) {
    // check if has all fields
    const keys = Object.keys(req.body);

    for (let key of keys) {
        if (req.body[key] == '')
            return res.send('Por favor, preencha todos os campos.');
    }

    // check if user exists
    let { email, cpf_cnpj, password, password_repeat } = req.body;

    cpf_cnpj = cpf_cnpj.replace(/\D/g, '');

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    });

    if (user) return res.send('Este usuário já está cadastrado!');

    // check if password match
    if (password != password_repeat)
        return res.send('Campos senha e repetir senha precisar ser iguais.');

    next();
}

module.exports = { post };