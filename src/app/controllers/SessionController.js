module.exports = {
    logout(req, res) {
        req.session.destroy();
        return res.redirect('/');
    }
}