const Payment = require("../../models/Payment");

class PaymentController {

    // ================= Payment List =================

    async paymentList(req, res) {

        try {

            const payments = await Payment.find()
                .populate("order")
                .populate("customer")
                .sort({ createdAt: -1 });

            return res.render("admin/payment/list", {

                title: "Payment List",

                admin: req.session.admin,

                payments

            });

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Payment Details =================

    async paymentDetails(req, res) {

        try {

            const payment = await Payment.findById(req.params.id)
                .populate("order")
                .populate("customer");

            if (!payment) {

                return res.redirect("/admin/payment/list");

            }

            return res.render("admin/payment/details", {

                title: "Payment Details",

                admin: req.session.admin,

                payment

            });

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Verify Payment =================

    async verifyPayment(req, res) {

        try {

            await Payment.findByIdAndUpdate(

                req.params.id,

                {

                    paymentStatus: "Paid"

                }

            );

            return res.redirect("/admin/payment/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Mark Failed =================

    async failedPayment(req, res) {

        try {

            await Payment.findByIdAndUpdate(

                req.params.id,

                {

                    paymentStatus: "Failed"

                }

            );

            return res.redirect("/admin/payment/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Refund Payment =================

    async refundPayment(req, res) {

        try {

            await Payment.findByIdAndUpdate(

                req.params.id,

                {

                    paymentStatus: "Refunded"

                }

            );

            return res.redirect("/admin/payment/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Delete Payment =================

    async deletePayment(req, res) {

        try {

            await Payment.findByIdAndDelete(req.params.id);

            return res.redirect("/admin/payment/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

}

module.exports = new PaymentController();