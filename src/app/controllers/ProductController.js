const { unlinkSync } = require('fs');

const Category = require('../models/Category');
const Product = require('../models/Product');
const File = require('../models/File');
const LoadService = require('../services/LoadProductService');

module.exports = {
  async create(req, res) {
    try {
      const categories = await Category.findAll();
      return res.render('templates/products/create', { categories });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    try {
      let { category_id, name, description, old_price,
        price, quantity, status } = req.body;

      price = req.body.price.replace(/\D/g, '');

      const product_id = await Product.create({
        category_id,
        user_id: req.session.userId,
        name,
        description,
        old_price: old_price || price,
        price,
        quantity,
        status: status || 1
      });

      const filesPromise = req.files.map(file => File.create({
        name: file.name,
        path: file.path,
        product_id
      }));
      await Promise.all(filesPromise);

      return res.redirect(`/products/${product_id}`);
    } catch (err) {
      console.error(err);
    }
  },
  async show(req, res) {
    try {
      const product = await LoadService.load('product', {
        where: { id: req.params.id }
      });

      return res.render('templates/products/show', { product });
    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      const product = await LoadService.load('product', {
        where: { id: req.params.id }
      });

      // get categories
      const categories = await Category.findAll();

      return res.render('templates/products/edit', { product, categories });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    try {
      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(file => {
          File.create({ ...file, product_id: req.body.id });
        });

        await Promise.all(newFilesPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(',');
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedFilesPromise = removedFiles.map(id => File.delete(id));
        await Promise.all(removedFilesPromise);
      }

      req.body.price = req.body.price.replace(/\D/g, '');

      if (req.body.old_price != req.body.price) {
        const oldProduct = await Product.find(req.body.id);
        req.body.old_price = oldProduct.price;
      }

      await Product.update(req.body.id, {
        category_id: req.body.category_id,
        name: req.body.name,
        description: req.body.description,
        old_price: req.body.old_price,
        price: req.body.price,
        quantity: req.body.quantity,
        status: req.body.status
      });

      return res.redirect(`products/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    try {
      const files = await Product.files(req.body.id);
      await Product.delete(req.body.id);

      files.map(file => {
        try {
          unlinkSync(file.path);
        } catch (err) {
          console.error(err);
        }
      });

      return res.redirect('/');
    } catch (err) {
      console.error(err);
    }
  }
};
