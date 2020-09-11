const express = require('express');
const routes = express.Router();
const products = require('./products');
const users = require('./users');
const HomeController = require('../app/controllers/HomeController');

routes.use('/products', products);
routes.use('/users', users);

// Home
routes.get('/', HomeController.index);

// Alias
routes.get('/ads/create', function (req, res) {
    return res.redirect('/products/create');
});

module.exports = routes;