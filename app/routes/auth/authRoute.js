const express = require("express");

const router = express.Router();

const AuthController = require("../../controllers/auth/AuthController");

router.get("/register", AuthController.registerPage);
router.post("/register", AuthController.register);

router.get("/verify/:token", AuthController.verifyEmail);

router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.login);

router.get("/logout", AuthController.logout);

router.get("/forgot-password", AuthController.forgotPasswordPage);
router.post("/forgot-password", AuthController.forgotPassword);

router.get("/reset-password/:token", AuthController.resetPasswordPage);
router.post("/reset-password/:token", AuthController.resetPassword);

router.post("/change-password", AuthController.changePassword);



module.exports = router;