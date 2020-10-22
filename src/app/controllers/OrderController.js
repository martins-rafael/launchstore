const User = require('../models/User');
const LoadProductsService = require('../services/LoadProductService');

const mailer = require('../../lib/mailer');

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
    async post(req, res) {
        try {
            const product = await LoadProductsService.load('product', {
                where: { id: req.body.id }
            });

            const seller = await User.findOne({ where: { id: product.user_id } });

            const buyer = await User.findOne({ where: { id: req.session.userId } });

            await mailer.sendMail({
                to: seller.email,
                from: 'no-reply@launhstore.com.br',
                subject: 'Novo pedido de compra',
                html: email(seller, product, buyer)
            });

            return res.render('orders/success');
        } catch (err) {
            console.error(err);
            return res.render('orders/error');
        }
    }
};