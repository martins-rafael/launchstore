const User = require('../models/User');
const { compare } = require('bcryptjs');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (let key of keys) {
    if (body[key] == '') {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos.'
      };
    }
  }
}

async function show(req, res, next) {
  const { userId: id } = req.session;
  const user = await User.findOne({ where: { id } });

  if (!user) return res.render('templates/user/register', {
    error: 'Usuário não encontrado!'
  });

  req.user = user;
  next();
}

async function post(req, res, next) {
  // check if has all fields
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.render('templates/user/register', fillAllFields);

  // check if user exists
  let { email, cpf_cnpj, password, password_repeat } = req.body;

  cpf_cnpj = cpf_cnpj.replace(/\D/g, '');

  const user = await User.findOne({
    where: { email },
    or: { cpf_cnpj }
  });

  if (user) return res.render('templates/user/register', {
    user: req.body,
    error: 'Este usuário já está cadastrado!'
  });

  // check if password match
  if (password != password_repeat) {
    return res.render('templates/user/register', {
      user: req.body,
      error: 'Os campos senha e repetir senha precisar ser iguais.'
    });
  }

  next();
}

async function update(req, res, next) {
  // check if has all fields
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.render('templates/user/index', fillAllFields);

  const { id, password } = req.body;

  if (!password) {
    return res.render('templates/user/index', {
      user: req.body,
      error: 'Insira sua senha para atualizar seu cadastro.'
    });
  }

  const user = await User.findOne({ where: { id } });
  const passed = await compare(password, user.password);

  if (!passed) {
    return res.render('templates/user/index', {
      user: req.body,
      error: 'Senha incorreta.'
    });
  }

  req.user = user;
  next();
}

module.exports = {
  post,
  show,
  update
};
