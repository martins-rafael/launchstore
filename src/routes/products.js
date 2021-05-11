const routes = require('express').Router();
const multer = require('../app/middlewares/multer');

const ProductController = require('../app/controllers/ProductController');
const SearchController = require('../app/controllers/SearchController');

const { onlyUsers } = require('../app/middlewares/session');
const Validator = require('../app/validators/product');

// Search
routes.get('/search', SearchController.index);

// Products
routes.get('/create', onlyUsers, ProductController.create);
routes.get('/:id', ProductController.show);
routes.get('/:id/edit', onlyUsers, ProductController.edit);
routes.post('/', onlyUsers, multer.array('photos', 6), Validator.post, ProductController.post);
routes.put('/', onlyUsers, multer.array('photos', 6), Validator.put, ProductController.put);
routes.delete('/', onlyUsers, ProductController.delete);

module.exports = routes;
