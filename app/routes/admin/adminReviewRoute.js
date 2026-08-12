const express = require("express");

const router = express.Router();

const ReviewController = require("../../controllers/admin/ReviewController");
const authMiddleware = require("../../middleware/authMiddleware");
const AdminAuth = require("../../middleware/AdminAuthCheck");


// Review List

router.get(
    "/list",
    AdminAuth,
    ReviewController.list
);


// Review Details

router.get(
    "/details/:id",

    AdminAuth,
    ReviewController.details
);


// Approve Review

router.get(
    "/approve/:id",

    AdminAuth,
    ReviewController.approve
);


// Reject Review

router.get(
    "/reject/:id",

    AdminAuth,
    ReviewController.reject
);


// Delete Review

router.get(
    "/delete/:id",

    AdminAuth,
    ReviewController.delete
);


module.exports = router;