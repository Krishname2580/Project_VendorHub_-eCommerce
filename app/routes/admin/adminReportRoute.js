const express = require("express");

const router = express.Router();


const ReportController = require("../../controllers/admin/ReportController");

const AdminAuth = require("../../middleware/AdminAuthCheck");

const authMiddleware = require("../../middleware/authMiddleware");



// Reports Dashboard

router.get(
    "/reports/dashboard",
    authMiddleware,
    AdminAuth,
    ReportController.dashboard
);



// Sales Report

router.get(
    "/reports/sales",
    authMiddleware,
    AdminAuth,
    ReportController.salesReport
);



// Order Report

router.get(
    "/reports/orders",
    authMiddleware,
    AdminAuth,
    ReportController.orderReport
);



// Product Report

router.get(
    "/reports/products",
    authMiddleware,
    AdminAuth,
    ReportController.productReport
);



// Customer Report

router.get(
    "/reports/customers",
    authMiddleware,
    AdminAuth,
    ReportController.customerReport
);



// Vendor Report

router.get(
    "/reports/vendors",
    authMiddleware,
    AdminAuth,
    ReportController.vendorReport
);



// Payment Report

router.get(
    "/reports/payments",
    authMiddleware,
    AdminAuth,
    ReportController.paymentReport
);



// Inventory Report

router.get(
    "/reports/inventory",
    authMiddleware,
    AdminAuth,
    ReportController.inventoryReport
);



// Coupon Report

router.get(
    "/reports/coupons",
    authMiddleware,
    AdminAuth,
    ReportController.couponReport
);



// Offer Report

router.get(
    "/reports/offers",
    authMiddleware,
    AdminAuth,
    ReportController.offerReport
);



module.exports = router;