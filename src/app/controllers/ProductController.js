const { formatPrice } = require('../../lib/utils');
const Category = require('../models/Category');
const Product = require('../models/Product');
const File = require('../models/File');

module.exports = {
    async create(req, res) {
        const results = await Category.all();
        const categories = results.rows;

        return res.render('products/create', { categories });
    },
    async post(req, res) {
        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        if (req.files.length == 0)
            return res.send('Por favor, envie pelo menos uma imagem.');


        req.body.price = req.body.price.replace(/\D/g, '');

        let results = await Product.create(req.body);
        const productId = results.rows[0].id;

        const filesPromise = req.files.map(file => File.create({
            ...file,
            product_id: productId
        }));
        await Promise.all(filesPromise);

        return res.redirect(`/products/${productId}`);
    },
    async edit(req, res) {
        let results = await Product.find(req.params.id);
        const product = results.rows[0];

        if (!product) return res.send('Produto não encontrado!');
        product.old_price = formatPrice(product.old_price);
        product.price = formatPrice(product.price);

        results = await Category.all();
        const categories = results.rows;

        return res.render('products/edit', { product, categories });
    },
    async put(req, res) {
        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        req.body.price = req.body.price.replace(/\D/g, '');

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id);
            req.body.old_price = oldProduct.rows[0].price;
        }

        await Product.update(req.body);

        return res.redirect(`products/${req.body.id}`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id);

        return res.redirect('/');
    }
};