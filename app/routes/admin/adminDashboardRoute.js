const express = require("express");

const router = express.Router();

const DashboardController = require("../../controllers/admin/DashboardController");

const authMiddleware = require("../../middleware/authMiddleware");

const adminMiddleware = require("../../middleware/AdminAuthCheck");

router.get(

    "/dashboard",

    adminMiddleware,

    DashboardController.dashboard

);

module.exports = router;