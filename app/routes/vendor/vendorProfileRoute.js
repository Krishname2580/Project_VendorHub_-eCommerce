const express = require("express");

const router = express.Router();

const VendorProfileController = require("../../controllers/vendor/VendorProfileController");
const upload = require("../../middleware/upload");

const authMiddleware = require("../../middleware/authMiddleware");
const VendorAuth = require("../../middleware/vendorMiddleware");

router.get(

    "/profile",
    VendorAuth,

    VendorProfileController.profile

);

router.get(

    "/profile/edit",
    VendorAuth,

    VendorProfileController.editProfilePage

);

router.post(

    "/profile/update",
    (req, res, next) => {
        console.log("Update route called");
        next();
    }, VendorAuth,
    upload.single("image"),
    VendorProfileController.updateProfile

);

module.exports = router;