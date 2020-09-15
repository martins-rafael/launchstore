module.exports = {
    loginForm(req, res) {
        return res.render('session/index');
    },
    logout(req, res) {
        req.session.destroy();
        return res.redirect('/');
    }
}