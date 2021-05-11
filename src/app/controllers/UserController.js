const { unlinkSync } = require('fs');
const { hash } = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');
const LoadService = require('../services/LoadProductService');

const { formatCpfCnpj, formatCep } = require('../../lib/utils');

module.exports = {
  registerForm(req, res) {
    return res.render('templates/user/register');
  },
  async show(req, res) {
    try {
      const { user } = req;

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
      user.cep = formatCep(user.cep);

      return res.render('templates/user/index', { user });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj, cep, address } = req.body;

      password = await hash(password, 8);
      cpf_cnpj = cpf_cnpj.replace(/\D/g, '');
      cep = cep.replace(/\D/g, '');

      const userId = await User.create({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address
      });

      req.session.userId = userId;

      return res.redirect('/users');
    } catch (err) {
      console.error(err);
    }
  },
  async update(req, res) {
    try {
      const { user } = req;
      let { name, email, cpf_cnpj, cep, address } = req.body;

      cpf_cnpj = cpf_cnpj.replace(/\D/g, '');
      cep = cep.replace(/\D/g, '');

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      });

      return res.render('templates/user/index', {
        user: req.body,
        success: 'Conta atualizada com sucesso!'
      });

    } catch (err) {
      console.error(err);
      return res.render('templates/user/index', {
        error: 'Algum error aconteceu!'
      });
    }
  },
  async delete(req, res) {
    try {
      const products = await Product.findAll({ where: { user_id: req.body.id } });

      const allFilesPromise = products.map(product => {
        return Product.files(product.id);
      });

      let promiseResults = await Promise.all(allFilesPromise);

      promiseResults.map(files => {
        files.map(file => {
          try {
            unlinkSync(file.path);
          } catch (err) {
            console.error(err);
          }
        });
      });

      await User.delete(req.body.id);
      req.session.destroy();

      return res.render('templates/session/login', {
        success: 'Conta excluída com sucesso!'
      });
    } catch (err) {
      console.error(err);
      return res.render('templates/user/index', {
        user: req.body,
        error: 'Erro ao tentar excluir sua conta!'
      });
    }
  },
  async ads(req, res) {
    const products = await LoadService.load('products', {
      where: { user_id: req.session.userId }
    });

    return res.render('templates/user/ads', { products });
  }
};
