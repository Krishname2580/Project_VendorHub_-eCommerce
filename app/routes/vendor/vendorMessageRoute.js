const express = require("express");

const router = express.Router();

const MessageController = require("../../controllers/vendor/VendorMessageController");

const vendorAuthCheck = require("../../middleware/vendorMiddleware");



router.get(
    "/message/list",
    vendorAuthCheck,
    MessageController.list
);


module.exports = router;