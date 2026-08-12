const Product = require("../../models/Product");
const Category = require("../../models/Category");

class ShopController {

    // ==========================================
    // SHOP PAGE
    // ==========================================

    async shop(req, res) {

        try {

            // ==========================================
            // QUERY PARAMETERS
            // ==========================================

            const category = req.query.category || "";
            const q = req.query.q || "";
            const sort = req.query.sort || "";
            const color = req.query.color || "";
            const maxPrice = req.query.maxPrice || "";

            // ==========================================
            // PAGINATION
            // ==========================================

            const limit = 9;

            let currentPage = parseInt(req.query.page);

            if (isNaN(currentPage) || currentPage < 1) {
                currentPage = 1;
            }

            const skip = (currentPage - 1) * limit;

            // ==========================================
            // BASE FILTER
            // ==========================================

            const filter = {
                status: "Approved"
            };

            // ==========================================
            // CATEGORY FILTER
            // ==========================================

            if (category && category.trim() !== "") {

                filter.category = category.trim();

            }

            // ==========================================
            // SEARCH FILTER
            // ==========================================

            if (q && q.trim() !== "") {

                const searchText = q.trim();

                filter.$or = [

                    {
                        name: {
                            $regex: searchText,
                            $options: "i"
                        }
                    },

                    {
                        description: {
                            $regex: searchText,
                            $options: "i"
                        }
                    }

                ];

            }

            // ==========================================
            // PRICE FILTER
            // ==========================================

            if (maxPrice && !isNaN(Number(maxPrice))) {

                const price = Number(maxPrice);

                if (price >= 0) {

                    filter.price = {
                        $lte: price
                    };

                }

            }

            // ==========================================
            // COLOR FILTER
            // ==========================================

            if (color && color.trim() !== "") {

                filter.color = {
                    $regex: `^${color.trim()}$`,
                    $options: "i"
                };

            }

            // ==========================================
            // SORT
            // ==========================================

            let sortOption = {
                createdAt: -1
            };

            if (sort === "price-low") {

                sortOption = {
                    price: 1
                };

            } else if (sort === "price-high") {

                sortOption = {
                    price: -1
                };

            } else if (sort === "name") {

                sortOption = {
                    name: 1
                };

            }

            // ==========================================
            // DEBUG
            // ==========================================

            console.log("================ SHOP FILTER ================");

            console.log("Category:", category);
            console.log("Search:", q);
            console.log("Max Price:", maxPrice);
            console.log("Color:", color);
            console.log("Sort:", sort);
            console.log("Page:", currentPage);

            console.log("FINAL FILTER:", filter);

            // ==========================================
            // TOTAL PRODUCTS
            // IMPORTANT:
            // COUNT AFTER ALL FILTERS
            // ==========================================

            const totalProducts =
                await Product.countDocuments(filter);

            // ==========================================
            // TOTAL PAGES
            // ==========================================

            const totalPages =
                Math.ceil(totalProducts / limit);

            // ==========================================
            // IF PAGE IS GREATER THAN TOTAL PAGES
            // ==========================================

            if (totalPages > 0 && currentPage > totalPages) {

                currentPage = totalPages;

            }

            const finalSkip =
                (currentPage - 1) * limit;

            // ==========================================
            // GET PRODUCTS
            // ==========================================

            const products =
                await Product.find(filter)

                    .populate("category", "name slug")

                    .populate("brand", "name")

                    .sort(sortOption)

                    .skip(finalSkip)

                    .limit(limit)

                    .lean();

            // ==========================================
            // GET CATEGORIES
            // ==========================================

            const categories =
                await Category.find({
                    status: true
                })
                    .sort({
                        name: 1
                    })
                    .lean();

            // ==========================================
            // RENDER SHOP
            // ==========================================

            return res.render(
                "customer/shop",
                {

                    title: "Shop",

                    products,

                    categories,

                    // Current filters
                    activeCategory: category,

                    searchQuery: q,

                    maxPrice: maxPrice
                        ? Number(maxPrice)
                        : 50000,

                    color,

                    sort,

                    // Pagination
                    currentPage: "shop",

                    currentPageNumber: currentPage,

                    totalPages,

                    totalProducts,

                    // Items per page
                    limit

                }
            );

        } catch (error) {

            console.log(
                "================================"
            );

            console.log(
                "SHOP CONTROLLER ERROR:"
            );

            console.log(error);

            console.log(
                "================================"
            );

            // ==========================================
            // ERROR RESPONSE
            // ==========================================

            return res.render(
                "customer/shop",
                {

                    title: "Shop",

                    products: [],

                    categories: [],

                    activeCategory:
                        req.query.category || "",

                    searchQuery:
                        req.query.q || "",

                    maxPrice:
                        req.query.maxPrice
                            ? Number(req.query.maxPrice)
                            : 50000,

                    color:
                        req.query.color || "",

                    sort:
                        req.query.sort || "",

                    currentPage: "shop",

                    currentPageNumber: 1,

                    totalPages: 0,

                    totalProducts: 0,

                    limit: 9

                }
            );

        }

    }


    // ==========================================
    // SINGLE PRODUCT
    // ==========================================

    async singleProduct(req, res) {

        try {

            const { id } = req.params;

            // ==========================================
            // FIND PRODUCT
            // ==========================================

            const product =
                await Product.findById(id)

                    .populate(
                        "category",
                        "name slug"
                    )

                    .populate(
                        "brand",
                        "name"
                    )

                    .lean();

            // ==========================================
            // PRODUCT NOT FOUND
            // ==========================================

            if (!product) {

                return res
                    .status(404)
                    .render("customer/404");

            }

            // ==========================================
            // RENDER PRODUCT
            // ==========================================

            return res.render(
                "customer/single",
                {

                    title: product.name,

                    product,

                    currentPage: "shop"

                }
            );

        } catch (error) {

            console.log(
                "SINGLE PRODUCT ERROR:",
                error
            );

            return res
                .status(500)
                .send("Product not found");

        }

    }

}


// ==========================================
// EXPORT CONTROLLER
// ==========================================

module.exports =
    new ShopController();