const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
const Store = require("../../models/Store");

class CustomerHomeController {

    // ===============================
    // Customer Home
    // ===============================

    async home(req, res) {

        try {

            // Categories
            const categories = await Category.find({
                status: true
            }).sort({ createdAt: -1 });

            // Brands
            const brands = await Brand.find({
                status: true
            }).sort({ createdAt: -1 });

            // Featured Products
            const featuredProducts = await Product.find({

                status: "Approved",

                isFeatured: true

            })
                .populate("category")
                .populate("brand")
                .limit(8);

            // New Arrivals
            const newArrivals = await Product.find({

                status: "Approved"

            })
                .populate("category")
                .populate("brand")
                .sort({ createdAt: -1 })
                .limit(8);

            // Best Sellers
            const bestSellers = await Product.find({

                status: "Approved",

                isBestSeller: true

            })
                .populate("category")
                .populate("brand")
                .limit(8);

            // Top Vendors / Stores
            const stores = await Store.find({

                approvalStatus: "Approved",

                isActive: true

            })
                .populate({

                    path: "vendor",

                    populate: {

                        path: "user"

                    }

                })
                .limit(8);

            // Latest Products
            const latestProducts = await Product.find({

                status: "Approved"

            })
                .populate("category")
                .populate("brand")
                .sort({ createdAt: -1 })
                .limit(12);
console.log(req.session.customer);
            return res.render("customer/home/index", {

                title: "VendorHub",

                customer: req.session.customer || null,

                categories,

                brands,

                featuredProducts,

                newArrivals,

                bestSellers,

                latestProducts,

                stores

            });

        } catch (error) {

            console.log(error);

            return res.redirect("/");

        }

    }

}

module.exports = new CustomerHomeController();