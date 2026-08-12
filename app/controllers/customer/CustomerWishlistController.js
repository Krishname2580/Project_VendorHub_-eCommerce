const Wishlist = require("../../models/Wishlist");

class WishlistController {

    // =========================================
    // SHOW WISHLIST
    // =========================================

    async list(req, res) {

        try {

            if (!req.user) {
                return res.redirect("/auth/login");
            }

            const userId = req.user._id;

            const wishlist = await Wishlist.find({
                user: userId
            })
                .populate("product")
                .lean();

            return res.render("customer/wishlist", {

                title: "My Wishlist",

                wishlist,

                currentPage: "wishlist"

            });

        } catch (error) {

            console.log("WISHLIST ERROR:", error);

            return res.status(500).send(
                "Unable to load wishlist"
            );

        }

    }


    // =========================================
    // ADD TO WISHLIST
    // =========================================

    async add(req, res) {

        try {

            if (!req.user) {
                return res.redirect("/auth/login");
            }

            const userId = req.user._id;
            const productId = req.params.id;

            // Check if product already exists
            const existingWishlist = await Wishlist.findOne({

                user: userId,

                product: productId

            });

            if (existingWishlist) {

                return res.redirect(
                    "/customer/wishlist"
                );

            }

            // Add product to wishlist
            await Wishlist.create({

                user: userId,

                product: productId

            });

            return res.redirect(
                "/customer/wishlist"
            );

        } catch (error) {

            console.log(
                "ADD WISHLIST ERROR:",
                error
            );

            return res.redirect("/shop");

        }

    }


    // =========================================
    // REMOVE FROM WISHLIST
    // =========================================

    async remove(req, res) {

        try {

            if (!req.user) {
                return res.redirect("/auth/login");
            }

            const userId = req.user._id;
            const productId = req.params.id;

            await Wishlist.findOneAndDelete({

                user: userId,

                product: productId

            });

            return res.redirect(
                "/customer/wishlist"
            );

        } catch (error) {

            console.log(
                "REMOVE WISHLIST ERROR:",
                error
            );

            return res.redirect(
                "/customer/wishlist"
            );

        }

    }

}

module.exports = new WishlistController();