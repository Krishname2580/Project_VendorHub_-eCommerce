const express = require("express");

const router = express.Router();

const CustomerHomeController = require("../../controllers/customer/CustomerHomeController");

router.get("/", CustomerHomeController.home);

module.exports = router;