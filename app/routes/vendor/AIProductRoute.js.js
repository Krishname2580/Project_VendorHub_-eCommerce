const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const VendorAuth = require("../../middleware/vendorMiddleware");

const AIProductController = require("../../controllers/vendor/AIProductController");

router.post(
    "/generate-description",
    VendorAuth,
    AIProductController.generateDescription
);

module.exports = router;