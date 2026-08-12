const Coupon = require("../../models/Coupon");

class CouponController {

    // ================= Coupon List =================

    async couponList(req, res) {

        try {

            const coupons = await Coupon.find()
                .sort({ createdAt: -1 });

            return res.render("admin/coupon/list", {
                title: "Coupon List",
                admin: req.user,
                coupons
            });

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/dashboard");

        }

    }


    // ================= Add Coupon Page =================

    async addCoupon(req, res) {

        try {

            return res.render("admin/coupon/add", {
                title: "Add Coupon",
                admin: req.user
            });

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/coupon/list");

        }

    }


    // ================= Create Coupon =================

    async createCoupon(req, res) {

        try {

            const {
                title,
                code,
                description,
                discountType,
                discountValue,
                minimumPurchase,
                maximumDiscount,
                expiryDate,
                usageLimit
            } = req.body;
            
            await Coupon.create({

                title,

                code,

                description,

                discountType,

                discountValue,

                minimumPurchase,

                maximumDiscount,

                expiryDate,

                usageLimit,

                createdBy: req.user._id

            });

            return res.redirect("/admin/coupon/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/coupon/add");

        }

    }


    // ================= Edit Coupon =================

    async editCoupon(req, res) {

        try {

            const coupon = await Coupon.findById(req.params.id);

            if (!coupon) {

                return res.redirect("/admin/coupon/list");

            }

            return res.render("admin/coupon/edit", {

                title: "Edit Coupon",

                admin: req.user,

                coupon

            });

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/coupon/list");

        }

    }


    // ================= Update Coupon =================

    async updateCoupon(req, res) {

        try {

            const {
                title,
                code,
                description,
                discountType,
                discountValue,
                minimumPurchase,
                maximumDiscount,
                expiryDate,
                usageLimit
            } = req.body;

            await Coupon.findByIdAndUpdate(

                req.params.id,

                {

                    title,

                    code,

                    description,

                    discountType,

                    discountValue,

                    minimumPurchase,

                    maximumDiscount,

                    expiryDate,

                    usageLimit

                }

            );

            return res.redirect("/admin/coupon/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/coupon/list");

        }

    }


    // ================= Change Status =================

    async changeStatus(req, res) {

        try {

            const coupon = await Coupon.findById(req.params.id);

            if (!coupon) {

                return res.redirect("/admin/coupon/list");

            }

            coupon.status = !coupon.status;

            await coupon.save();

            return res.redirect("/admin/coupon/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/coupon/list");

        }

    }


    // ================= Delete Coupon =================

    async deleteCoupon(req, res) {

        try {

            await Coupon.findByIdAndDelete(req.params.id);

            return res.redirect("/admin/coupon/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/coupon/list");

        }

    }

}

module.exports = new CouponController();