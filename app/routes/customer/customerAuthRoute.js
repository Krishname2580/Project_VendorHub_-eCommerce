const express = require("express");

const router = express.Router();

const CustomerAuthController = require("../../controllers/customer/CustomerAuthController");

const { isLoggedIn } = require('../../middleware/customerMiddleware');



// ==============================
// Register
// ==============================

router.get(
    "/register",
    CustomerAuthController.registerPage
);

router.post(
    "/register",
    CustomerAuthController.register
);

// ==============================
// Email Verification
// ==============================


router.get('/dashboard', isLoggedIn, CustomerAuthController.dashboard);

router.get(
    "/verify-email/:token",
    CustomerAuthController.verifyEmail
);

// ==============================
// Login
// ==============================

router.get(
    "/login",
    CustomerAuthController.loginPage
);

router.post(
    "/login",
    CustomerAuthController.login
);

// ==============================
// Logout
// ==============================

router.get(
    "/logout",
    CustomerAuthController.logout
);

// ==============================
// Forgot Password
// ==============================

// router.get(
//     "/forgot-password",
//     CustomerAuthController.forgotPasswordPage
// );

// router.post(
//     "/forgot-password",
//     CustomerAuthController.forgotPassword
// );

// // ==============================
// // Reset Password
// // ==============================

// router.get(
//     "/reset-password/:token",
//     CustomerAuthController.resetPasswordPage
// );

// router.post(
//     "/reset-password/:token",
//     CustomerAuthController.resetPassword
// );

module.exports = router;