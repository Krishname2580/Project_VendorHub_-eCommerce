const Notification = require("../../models/Notification");
const Vendor = require("../../models/Vendor");
const Order = require("../../models/Order");

class VendorNotificationController {

    // =====================================================
    // ALL NOTIFICATIONS
    // =====================================================

    async list(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            if (!vendor) {

                return res.redirect("/vendor/dashboard");

            }

            const notifications = await Notification.find({

                user: req.user._id,

                status: true

            })
                .sort({
                    createdAt: -1
                });

            return res.render(
                "vendor/notification/list",
                {
                    vendor,
                    notifications
                }
            );

        } catch (error) {

            console.log(
                "VENDOR NOTIFICATION LIST ERROR:",
                error
            );

            return res.redirect(
                "/vendor/dashboard"
            );

        }

    }


    // =====================================================
    // NOTIFICATION DETAILS
    // =====================================================

    async details(req, res) {

        try {

            const vendor = await Vendor.findOne({

                user: req.user._id

            }).populate("user");


            const notification =
                await Notification.findOne({

                    _id: req.params.id,

                    user: req.user._id,

                    status: true

                });


            if (!notification) {

                return res.redirect(
                    "/vendor/notification/list"
                );

            }


            // Mark as read

            notification.isRead = true;

            await notification.save();


            return res.render(
                "vendor/notification/details",
                {
                    vendor,
                    notification
                }
            );

        } catch (error) {

            console.log(
                "VENDOR NOTIFICATION DETAILS ERROR:",
                error
            );

            return res.redirect(
                "/vendor/notification/list"
            );

        }

    }


    // =====================================================
    // MARK SINGLE NOTIFICATION AS READ
    // =====================================================

    async markRead(req, res) {

        try {

            await Notification.findOneAndUpdate(

                {
                    _id: req.params.id,

                    user: req.user._id
                },

                {
                    isRead: true
                }

            );


            return res.redirect(
                "/vendor/notification/list"
            );

        } catch (error) {

            console.log(
                "MARK NOTIFICATION READ ERROR:",
                error
            );

            return res.redirect(
                "/vendor/notification/list"
            );

        }

    }


    // =====================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================================

    async markAllRead(req, res) {

        try {

            await Notification.updateMany(

                {
                    user: req.user._id,

                    isRead: false,

                    status: true
                },

                {
                    $set: {
                        isRead: true
                    }
                }

            );


            return res.redirect(
                "/vendor/notification/list"
            );

        } catch (error) {

            console.log(
                "MARK ALL NOTIFICATION ERROR:",
                error
            );

            return res.redirect(
                "/vendor/notification/list"
            );

        }

    }


    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    async delete(req, res) {

        try {

            await Notification.findOneAndDelete({

                _id: req.params.id,

                user: req.user._id

            });


            return res.redirect(
                "/vendor/notification/list"
            );

        } catch (error) {

            console.log(
                "DELETE NOTIFICATION ERROR:",
                error
            );

            return res.redirect(
                "/vendor/notification/list"
            );

        }

    }


    // =====================================================
    // CREATE ORDER RECEIVED NOTIFICATION
    // =====================================================

    async createOrderNotification(order) {

        try {

            if (!order || !order.items) {

                return;

            }


            // Find every vendor involved in this order

            const vendorIds = [];


            order.items.forEach(item => {

                if (item.vendor) {

                    const vendorId =
                        item.vendor.toString();

                    if (!vendorIds.includes(vendorId)) {

                        vendorIds.push(vendorId);

                    }

                }

            });


            // Create notification for each vendor

            for (const vendorId of vendorIds) {

                const vendor =
                    await Vendor.findById(vendorId)
                        .populate("user");


                if (!vendor || !vendor.user) {

                    continue;

                }


                await Notification.create({

                    title: "New Order Received",

                    message:
                        `You have received a new order${order.orderNumber ? ` #${order.orderNumber}` : ""}. Please check your order section.`,

                    type: "order",

                    user: vendor.user._id,

                    vendor: vendor._id,

                    isRead: false,

                    status: true

                });

            }


            console.log(
                "ORDER NOTIFICATION CREATED"
            );

        } catch (error) {

            console.log(
                "CREATE ORDER NOTIFICATION ERROR:",
                error
            );

        }

    }


    // =====================================================
    // CREATE ORDER STATUS NOTIFICATION
    // =====================================================

    async createOrderStatusNotification(
        order,
        status
    ) {

        try {

            if (!order || !order.items) {

                return;

            }


            // Only notify vendors for these statuses

            const notificationStatuses = [
                "Cancelled",
                "Returned"
            ];


            if (
                !notificationStatuses.includes(status)
            ) {

                return;

            }


            const vendorIds = [];


            order.items.forEach(item => {

                if (item.vendor) {

                    const vendorId =
                        item.vendor.toString();

                    if (!vendorIds.includes(vendorId)) {

                        vendorIds.push(vendorId);

                    }

                }

            });


            for (const vendorId of vendorIds) {

                const vendor =
                    await Vendor.findById(vendorId)
                        .populate("user");


                if (!vendor || !vendor.user) {

                    continue;

                }


                let title = "";

                let message = "";


                if (status === "Cancelled") {

                    title = "Order Cancelled";

                    message =
                        `Order${order.orderNumber ? ` #${order.orderNumber}` : ""} has been cancelled.`;

                }


                if (status === "Returned") {

                    title = "Order Returned";

                    message =
                        `Order${order.orderNumber ? ` #${order.orderNumber}` : ""} has been returned.`;

                }


                await Notification.create({

                    title,

                    message,

                    type: "order",

                    user: vendor.user._id,

                    vendor: vendor._id,

                    isRead: false,

                    status: true

                });

            }


            console.log(
                `${status} ORDER NOTIFICATION CREATED`
            );

        } catch (error) {

            console.log(
                "CREATE ORDER STATUS NOTIFICATION ERROR:",
                error
            );

        }

    }

}


module.exports =
    new VendorNotificationController();