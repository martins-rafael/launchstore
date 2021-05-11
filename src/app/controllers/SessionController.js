const User = require('../models/User');

const { hash } = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../../lib/mailer');

module.exports = {
  loginForm(req, res) {
    return res.render('templates/session/login');
  },
  login(req, res) {
    req.session.userId = req.user.id;
    return res.redirect('/users');
  },
  logout(req, res) {
    req.session.destroy();
    return res.redirect('/');
  },
  forgotForm(req, res) {
    return res.render('templates/session/forgot-password');
  },
  async forgot(req, res) {
    try {
      const user = req.user;

      // user token
      const token = crypto.randomBytes(20).toString('hex');

      // token expires in one hour
      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      });

      // send email with recovery link
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'Recuperação de senha',
        html: `
          <h2>Perdeu a chave?</h2>
          <p>Sem problemas, clique no link abaixo para recuperar sua senha</p>
          <p>
            <a href="http:localhost:3000/users/password-reset?token=${token}" target="_blank">
              RECUPERAR SENHA
            </a>
          </p>
        `
      });

      // notify user about email sent
      return res.render('templates/session/forgot-password', {
        success: 'Verifique seu email para resetar sua senha!'
      });
    } catch (err) {
      console.error(err);

      return res.render('templates/session/forgot-password', {
        error: 'Erro inesperado, tente novamente!'
      });
    }
  },
  resetForm(req, res) {
    return res.render('templates/session/password-reset', { token: req.query.token });
  },
  async reset(req, res) {
    try {
      const { user } = req;
      const { password } = req.body;
      const newPassword = await hash(password, 8);

      await User.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: ''
      });

      return res.render('templates/session/login', {
        user: req.body,
        success: 'Senha atualizada! Faça o seu login.'
      });
    } catch (err) {
      console.error(err);

      return res.render('templates/session/password-reset', {
        user: req.body,
        token: req.body.token,
        error: 'Erro inesperado, tente novamente!'
      });
    }
  }
};
