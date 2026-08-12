const Order = require("../../models/Order");

class OrderController {

    // ================= Order List =================

    async orderList(req, res) {

    try {

        const orders = await Order.find()
            .populate("customer")
            .populate("address")
            .sort({ createdAt: -1 });

        console.log("ORDERS:", orders);

        return res.render("admin/order/list", {

            title: "Order List",

            admin: req.user,

            orders

        });

    } catch (error) {

        console.log("ORDER LIST ERROR:", error);

        return res.redirect("/admin/dashboard");

    }

}


    // ================= Order Details =================

   async orderDetails(req, res) {

    try {

        const order = await Order.findById(req.params.id)
            .populate("customer")
            .populate("address")
            .populate("items.product");

        if (!order) {
            return res.redirect("/admin/order/list");
        }


        return res.render("admin/order/details", {

            title: "Order Details",

            admin: req.user,

            order,

            orderItems: order.items || []

        });

    } catch (error) {

        console.log("ORDER DETAILS ERROR:", error);

        return res.redirect("/admin/dashboard");

    }

}

    // ================= Confirm Order =================

    async confirmOrder(req, res) {

        try {

            await Order.findByIdAndUpdate(

                req.params.id,

                {

                    orderStatus: "Confirmed"

                }

            );

            return res.redirect("/admin/order/list");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Pack Order =================

    async packOrder(req, res) {

        try {

            await Order.findByIdAndUpdate(

                req.params.id,

                {

                    orderStatus: "Packed"

                }

            );

            return res.redirect("/admin/order/list");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Ship Order =================

    async shipOrder(req, res) {

        try {

            await Order.findByIdAndUpdate(

                req.params.id,

                {

                    orderStatus: "Shipped"

                }

            );

            return res.redirect("/admin/order/list");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Deliver Order =================

    async deliverOrder(req, res) {

        try {

            await Order.findByIdAndUpdate(

                req.params.id,

                {

                    orderStatus: "Delivered",

                    paymentStatus: "Paid"

                }

            );

            return res.redirect("/admin/order/list");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Cancel Order =================

    async cancelOrder(req, res) {

        try {

            await Order.findByIdAndUpdate(

                req.params.id,

                {

                    orderStatus: "Cancelled"

                }

            );

            return res.redirect("/admin/order/list");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Return Order =================

    async returnOrder(req, res) {

        try {

            await Order.findByIdAndUpdate(

                req.params.id,

                {

                    orderStatus: "Returned"

                }

            );

            return res.redirect("/admin/order/list");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Delete Order =================

    async deleteOrder(req, res) {

        try {

            await Order.findByIdAndDelete(req.params.id);

            return res.redirect("/admin/order/list");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new OrderController();