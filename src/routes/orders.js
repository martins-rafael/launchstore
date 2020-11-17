const express = require('express');
const routes = express.Router();

const OrderController = require('../app/controllers/OrderController');

const { onlyUsers } = require('../app/middlewares/session');

routes.post('/', onlyUsers, OrderController.post);

module.exports = routes;