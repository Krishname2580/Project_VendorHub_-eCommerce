const express = require("express");

const router = express.Router();

const DashboardController = require("../../controllers/vendor/VendorDashboardController");

// const authMiddleware = require("../../middleware/authMiddleware");
const vendorAuthCheck = require("../../middleware/vendorMiddleware");

router.get(
    "/dashboard",
    vendorAuthCheck,
    DashboardController.dashboard
);

module.exports = router;