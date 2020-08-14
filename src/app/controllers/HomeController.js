const { formatPrice } = require('../../lib/utils');
const Product = require('../models/Product');
const File = require('../models/File');

module.exports = {
    async index(req, res) {
        let results = await Product.all();
        const products = results.rows;

        if (!products) return res.send('Produtos não encontrados!');
    }
}