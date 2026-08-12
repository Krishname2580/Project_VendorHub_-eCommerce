const Message = require("../../models/Message");
const Vendor = require("../../models/Vendor");

class MessageController {

    // =========================================
    // VENDOR MESSAGE LIST
    // =========================================

    async list(req, res) {

        try {

            // =========================================
            // CHECK LOGIN
            // =========================================

            if (!req.user || !req.user._id) {

                return res.redirect("/auth/login");

            }


            // =========================================
            // GET VENDOR
            // =========================================

            const vendor = await Vendor.findOne({

                user: req.user._id

            }).populate("user");


            if (!vendor) {

                return res.redirect("/vendor/dashboard");

            }


            // =========================================
            // GET ALL MESSAGES
            // =========================================

            const messages = await Message.find({

                receiver: req.user._id

            })
                .populate("sender")
                .sort({

                    createdAt: -1

                })
                .lean();


            // =========================================
            // UNREAD MESSAGE COUNT
            // =========================================

            const unreadMessageCount = await Message.countDocuments({

                receiver: req.user._id,

                isRead: false

            });


            // =========================================
            // RENDER
            // =========================================

            return res.render("vendor/message/list", {

                title: "Messages",

                vendor,

                messages,

                unreadMessageCount

            });


        } catch (error) {

            console.log(
                "VENDOR MESSAGE LIST ERROR:",
                error
            );

            return res.redirect("/vendor/dashboard");

        }

    }


    // =========================================
    // MESSAGE DETAILS
    // =========================================

    async details(req, res) {

        try {

            if (!req.user || !req.user._id) {

                return res.redirect("/auth/login");

            }


            const vendor = await Vendor.findOne({

                user: req.user._id

            }).populate("user");


            if (!vendor) {

                return res.redirect("/vendor/dashboard");

            }


            // =========================================
            // FIND MESSAGE
            // =========================================

            const message = await Message.findOne({

                _id: req.params.id,

                receiver: req.user._id

            })
                .populate("sender")
                .populate("receiver");


            if (!message) {

                return res.redirect("/vendor/message/list");

            }


            // =========================================
            // MARK THIS MESSAGE AS READ
            // =========================================

            if (!message.isRead) {

                message.isRead = true;

                await message.save();

            }


            // =========================================
            // RENDER DETAILS
            // =========================================

            return res.render("vendor/message/details", {

                title: "Message Details",

                vendor,

                message

            });


        } catch (error) {

            console.log(
                "VENDOR MESSAGE DETAILS ERROR:",
                error
            );

            return res.redirect("/vendor/message/list");

        }

    }


    // =========================================
    // MARK MESSAGE AS READ
    // =========================================

    async markRead(req, res) {

        try {

            if (!req.user || !req.user._id) {

                return res.redirect("/auth/login");

            }


            await Message.findOneAndUpdate(

                {

                    _id: req.params.id,

                    receiver: req.user._id

                },

                {

                    isRead: true

                }

            );


            return res.redirect("/vendor/message/list");


        } catch (error) {

            console.log(
                "MARK MESSAGE READ ERROR:",
                error
            );

            return res.redirect("/vendor/message/list");

        }

    }


    // =========================================
    // MARK ALL MESSAGES AS READ
    // =========================================

    async markAllRead(req, res) {

        try {

            if (!req.user || !req.user._id) {

                return res.redirect("/auth/login");

            }


            await Message.updateMany(

                {

                    receiver: req.user._id,

                    isRead: false

                },

                {

                    $set: {

                        isRead: true

                    }

                }

            );


            return res.redirect("/vendor/message/list");


        } catch (error) {

            console.log(
                "MARK ALL MESSAGE READ ERROR:",
                error
            );

            return res.redirect("/vendor/message/list");

        }

    }


    // =========================================
    // DELETE MESSAGE
    // =========================================

    async delete(req, res) {

        try {

            if (!req.user || !req.user._id) {

                return res.redirect("/auth/login");

            }


            await Message.findOneAndDelete({

                _id: req.params.id,

                receiver: req.user._id

            });


            return res.redirect("/vendor/message/list");


        } catch (error) {

            console.log(
                "DELETE MESSAGE ERROR:",
                error
            );

            return res.redirect("/vendor/message/list");

        }

    }

}

module.exports = new MessageController();