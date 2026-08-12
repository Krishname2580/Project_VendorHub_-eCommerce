const express = require("express");

const router = express.Router();

const customerCheckoutController =
    require("../../controllers/customer/customerCheckoutController");


// ==========================================
// CHECKOUT PAGE
// ==========================================

router.get(
    "/checkout",
    customerCheckoutController.checkout
);


// ==========================================
// PLACE ORDER
// ==========================================

router.post(
    "/checkout/place-order",
    customerCheckoutController.placeOrder
);


// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

router.post(
    "/checkout/create-razorpay-order",
    customerCheckoutController.createRazorpayOrder
);


// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

router.post(
    "/checkout/verify-razorpay-payment",
    customerCheckoutController.verifyRazorpayPayment
);


// ==========================================
// ORDER SUCCESS
// ==========================================

router.get(
    "/order-success/:id",
    customerCheckoutController.orderSuccess
);


module.exports = router;