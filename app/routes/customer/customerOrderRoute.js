const express = require("express");

const router = express.Router();

const customerOrderController =
    require("../../controllers/customer/customerOrderController");


// ==============================
// MY ORDERS
// ==============================

router.get(
    "/orders",
    customerOrderController.myOrders
);


// ==============================
// ORDER DETAILS
// ==============================

router.get(
    "/orders/:id",
    customerOrderController.orderDetails
);


// ==============================
// CANCEL ORDER
// ==============================

router.post(
    "/orders/cancel/:id",
    customerOrderController.cancelOrder
);


module.exports = router;