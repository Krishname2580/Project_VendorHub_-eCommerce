const express = require("express");

const router = express.Router();

const VendorNotificationController = require("../../controllers/vendor/VendorNotificationController");

const authMiddleware = require("../../middleware/authMiddleware");

const VendorMiddleware = require("../../middleware/vendorMiddleware");


// ==========================
// All Notifications
// ==========================

router.get(

    "/notification/list",
    VendorMiddleware,

    VendorNotificationController.list

);


// ==========================
// Notification Details
// ==========================

router.get(

    "/notification/details/:id",
    VendorMiddleware,

    VendorNotificationController.details

);


// ==========================
// Mark Read
// ==========================

router.get(

    "/notification/read/:id",
    VendorMiddleware,

    VendorNotificationController.markRead

);


// ==========================
// Mark All Read
// ==========================

router.get(

    "/notification/read-all",
    VendorMiddleware,

    VendorNotificationController.markAllRead

);


// ==========================
// Delete Notification
// ==========================

router.get(

    "/notification/delete/:id",
    VendorMiddleware,

    VendorNotificationController.delete

);


module.exports = router;