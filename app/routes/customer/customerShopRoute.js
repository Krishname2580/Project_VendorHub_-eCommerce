const express = require("express");
const router = express.Router();
const shopController = require("../../controllers/customer/CustomerShopController");

router.get("/shop", shopController.shop);
router.get("/product/:id", shopController.singleProduct);

module.exports = router;
