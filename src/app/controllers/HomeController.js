const LoadProductsService = require('../services/LoadProductService');

module.exports = {
  async index(req, res) {
    try {
      const allProducts = await LoadProductsService.load('products');
      const products = allProducts
        .filter((product, index) => index > 2 ? false : true);

      return res.render('templates/home/index', { products });
    } catch (err) {
      console.log(err);
    }
  }
};
