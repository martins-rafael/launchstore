const routes = require('express').Router();
const CartController = require('../app/controllers/CartController');

routes.get('/', CartController.index);
routes.post('/:id/add-one', CartController.addOne);
routes.post('/:id/remove-one', CartController.removeOne);
routes.post('/:id/delete', CartController.delete);

module.exports = routes;
