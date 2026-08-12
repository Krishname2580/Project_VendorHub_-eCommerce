const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

class CustomerProductController {

    // ===============================
    // Product List
    // ===============================

    async list(req, res) {

        try {

            const category = req.query.category || "";

            const brand = req.query.brand || "";

            const search = req.query.search || "";

            let filter = {

                status: "Approved"

            };

            if (category) {

                filter.category = category;

            }

            if (brand) {

                filter.brand = brand;

            }

            if (search) {

                filter.name = {

                    $regex: search,

                    $options: "i"

                };

            }

            const products = await Product.find(filter)

                .populate("category")

                .populate("brand")

                .sort({

                    createdAt: -1

                });

            const categories = await Category.find({

                status: true

            });

            const brands = await Brand.find({

                status: true

            });

            return res.render("customer/product/list", {

                title: "Products",

                customer: req.session.customer || null,

                products,

                categories,

                brands,

                category,

                brand,

                search

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ===============================
    // Product Details
    // ===============================

    async details(req, res) {

        try {

            const product = await Product.findById(req.params.id)

                .populate("category")

                .populate("brand")

                .populate({

                    path: "vendor",

                    populate: {

                        path: "user"

                    }

                });

            if (!product) {

                return res.redirect("/customer/products");

            }

            const relatedProducts = await Product.find({

                category: product.category,

                _id: {

                    $ne: product._id

                },

                status: "Approved"

            }).limit(4);

            return res.render("customer/product/details", {

                title: product.name,

                customer: req.session.customer || null,

                product,

                relatedProducts

            });

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new CustomerProductController();