const express = require('express');
const routes = express.Router();

const CartController = require('../app/controllers/CartController');

routes.get('/', CartController.index);

module.exports = routes;