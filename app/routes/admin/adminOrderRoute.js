const express = require("express");

const router = express.Router();

const OrderController =
    require("../../controllers/admin/OrderController");

const adminAuth =
    require("../../middleware/AdminAuthCheck");


router.get(
    "/order/list",
    adminAuth,
    OrderController.orderList
);

router.get(
    "/order/details/:id",
    adminAuth,
    OrderController.orderDetails
);

router.get(
    "/order/confirm/:id",
    adminAuth,
    OrderController.confirmOrder
);

router.get(
    "/order/pack/:id",
    adminAuth,
    OrderController.packOrder
);

router.get(
    "/order/ship/:id",
    adminAuth,
    OrderController.shipOrder
);

router.get(
    "/order/deliver/:id",
    adminAuth,
    OrderController.deliverOrder
);

router.get(
    "/order/cancel/:id",
    adminAuth,
    OrderController.cancelOrder
);

router.get(
    "/order/return/:id",
    adminAuth,
    OrderController.returnOrder
);

router.get(
    "/order/delete/:id",
    adminAuth,
    OrderController.deleteOrder
);


module.exports = router;