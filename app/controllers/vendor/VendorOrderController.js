const Order = require("../../models/Order");

class VendorOrderController {

    // ==========================================
    // VENDOR ORDERS
    // ==========================================

    async orders(req, res) {

        try {

            const vendor = req.vendor;

            if (!vendor) {
                return res.redirect("/auth/login");
            }

            console.log("================================");
            console.log("USER:", req.user._id);
            console.log("VENDOR:", vendor._id);
            console.log("================================");


            const orders = await Order.find({

                "items.vendor": vendor._id

            })
                .populate("customer")
                .populate("items.product")
                .sort({ createdAt: -1 });


            console.log("TOTAL ORDERS:", orders.length);


            return res.render("vendor/orders", {

                title: "Vendor Orders",

                vendor,

                orders

            });

        } catch (error) {

            console.log(
                "VENDOR ORDERS ERROR:",
                error
            );

            return res.redirect("/vendor/dashboard");

        }

    }


    // ==========================================
    // ORDER DETAILS
    // ==========================================

    async orderDetails(req, res) {

        try {

            const vendor = req.vendor;

            if (!vendor) {
                return res.redirect("/auth/login");
            }


            const order = await Order.findOne({

                _id: req.params.id,

                "items.vendor": vendor._id

            })
                .populate("customer")
                .populate("items.product");


            if (!order) {

                return res.redirect("/vendor/orders");

            }


            const vendorItems = order.items.filter(item => {

                return (
                    item.vendor &&
                    item.vendor.toString() ===
                    vendor._id.toString()
                );

            });


            return res.render(
                "vendor/order-details",
                {

                    title: "Order Details",

                    vendor,

                    order,

                    vendorItems

                }
            );

        } catch (error) {

            console.log(
                "VENDOR ORDER DETAILS ERROR:",
                error
            );

            return res.redirect("/vendor/orders");

        }

    }


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    async updateStatus(req, res) {

        try {

            const vendor = req.vendor;

            if (!vendor) {
                return res.redirect("/auth/login");
            }


            const { status } = req.body;


            const allowedStatuses = [

                "Pending",
                "Confirmed",
                "Packed",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Returned"

            ];


            if (!allowedStatuses.includes(status)) {

                return res.redirect(
                    `/vendor/orders/${req.params.id}`
                );

            }


            const order = await Order.findOne({

                _id: req.params.id,

                "items.vendor": vendor._id

            });


            if (!order) {

                return res.redirect("/vendor/orders");

            }


            order.orderStatus = status;

            await order.save();


            return res.redirect(
                `/vendor/orders/${order._id}`
            );

        } catch (error) {

            console.log(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            return res.redirect("/vendor/orders");

        }

    }

}


module.exports = new VendorOrderController();