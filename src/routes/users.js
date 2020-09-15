const express = require('express');
const routes = express.Router();
const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/user');
const { isLoggedRedirectToUsers } = require('../app/middlewares/session');
const SessionValidator = require('../app/validators/session');

// Login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// Reset password
// routes.get('/forgot-password', SessionController.forgotForm);
// routes.get('/password-reset', SessionController.resetForm);
// routes.post('/forgot-password', SessionController.forgot);
// routes.post('/password-reset', SessionController.reset);

// User register
routes.get('/register', UserController.registerForm);
routes.post('/register', UserValidator.post, UserController.post);

routes.get('/', UserValidator.show, UserController.show);
routes.put('/', UserValidator.update, UserController.update);
// routes.delete('/', UserController.delete);

module.exports = routes;