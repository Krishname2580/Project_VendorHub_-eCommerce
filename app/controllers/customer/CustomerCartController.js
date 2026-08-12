const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

class CustomerCartController {

    // ===============================
    // Cart List
    // ===============================

    async cart(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }

            const cartItems = await Cart.find({
                user: customer._id
            }).populate("product");

            let total = 0;

            cartItems.forEach(item => {

                if (item.product) {

                    total += item.product.price * item.quantity;

                }

            });

            return res.render("customer/cart", {

                title: "My Cart",

                customer,

                cartItems,

                total

            });

        } catch (error) {

            console.log("Cart Error:", error);

            return res.redirect("/customer/products");

        }

    }


    // ===============================
    // Add To Cart
    // ===============================

    async addToCart(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }

            const productId = req.params.id;

            const product = await Product.findById(productId);

            if (!product) {
                return res.redirect("/customer/products");
            }

            const cartItem = await Cart.findOne({

                user: customer._id,

                product: productId

            });

            if (cartItem) {

                // Product already exists
                // Increase quantity

                cartItem.quantity += 1;

                await cartItem.save();

            } else {

                // New product

                await Cart.create({

                    user: customer._id,

                    product: productId,

                    quantity: 1

                });

            }

            return res.redirect("/customer/cart");

        } catch (error) {

            console.log("Add To Cart Error:", error);

            return res.redirect("/customer/products");

        }

    }


    // ===============================
    // Increase / Decrease Quantity
    // ===============================

    async updateQuantity(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }

            const cart = await Cart.findOne({

                _id: req.params.id,

                user: customer._id

            });

            if (!cart) {
                return res.redirect("/customer/cart");
            }

            const action = req.body.action;

            if (action === "increase") {

                cart.quantity += 1;

            }

            if (action === "decrease") {

                if (cart.quantity > 1) {

                    cart.quantity -= 1;

                }

            }

            await cart.save();

            return res.redirect("/customer/cart");

        } catch (error) {

            console.log("Update Quantity Error:", error);

            return res.redirect("/customer/cart");

        }

    }


    // ===============================
    // Remove Item
    // ===============================

    async removeItem(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }

            await Cart.findOneAndDelete({

                _id: req.params.id,

                user: customer._id

            });

            return res.redirect("/customer/cart");

        } catch (error) {

            console.log("Remove Cart Item Error:", error);

            return res.redirect("/customer/cart");

        }

    }


    // ===============================
    // Clear Cart
    // ===============================

    async clearCart(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }

            await Cart.deleteMany({

                user: customer._id

            });

            return res.redirect("/customer/cart");

        } catch (error) {

            console.log("Clear Cart Error:", error);

            return res.redirect("/customer/cart");

        }

    }

}

module.exports = new CustomerCartController();