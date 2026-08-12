const express = require("express");

const router = express.Router();

const VendorOrderController =
    require("../../controllers/vendor/VendorOrderController");

const vendorAuth =
    require("../../middleware/vendorMiddleware");


// ==========================================
// VENDOR ORDERS
// ==========================================

router.get(
    "/orders",
    vendorAuth,
    VendorOrderController.orders
);


// ==========================================
// ORDER DETAILS
// ==========================================

router.get(
    "/orders/:id",
    vendorAuth,
    VendorOrderController.orderDetails
);


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.post(
    "/orders/:id/status",
    vendorAuth,
    VendorOrderController.updateStatus
);


module.exports = router;