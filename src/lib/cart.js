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
    addOne(product) {
        let inCart = this.items.find(item => item.product.id == product.id);

        if (!inCart) {
            inCart = {
                product: {
                    ...product,
                    formattedPrice: formatPrice(product.price)
                },
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            };

            this.items.push(inCart);
        }

        if (inCart.quantity >= product.quantity) return this;

        inCart.quantity++;
        inCart.price = inCart.price * inCart.quantity;
        inCart.formatPrice = formatPrice(inCart.price);

        this.total.quantity++;
        this.total.price += inCart.product.price;
        this.total.formattedPrice = formatPrice(this.total.price);

        return this;
    },
    removeOne(productId) {
        const inCart = this.items.find(item => item.product.id == productId);

        if (!inCart) return this;

        inCart.quantity--;
        inCart.price = inCart.product.price * inCart.product.quantity;
        inCart.formattedPrice = formatPrice(inCart.price);

        this.total.quantity--;
        this.total.price -= inCart.product.price;
        this.total.formattedPrice = formatPrice(this.total.price);

        if (inCart.quantity < 1) {
            this.items = this.items.filter(item =>
                item.product.id != inCart.product.id);

            return this;
        }

        return this;
    },
    delete(productId) { }
};

module.exports = Cart;