const express = require("express");

const router = express.Router();

const AdminController = require("../../controllers/admin/AdminProfileController");

const authMiddleware = require("../../middleware/authMiddleware");

const AdminAuthCheck = require("../../middleware/AdminAuthCheck");

const upload = require("../../middleware/upload");


// Profile Page
router.get(

    "/profile",

    authMiddleware,

    AdminAuthCheck,

    AdminController.adminProfile

);


// Update Profile
router.post(

    "/profile/update",

    authMiddleware,

    AdminAuthCheck,

    upload.single("image"),

    AdminController.updateAdminProfile

);

module.exports = router;