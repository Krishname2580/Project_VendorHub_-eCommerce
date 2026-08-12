const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

class ProductController {

    // All Products
    async list(req, res) {
        try {

            const products = await Product.find()
                .populate("vendor")
                .populate("store")
                .populate("category")
                .populate("brand")
                .sort({ createdAt: -1 });

            res.render("admin/product/list", {
                admin: req.user,
                products
            });

        } catch (err) {
            console.log(err);
            res.redirect("/admin/dashboard");
        }
    }

    // Pending Products
    async pending(req, res) {
        try {

            const products = await Product.find({
                status: "Pending"
            })
                .populate("vendor")
                .populate("store")
                .populate("category")
                .populate("brand")
                .sort({ createdAt: -1 });

            res.render("admin/product/pending", {
                admin: req.user,
                products
            });

        } catch (err) {
            console.log(err);
        }
    }

    // Approved Products
    async approved(req, res) {

        try {

            const products = await Product.find({
                status: "Approved"
            })
                .populate({
                    path: "vendor",
                    populate: {
                        path: "user",
                        select: "name email phone image"
                    }
                })
                .populate("store")
                .populate("category")
                .populate("brand")
                .sort({ createdAt: -1 });

            res.render("admin/product/approved", {
                admin: req.user,
                products
            });

        } catch (err) {
            console.log(err);
        }

    }

    // Rejected Products
    async rejected(req, res) {

        try {

            const products = await Product.find({
                status: "Rejected"
            })
                .populate("vendor")
                .populate("store")
                .populate("category")
                .populate("brand")
                .sort({ createdAt: -1 });

            res.render("admin/product/rejected", {
                admin: req.user,
                products
            });

        } catch (err) {
            console.log(err);
        }

    }

    // Approve
    async approve(req, res) {

        await Product.findByIdAndUpdate(req.params.id, {
            status: "Approved"
        });

        res.redirect("/admin/product/pending");

    }

    // Reject
    async reject(req, res) {

        await Product.findByIdAndUpdate(req.params.id, {
            status: "Rejected"
        });

        res.redirect("/admin/product/pending");

    }

    // Product Details

    async details(req, res) {

        try {

            const product = await Product.findById(req.params.id)

                .populate("vendor")

                .populate("store")

                .populate("category")

                .populate("brand");

            if (!product) {

                return res.redirect("/admin/product/list");

            }

            return res.render("admin/product/details", {

                admin: req.user,

                product

            });

        } catch (err) {

            console.log(err);

            return res.redirect("/admin/product/list");

        }

    }

    // Delete Product

    async delete(req, res) {

        try {

            await Product.findByIdAndDelete(req.params.id);

            return res.redirect("/admin/product/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/product/list");

        }

    }

    // Edit Product Page

    async editPage(req, res) {

        try {

            const product = await Product.findById(req.params.id)
                .populate("category")
                .populate("brand");

            if (!product) {

                return res.redirect("/admin/product/list");

            }

            const categories = await Category.find({
                status: true
            });

            const brands = await Brand.find({
                status: true
            });

            return res.render("admin/product/edit", {

                admin: req.user,

                title: "Edit Product",

                product,

                categories,

                brands

            });

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/product/list");

        }

    }



    // Update Product

    async update(req, res) {

        try {

            const product = await Product.findById(req.params.id);

            if (!product) {

                return res.redirect("/admin/product/list");

            }

            product.name = req.body.name;

            product.category = req.body.category;

            product.brand = req.body.brand;

            product.description = req.body.description;

            product.price = req.body.price;

            product.discountPrice = req.body.discountPrice;

            product.stock = req.body.stock;

            product.weight = req.body.weight;

            product.dimensions = {

                length: req.body.length,

                width: req.body.width,

                height: req.body.height

            };

            if (req.file) {

                product.thumbnail = req.file.path;

            }

            await product.save();

            return res.redirect("/admin/product/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/product/list");

        }

    }
    // Change Active / Inactive Status

    async changeStatus(req, res) {

        try {

            const product = await Product.findById(req.params.id);

            if (!product) {

                return res.redirect("/admin/product/list");

            }

            product.isActive = !product.isActive;

            await product.save();

            return res.redirect("/admin/product/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/product/list");

        }

    }


    async toggleBestSeller(req, res) {

        try {

            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.redirect("/admin/product/list");
            }

            product.isBestSeller = !product.isBestSeller;

            await product.save();

            return res.redirect("back");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/product/list");

        }

    }

    // Toggle Featured flag (same gap existed for isFeatured)

    async toggleFeatured(req, res) {

        try {

            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.redirect("/admin/product/list");
            }

            product.isFeatured = !product.isFeatured;

            await product.save();

            return res.redirect("back");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/product/list");

        }

    }
}

module.exports = new ProductController();