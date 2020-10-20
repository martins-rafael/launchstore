const Product = require('../models/Product');
const LoadService = require('../services/LoadProductService');

module.exports = {
    async index(req, res) {
        try {
            let params = {};
            const { filter, category } = req.query;

            if (!filter) return res.redirect('/');

            params.filter = filter;

            if (category) {
                params.category = category;
            }

            let products = await Product.search(params);
            const productsPromise = products.map(LoadService.format);
            
            products = await Promise.all(productsPromise);
            
            const search = {
                term: req.query.filter,
                total: products.length
            };

            const categories = products.map(product=>({
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => {
                const found = categoriesFiltered.some(cat => cat.id == category.id);
                if (!found) categoriesFiltered.push(category);
                return categoriesFiltered
            },[]);

            return res.render('search/index', { products, search, categories });
        } catch (err) {
            console.log(err);
        }

    }
};