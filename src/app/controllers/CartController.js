const Cart = require('../../lib/cart');
const loadProductsService = require('../services/LoadProductService');

module.exports = {
    async index(req, res) {
        try {
            const product = await loadProductsService.load('product', { where: { id: 12 } });
            let { cart } = req.session;

            // cart manager
            cart = Cart.init(cart).addOne(product);

            return res.render('cart/index', { cart });
        } catch (err) {
            console.log(err);
        }
    }
};