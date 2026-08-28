const express = require("express");

const router = express.Router();

const VendorReportController = require("../../controllers/vendor/VendorreportController");

const authMiddleware = require("../../middleware/authMiddleware");

const VendorMiddleware = require("../../middleware/vendorMiddleware");

router.get(

    "/report/dashboard",

    VendorMiddleware,

    VendorReportController.dashboard

);

router.get(

    "/report/sales",

    VendorMiddleware,

    VendorReportController.sales

);

router.get(

    "/report/orders",

    VendorMiddleware,

    VendorReportController.orders

);

router.get(

    "/report/products",

    VendorMiddleware,

    VendorReportController.products

);

module.exports = router;