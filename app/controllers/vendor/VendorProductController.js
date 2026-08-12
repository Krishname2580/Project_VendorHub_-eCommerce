const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const Vendor = require("../../models/Vendor");
const Store = require("../../models/Store");
const Notification = require("../../models/Notification");

const slugify = require("slugify");

class VendorProductController {

    // ==========================
    // Add Product Page
    // ==========================

    async addProductPage(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            if (!vendor) {

                return res.redirect("/vendor/dashboard");

            }

            const store = await Store.findOne({
                vendor: vendor._id
            });

            if (!store) {

                return res.redirect("/vendor/store/add");

            }

            const categories = await Category.find({
                status: true
            }).sort({
                name: 1
            });

            const brands = await Brand.find({
                status: true
            }).sort({
                name: 1
            });

            return res.render("vendor/product/add", {

                title: "Add Product",

                vendor,

                store,

                categories,

                brands

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ==========================
    // Create Product
    // ==========================

    async createProduct(req, res) {

        try {

            const vendor = await Vendor.findOne({

                user: req.user._id

            });

            if (!vendor) {

                return res.redirect("/vendor/dashboard");

            }

            const store = await Store.findOne({

                vendor: vendor._id

            });

            if (!store) {

                return res.redirect("/vendor/store/add");

            }

            const {

                name,

                description,

                category,

                brand,

                price,

                discountPrice,

                stock,

                weight,

                length,

                width,

                height

            } = req.body;

            // Thumbnail

            let thumbnail = "";

            if (req.files && req.files.thumbnail) {

                thumbnail = req.files.thumbnail[0].path;

            }

            // Product Images

            let images = [];

            if (req.files && req.files.images) {

                images = req.files.images.map(file => ({

                    imageUrl: file.path,

                    imageId: file.filename

                }));

            }

            // Generate Slug

            const slug = slugify(name, {

                lower: true,

                strict: true

            });

            let brandId = req.body.brand;

            if (req.body.brand === "Other") {

                let customBrandName = req.body.otherBrand;

                // Handle multipart/form-data safely
                if (Array.isArray(customBrandName)) {
                    customBrandName = customBrandName[0];
                }

                customBrandName = String(customBrandName || "").trim();

                if (!customBrandName) {
                    return res.status(400).json({
                        success: false,
                        message: "Please enter a custom brand name."
                    });
                }

                // Create slug
                const slug = customBrandName
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                // Check existing brand
                let customBrand = await Brand.findOne({
                    $or: [
                        {
                            name: {
                                $regex: `^${customBrandName}$`,
                                $options: "i"
                            }
                        },
                        {
                            slug: slug
                        }
                    ]
                });

                // Create brand if it doesn't exist
                if (!customBrand) {

                    customBrand = await Brand.create({
                        name: customBrandName,
                        slug: slug,
                        description: "Brand added by vendor",
                        status: true
                    });
                }

                // Product.brand must receive ObjectId
                brandId = customBrand._id;
            }

            // Generate SKU

            const sku = "SKU-" + Date.now();

           const product = await Product.create({

                vendor: vendor._id,

                store: store._id,

                category,

                brand: brandId,

                name,

                slug,

                description,

                price,

                discountPrice,

                sku,

                stock,

                thumbnail,

                images,

                weight,

                dimensions: {

                    length,

                    width,

                    height

                },

                status: "Pending"

            });
            await Notification.create({
                title: "New Product Added",

                message: `Vendor added a new product: ${product.name}`,

                type: "product",

                vendor: req.user._id,

                isRead: false
            });

            return res.redirect("/vendor/product/list");

        } catch (error) {

            console.log(error);

        }

    }
    // ==========================
    // Product List
    // ==========================

    async productList(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const page = parseInt(req.query.page) || 1;

            const limit = 10;

            const skip = (page - 1) * limit;

            const search = req.query.search || "";

            const query = {

                vendor: vendor._id,

                name: {
                    $regex: search,
                    $options: "i"
                }

            };

            const totalProducts = await Product.countDocuments(query);

            const products = await Product.find(query)

                .populate("category")

                .populate("brand")

                .populate("store")

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limit);

            return res.render("vendor/product/list", {

                title: "Product List",

                vendor,

                products,

                search,

                currentPage: page,

                totalPages: Math.ceil(totalProducts / limit)

            });

        } catch (error) {

            console.log(error);

        }

    }


    // ==========================
    // Pending Products
    // ==========================

    async pendingProducts(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const products = await Product.find({

                vendor: vendor._id,

                status: "Pending"

            })

                .populate("category")

                .populate("brand")

                .sort({
                    createdAt: -1
                });

            return res.render("vendor/product/pending", {

                title: "Pending Products",

                vendor,

                products

            });

        } catch (error) {

            console.log(error);

        }

    }


    // ==========================
    // Approved Products
    // ==========================

    async approvedProducts(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const products = await Product.find({

                vendor: vendor._id,

                status: "Approved"

            })

                .populate("category")

                .populate("brand")

                .sort({
                    createdAt: -1
                });

            return res.render("vendor/product/approved", {

                title: "Approved Products",

                vendor,

                products

            });

        } catch (error) {

            console.log(error);

        }

    }


    // ==========================
    // Rejected Products
    // ==========================

    async rejectedProducts(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const products = await Product.find({

                vendor: vendor._id,

                status: "Rejected"

            })

                .populate("category")

                .populate("brand")

                .sort({
                    createdAt: -1
                });

            return res.render("vendor/product/rejected", {

                title: "Rejected Products",

                vendor,

                products

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ==========================
    // Product Details
    // ==========================

    async productDetails(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const product = await Product.findOne({

                _id: req.params.id,

                vendor: vendor._id

            })

                .populate("category")

                .populate("brand")

                .populate("store");

            if (!product) {

                return res.redirect("/vendor/product/list");

            }

            return res.render("vendor/product/details", {

                title: "Product Details",

                vendor,

                product

            });

        } catch (error) {

            console.log(error);

        }

    }


    // ==========================
    // Edit Product Page
    // ==========================

    async editProductPage(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const product = await Product.findOne({

                _id: req.params.id,

                vendor: vendor._id

            });

            if (!product) {

                return res.redirect("/vendor/product/list");

            }

            const categories = await Category.find({

                status: true

            });

            const brands = await Brand.find({

                status: true

            });

            return res.render("vendor/product/edit", {

                title: "Edit Product",

                vendor,

                product,

                categories,

                brands

            });

        } catch (error) {

            console.log(error);

        }

    }


    // ==========================
    // Update Product
    // ==========================

    async updateProduct(req, res) {

        try {

            const vendor = await Vendor.findOne({

                user: req.user._id

            });

            const product = await Product.findOne({

                _id: req.params.id,

                vendor: vendor._id

            });

            if (!product) {

                return res.redirect("/vendor/product/list");

            }

            product.name = req.body.name;

            product.slug = slugify(req.body.name, {

                lower: true,

                strict: true

            });

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

            // Thumbnail

            if (req.files && req.files.thumbnail) {

                product.thumbnail = req.files.thumbnail[0].path;

            }

            // Product Images

            if (req.files && req.files.images) {

                product.images = req.files.images.map(file => ({

                    imageUrl: file.path,

                    imageId: file.filename

                }));

            }

            // Send for re-approval after edit

            product.status = "Pending";

            await product.save();

            await Notification.create({
                title: "Product Updated",

                message: `Vendor updated product: ${product.name}`,

                type: "product",

                vendor: req.user._id,

                isRead: false
            });
            return res.redirect("/vendor/product/list");

        } catch (error) {

            console.log(error);

        }

    }


    // ==========================
    // Delete Product
    // ==========================

    async deleteProduct(req, res) {

        try {

            const vendor = await Vendor.findOne({

                user: req.user._id

            });

            await Product.findOneAndDelete({

                _id: req.params.id,

                vendor: vendor._id

            });

            return res.redirect("/vendor/product/list");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new VendorProductController();