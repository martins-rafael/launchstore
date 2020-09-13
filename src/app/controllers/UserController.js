const User = require('../models/User');

module.exports = {
    registerForm(req, res) {
        return res.render('user/register');
    },
    show (req, res) {
        return res.send('Cadastrado.');
    },
    async post(req, res) {
        const userId = await User.create(req.body);

        return res.redirect('/users');
    }
};