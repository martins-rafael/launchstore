const { formatPrice } = require('./utils');

const Cart = {
    init(oldCard) {
        if (oldCard) {
            this.items = oldCard.items;
            this.total = oldCard.total;
        } else {
            this.items = [];
            this.total = {
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            };
        }

        return this;
    },
    addOne(product) { },
    removeOne(productId) { },
    delete(productId) { }
};

module.exports = Cart;