const express = require("express");

const router = express.Router();

const CustomerAddressController = require("../../controllers/customer/CustomerAddressController");

router.get("/address/", CustomerAddressController.list);

router.get("/address/add", CustomerAddressController.addPage);

router.post("/address/add", CustomerAddressController.add);

router.get("/address/edit/:id", CustomerAddressController.editPage);

router.post("/address/edit/:id", CustomerAddressController.update);

router.get("/address/delete/:id", CustomerAddressController.delete);

module.exports = router;