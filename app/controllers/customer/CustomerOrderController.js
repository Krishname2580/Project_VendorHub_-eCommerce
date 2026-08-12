const Order = require("../../models/Order");

class CustomerOrderController {

    // ==============================
    // MY ORDERS
    // ==============================
    async myOrders(req, res) {

        try {

            const customer = req.session.customer;

            // Check login
            if (!customer) {
                return res.redirect("/customer/login");
            }

            // Get customer's orders
            const orders = await Order.find({
                customer: customer._id
            })
                .populate("items.product")
                .sort({ createdAt: -1 });


            return res.render("customer/orders", {

                title: "My Orders",

                customer,

                orders

            });


        } catch (error) {

            console.log("MY ORDERS ERROR:", error);

            return res.redirect("/customer");

        }

    }


    // ==============================
    // ORDER DETAILS
    // ==============================
    async orderDetails(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }

            const order = await Order.findOne({

                _id: req.params.id,

                customer: customer._id

            })
                .populate("items.product");


            if (!order) {

                return res.redirect("/customer/orders");

            }


            return res.render("customer/order-details", {

                title: "Order Details",

                customer,

                order

            });


        } catch (error) {

            console.log("ORDER DETAILS ERROR:", error);

            return res.redirect("/customer/orders");

        }

    }


    // ==============================
    // CANCEL ORDER
    // ==============================
    async cancelOrder(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }


            const order = await Order.findOne({

                _id: req.params.id,

                customer: customer._id

            });


            if (!order) {

                return res.redirect("/customer/orders");

            }


            // Only pending/confirmed orders can be cancelled
            if (
                order.orderStatus !== "Pending" &&
                order.orderStatus !== "Confirmed"
            ) {

                return res.redirect("/customer/orders");

            }


            order.orderStatus = "Cancelled";

            await order.save();


            return res.redirect("/customer/orders");


        } catch (error) {

            console.log("CANCEL ORDER ERROR:", error);

            return res.redirect("/customer/orders");

        }

    }

}


module.exports = new CustomerOrderController();