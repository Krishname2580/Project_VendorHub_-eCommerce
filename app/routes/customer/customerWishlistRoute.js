const express = require("express");

const router = express.Router();

const WishlistController =
    require("../../controllers/customer/CustomerWishlistController");

const authMiddleware =
    require("../../middleware/authMiddleware");


// ==============================
// WISHLIST PAGE
// ==============================

router.get(
    "/wishlist",
    authMiddleware,
    WishlistController.list
);


// ==============================
// ADD TO WISHLIST
// ==============================

router.get(
    "/wishlist/add/:id",
    authMiddleware,
    WishlistController.add
);


// ==============================
// REMOVE FROM WISHLIST
// ==============================

router.get(
    "/wishlist/remove/:id",
    authMiddleware,
    WishlistController.remove
);


module.exports = router;