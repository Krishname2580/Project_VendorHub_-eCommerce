const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

const Razorpay = require("razorpay");
const crypto = require("crypto");


// ==========================================
// RAZORPAY INSTANCE
// ==========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


class CustomerCheckoutController {


    // ==========================================
    // SHOW CHECKOUT PAGE
    // ==========================================

    async checkout(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }


            const cartItems = await Cart.find({
                user: customer._id
            }).populate({
                path: "product",
                populate: [
                    {
                        path: "category"
                    },
                    {
                        path: "brand"
                    }
                ]
            });


            if (!cartItems || cartItems.length === 0) {

                return res.redirect("/customer/cart");

            }


            let total = 0;


            cartItems.forEach(item => {

                if (!item.product) {
                    return;
                }


                const price =
                    item.product.discountPrice &&
                    item.product.discountPrice > 0
                        ? item.product.discountPrice
                        : item.product.price;


                total += price * item.quantity;

            });


            const shipping = total >= 500 ? 0 : 40;

            const grandTotal = total + shipping;


            return res.render("customer/checkout", {

                title: "Checkout",

                customer,

                cartItems,

                total,

                shipping,

                grandTotal

            });


        } catch (error) {

            console.log("Checkout Error:", error);

            return res.redirect("/customer/cart");

        }

    }



    // ==========================================
    // PLACE COD ORDER
    // ==========================================

    async placeOrder(req, res) {

        try {

            const customer = req.session.customer;


            if (!customer) {

                return res.redirect("/customer/login");

            }


            const {
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                state,
                country,
                pincode,
                orderNotes,
                paymentMethod
            } = req.body;


            // ==========================================
            // IF RAZORPAY
            // ==========================================

            if (paymentMethod === "Razorpay") {

                return this.createRazorpayOrder(req, res);

            }


            // ==========================================
            // GET CART
            // ==========================================

            const cartItems = await Cart.find({
                user: customer._id
            }).populate("product");


            if (!cartItems || cartItems.length === 0) {

                return res.redirect("/customer/cart");

            }


            let subtotal = 0;

            const items = [];


            for (const cartItem of cartItems) {

                if (!cartItem.product) {
                    continue;
                }


                const product = cartItem.product;


                const price =
                    product.discountPrice > 0
                        ? product.discountPrice
                        : product.price;


                const quantity = cartItem.quantity;

                const itemTotal = price * quantity;


                subtotal += itemTotal;


                items.push({

                    product: product._id,

                    vendor: product.vendor,

                    name: product.name,

                    price,

                    quantity,

                    total: itemTotal

                });

            }


            if (items.length === 0) {

                return res.redirect("/customer/cart");

            }


            const shippingCharge =
                subtotal >= 500 ? 0 : 40;


            const discount = 0;


            const grandTotal =
                subtotal -
                discount +
                shippingCharge;


            const orderNumber =
                "ORD-" + Date.now();


            // ==========================================
            // COD ORDER
            // ==========================================

            await Order.create({

                orderNumber,

                customer: customer._id,

                firstName,

                lastName,

                email,

                phone,

                address,

                city,

                state,

                country,

                pincode,

                orderNotes,

                items,

                subtotal,

                discount,

                shippingCharge,

                totalAmount: grandTotal,

                paymentMethod: "COD",

                paymentStatus: "Pending",

                orderStatus: "Pending"

            });


            // Clear cart for COD

            await Cart.deleteMany({

                user: customer._id

            });


            return res.redirect("/customer/orders");


        } catch (error) {

            console.log("Place Order Error:", error);

            return res.redirect("/customer/checkout");

        }

    }



    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    async createRazorpayOrder(req, res) {

        try {

            const customer = req.session.customer;


            if (!customer) {

                return res.status(401).json({

                    success: false,

                    message: "Please login first"

                });

            }


            const {
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                state,
                country,
                pincode,
                orderNotes
            } = req.body;


            // ==========================================
            // GET CART
            // ==========================================

            const cartItems = await Cart.find({

                user: customer._id

            }).populate("product");


            if (!cartItems || cartItems.length === 0) {

                return res.status(400).json({

                    success: false,

                    message: "Cart is empty"

                });

            }


            let subtotal = 0;

            const items = [];


            for (const cartItem of cartItems) {

                if (!cartItem.product) {
                    continue;
                }


                const product = cartItem.product;


                const price =
                    product.discountPrice > 0
                        ? product.discountPrice
                        : product.price;


                const quantity = cartItem.quantity;


                const itemTotal =
                    price * quantity;


                subtotal += itemTotal;


                items.push({

                    product: product._id,

                    vendor: product.vendor,

                    name: product.name,

                    price,

                    quantity,

                    total: itemTotal

                });

            }


            if (items.length === 0) {

                return res.status(400).json({

                    success: false,

                    message: "No valid products"

                });

            }


            const shippingCharge =
                subtotal >= 500 ? 0 : 40;


            const discount = 0;


            const grandTotal =
                subtotal -
                discount +
                shippingCharge;


            // ==========================================
            // CREATE RAZORPAY ORDER
            // ==========================================

            const razorpayOrder =
                await razorpay.orders.create({

                    amount: Math.round(
                        grandTotal * 100
                    ),

                    currency: "INR",

                    receipt:
                        "receipt_" +
                        Date.now()

                });


            // ==========================================
            // CREATE OUR DATABASE ORDER
            // ==========================================

            const orderNumber =
                "ORD-" + Date.now();


            const order =
                await Order.create({

                    orderNumber,

                    customer: customer._id,

                    firstName,

                    lastName,

                    email,

                    phone,

                    address,

                    city,

                    state,

                    country,

                    pincode,

                    orderNotes,

                    items,

                    subtotal,

                    discount,

                    shippingCharge,

                    totalAmount: grandTotal,

                    paymentMethod: "Razorpay",

                    paymentStatus: "Pending",

                    orderStatus: "Pending",

                    razorpayOrderId:
                        razorpayOrder.id

                });


            // ==========================================
            // SEND DATA TO FRONTEND
            // ==========================================

            return res.json({

                success: true,

                key:
                    process.env.RAZORPAY_KEY_ID,

                razorpayOrderId:
                    razorpayOrder.id,

                amount:
                    razorpayOrder.amount,

                currency: "INR",

                orderId:
                    order._id,

                customer: {

                    name:
                        `${firstName} ${lastName}`,

                    email,

                    phone

                }

            });


        } catch (error) {

            console.log(
                "RAZORPAY CREATE ORDER ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to create payment order"

            });

        }

    }



    // ==========================================
    // VERIFY RAZORPAY PAYMENT
    // ==========================================

    async verifyRazorpayPayment(req, res) {

        try {

            const {

                razorpay_payment_id,

                razorpay_order_id,

                razorpay_signature,

                orderId

            } = req.body;


            // ==========================================
            // FIND OUR ORDER
            // ==========================================

            const order =
                await Order.findById(orderId);


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message: "Order not found"

                });

            }


            // ==========================================
            // IMPORTANT
            // USE ORDER ID FROM DATABASE
            // ==========================================

            const serverRazorpayOrderId =
                order.razorpayOrderId;


            // ==========================================
            // CREATE SIGNATURE
            // ==========================================

            const generatedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env.RAZORPAY_KEY_SECRET
                    )
                    .update(
                        serverRazorpayOrderId +
                        "|" +
                        razorpay_payment_id
                    )
                    .digest("hex");


            // ==========================================
            // VERIFY SIGNATURE
            // ==========================================

            if (
                generatedSignature !==
                razorpay_signature
            ) {

                order.paymentStatus =
                    "Failed";

                await order.save();


                return res.status(400).json({

                    success: false,

                    message:
                        "Payment verification failed"

                });

            }


            // ==========================================
            // PAYMENT SUCCESS
            // ==========================================

            order.paymentStatus = "Paid";

            order.orderStatus = "Confirmed";

            order.razorpayPaymentId =
                razorpay_payment_id;

            order.razorpaySignature =
                razorpay_signature;


            await order.save();


            // ==========================================
            // CLEAR CART
            // ==========================================

            await Cart.deleteMany({

                user: order.customer

            });


            return res.json({

                success: true,

                message:
                    "Payment successful",

                orderId:
                    order._id

            });


        } catch (error) {

            console.log(
                "RAZORPAY VERIFY ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Payment verification failed"

            });

        }

    }



    // ==========================================
    // ORDER SUCCESS
    // ==========================================

    async orderSuccess(req, res) {

        try {

            const customer =
                req.session.customer;


            if (!customer) {

                return res.redirect(
                    "/customer/login"
                );

            }


            const order =
                await Order.findOne({

                    _id: req.params.id,

                    customer: customer._id

                }).populate(
                    "items.product"
                );


            if (!order) {

                return res.redirect(
                    "/customer/orders"
                );

            }


            return res.render(
                "customer/order-success",
                {

                    title:
                        "Order Successful",

                    customer,

                    order

                }
            );


        } catch (error) {

            console.log(
                "Order Success Error:",
                error
            );


            return res.redirect(
                "/customer/orders"
            );

        }

    }

}


module.exports =
    new CustomerCheckoutController();