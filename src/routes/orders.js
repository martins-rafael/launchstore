const express = require('express');
const routes = express.Router();

const OrderController = require('../app/controllers/OrderController');

const { onlyUsers } = require('../app/middlewares/session');

routes.get('/', onlyUsers, OrderController.index);
routes.get('/sales', onlyUsers, OrderController.sales);
routes.post('/', onlyUsers, OrderController.post);

module.exports = routes;