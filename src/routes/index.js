const routes = require('express').Router();

const products = require('./products');
const users = require('./users');
const cart = require('./cart');
const orders = require('./orders');

const HomeController = require('../app/controllers/HomeController');

routes.use('/products', products);
routes.use('/users', users);
routes.use('/cart', cart);
routes.use('/orders', orders);

// Home
routes.get('/', HomeController.index);

// Alias
routes.get('/ads/create', (req, res) => {
  return res.redirect('/products/create');
});

routes.get('/accounts', (req, res) => {
  return res.redirect('/users/login');
});

module.exports = routes;
