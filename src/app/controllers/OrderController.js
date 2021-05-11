const User = require('../models/User');
const Order = require('../models/Order');
const LoadProductService = require('../services/LoadProductService');
const LoadOrderService = require('../services/LoadOrderService');

const mailer = require('../../lib/mailer');
const Cart = require('../../lib/cart');

const email = (seller, product, buyer) => `
  <h2>Olá ${seller.name}</h2>
  <p>Você tem um novo pedido de compra do seu produto</p>
  <p>Produto: ${product.name}</p>
  <p>Preço: ${product.formatedPrice}</p>
  <br><br>
  <h3>Dados do comprador</h3>
  <p>${buyer.name}</p>
  <p>${buyer.email}</p>
  <p>${buyer.address}</p>
  <p>${buyer.cep}</p>
  <br><br>
  <p><strong>Entre em contato com o comprador para finalizar a venda</strong></p>
  <br><br>
  <p>Atenciosamente, Equipe LaunchStore</p>
`;

module.exports = {
  async index(req, res) {
    const orders = await LoadOrderService.load('orders', {
      where: { buyer_id: req.session.userId }
    });
    return res.render('templates/orders/index', { orders });
  },
  async sales(req, res) {
    const sales = await LoadOrderService.load('orders', {
      where: { seller_id: req.session.userId }
    });
    return res.render('templates/orders/sales', { sales });
  },
  async show(req, res) {
    const order = await LoadOrderService.load('order', {
      where: { id: req.params.id }
    });
    return res.render('templates/orders/details', { order });
  },
  async post(req, res) {
    try {
      const cart = Cart.init(req.session.cart);
      const buyer_id = req.session.userId;

      const filteredItems = cart.items.filter(item =>
        item.product.user_id != buyer_id
      );

      const createOrdersPromise = filteredItems.map(async item => {
        let { product, price: total, quantity } = item;
        const { price, id: product_id, user_id: seller_id } = product;
        const status = 'open';
        const order = await Order.create({
          seller_id,
          buyer_id,
          product_id,
          price,
          total,
          quantity,
          status
        });

        product = await LoadProductService.load('product', {
          where: { id: product.id }
        });

        const seller = await User.findOne({ where: { id: seller_id } });
        const buyer = await User.findOne({ where: { id: buyer_id } });

        await mailer.sendMail({
          to: seller.email,
          from: 'no-reply@launhstore.com.br',
          subject: 'Novo pedido de compra',
          html: email(seller, product, buyer)
        });

        return order;
      });

      await Promise.all(createOrdersPromise);

      delete req.session.cart;
      Cart.init();

      return res.render('templates/orders/success');
    } catch (err) {
      console.error(err);
      return res.render('templates/orders/error');
    }
  },
  async update(req, res) {
    const { id, action } = req.params;
    const acceptedActions = ['close', 'cancel'];

    if (!acceptedActions.includes(action)) return res.send('Can\'t do this action!');

    const order = await Order.findOne({ where: { id } });

    if (!order) return res.send('Order not found!');
    if (order.status != 'open') return res.send('Can\'t do this action!');

    const statuses = {
      close: 'sold',
      cancel: 'canceled'
    };

    order.status = statuses[action];
    await Order.update(id, { status: order.status });

    return res.redirect('/orders/sales');
  }
};
