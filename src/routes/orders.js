const routes = require('express').Router();
const OrderController = require('../app/controllers/OrderController');
const { onlyUsers } = require('../app/middlewares/session');

routes.get('/', onlyUsers, OrderController.index);
routes.get('/sales', onlyUsers, OrderController.sales);
routes.get('/:id', onlyUsers, OrderController.show);
routes.post('/', onlyUsers, OrderController.post);
routes.post('/:id/:action', onlyUsers, OrderController.update);

module.exports = routes;
