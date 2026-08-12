const express = require("express");

const router = express.Router();

const CustomerProductController = require("../../controllers/customer/CustomerProductController");

router.get("/products", CustomerProductController.list);

router.get("/product/:id", CustomerProductController.details);

module.exports = router;