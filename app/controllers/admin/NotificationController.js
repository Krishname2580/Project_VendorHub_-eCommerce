const Notification = require("../../models/Notification");
const Vendor = require("../../models/Vendor");

class NotificationController {

    // ================= LIST =================

    async list(req, res) {

        try {

            const notifications = await Notification.find()
                .populate("vendor", "storeName name email")
                .sort({ createdAt: -1 });

            return res.render(
                "admin/notification/list",
                {
                    title: "Notification List",
                    admin: req.user,
                    notifications
                }
            );

        } catch (error) {

            console.log("NOTIFICATION LIST ERROR:", error);

            return res.redirect("/admin/dashboard");

        }

    }


    // ================= EDIT PAGE =================

    async edit(req, res) {

        try {

            console.log(
                "EDIT NOTIFICATION ID:",
                req.params.id
            );

            const notification =
                await Notification.findById(req.params.id);

            console.log(
                "NOTIFICATION:",
                notification
            );

            if (!notification) {

                console.log(
                    "Notification not found"
                );

                return res.redirect(
                    "/admin/notification/list"
                );

            }


            const vendors =
                await Vendor.find()
                    .select("storeName name email");


            console.log(
                "VENDORS:",
                vendors.length
            );


            return res.render(
                "admin/notification/edit",
                {
                    title: "Edit Notification",

                    admin: req.user,

                    notification,

                    vendors
                }
            );


        } catch (error) {

            console.log(
                "========== EDIT NOTIFICATION ERROR =========="
            );

            console.log(error);

            return res.redirect(
                "/admin/notification/list"
            );

        }

    }


    // ================= UPDATE =================

    async update(req, res) {

        try {

            console.log(
                "UPDATE NOTIFICATION:",
                req.params.id
            );

            const notification =
                await Notification.findById(
                    req.params.id
                );

            if (!notification) {

                return res.redirect(
                    "/admin/notification/list"
                );

            }


            notification.title =
                req.body.title;

            notification.message =
                req.body.message;

            notification.type =
                req.body.type;


            notification.vendor =
                req.body.vendor || null;


            notification.isRead =
                req.body.isRead === "true";


            await notification.save();


            return res.redirect(
                "/admin/notification/list"
            );


        } catch (error) {

            console.log(
                "UPDATE NOTIFICATION ERROR:",
                error
            );

            return res.redirect(
                "/admin/notification/list"
            );

        }

    }


    // ================= DELETE =================

    async delete(req, res) {

        try {

            await Notification.findByIdAndDelete(
                req.params.id
            );

            return res.redirect(
                "/admin/notification/list"
            );

        } catch (error) {

            console.log(
                "DELETE NOTIFICATION ERROR:",
                error
            );

            return res.redirect(
                "/admin/notification/list"
            );

        }

    }


    // ================= MARK READ =================

    async markAsRead(req, res) {

        try {

            await Notification.findByIdAndUpdate(
                req.params.id,
                {
                    isRead: true
                }
            );

            return res.redirect(
                "/admin/notification/list"
            );

        } catch (error) {

            console.log(
                "MARK READ ERROR:",
                error
            );

            return res.redirect(
                "/admin/notification/list"
            );

        }

    }


    // ================= MARK ALL READ =================

    async markAllRead(req, res) {

        try {

            await Notification.updateMany(
                {
                    isRead: false
                },
                {
                    $set: {
                        isRead: true
                    }
                }
            );

            return res.json({
                success: true
            });

        } catch (error) {

            console.log(
                "MARK ALL READ ERROR:",
                error
            );

            return res.status(500).json({
                success: false
            });

        }

    }

}


module.exports = new NotificationController();