const User = require('../models/User');

module.exports = {
    registerForm(req, res) {
        return res.render('user/register');
    },
    post(req, res) {
        return res.send('passed.');
    }
};