const Offer = require("../../models/Offer");
const Product = require("../../models/Product");
const Category = require("../../models/Category");

class OfferController {

    // ================= Offer List =================

    async list(req, res) {

        try {

            const offers = await Offer.find()
                .populate("product")
                .populate("category")
                .sort({ createdAt: -1 });

            return res.render("admin/offer/list", {

                title: "Offer List",

                admin: req.session.admin,

                offers

            });

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Add Offer Page =================

    async addPage(req, res) {

        try {

            const products = await Product.find({
                status: "Approved"
            });

            const categories = await Category.find({
                status: true
            });

            return res.render("admin/offer/add", {

                title: "Add Offer",

                admin: req.session.admin,

                products,

                categories

            });

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Create Offer =================

    async createOffer(req, res) {

        try {

            const {

                title,
                description,
                discountPercentage,
                startDate,
                endDate,
                product,
                category,
                status

            } = req.body;

            await Offer.create({

                title,

                description,

                discountPercentage,

                startDate,

                endDate,

                product: product || null,

                category: category || null,

                status

            });

            return res.redirect("/admin/offer/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Offer Details =================

    async details(req, res) {

        try {

            const offer = await Offer.findById(req.params.id)
                .populate("product")
                .populate("category");

            return res.render("admin/offer/details", {

                title: "Offer Details",

                admin: req.session.admin,

                offer

            });

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Edit Page =================

    async editPage(req, res) {

        try {

            const offer = await Offer.findById(req.params.id);

            const products = await Product.find({
                status: "Approved"
            });

            const categories = await Category.find({
                status: true
            });

            return res.render("admin/offer/edit", {

                title: "Edit Offer",

                admin: req.session.admin,

                offer,

                products,

                categories

            });

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Update Offer =================

    async updateOffer(req, res) {

        try {

            const {

                title,
                description,
                discountPercentage,
                startDate,
                endDate,
                product,
                category,
                status

            } = req.body;

            await Offer.findByIdAndUpdate(

                req.params.id,

                {

                    title,

                    description,

                    discountPercentage,

                    startDate,

                    endDate,

                    product,

                    category,

                    status

                }

            );

            return res.redirect("/admin/offer/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Change Status =================

    async changeStatus(req, res) {

        try {

            const offer = await Offer.findById(req.params.id);

            if (!offer) {

                return res.redirect("back");

            }

            offer.status = !offer.status;

            await offer.save();

            return res.redirect("/admin/offer/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

    // ================= Delete Offer =================

    async deleteOffer(req, res) {

        try {

            await Offer.findByIdAndDelete(req.params.id);

            return res.redirect("/admin/offer/list");

        } catch (error) {

            console.log(error);

            return res.redirect("back");

        }

    }

}

module.exports = new OfferController();