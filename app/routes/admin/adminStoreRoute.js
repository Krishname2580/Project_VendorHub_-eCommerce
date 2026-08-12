const express = require("express");

const router = express.Router();

const StoreController = require("../../controllers/admin/StoreController");

const authMiddleware = require("../../middleware/authMiddleware");

const adminMiddleware = require("../../middleware/AdminAuthCheck");

// Store List

router.get(

    "/store/list",

    adminMiddleware,

    StoreController.storeList

);

// Store Details

router.get(

    "/store/details/:id",
    adminMiddleware,

    StoreController.storeDetails

);

// Approve Store

router.get(

    "/store/approve/:id",

    adminMiddleware,

    StoreController.approveStore

);

// Reject Store

router.get(

    "/store/reject/:id",

    adminMiddleware,
    StoreController.rejectStore

);

// Suspend Store

router.get(

    "/store/suspend/:id",

    adminMiddleware,
    StoreController.suspendStore

);

// Activate Store

router.get(

    "/store/activate/:id",

    adminMiddleware,
    StoreController.activateStore

);

module.exports = router;