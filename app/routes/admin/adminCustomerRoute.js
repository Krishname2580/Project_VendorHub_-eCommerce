const express = require("express");

const router = express.Router();

const CustomerController =
    require("../../controllers/admin/CustomerController");

const AdminAuth =
    require("../../middleware/AdminAuthCheck");


// ================= CUSTOMER LIST =================

router.get(
    "/customer/list",
    AdminAuth,
    CustomerController.list
);


// ================= CUSTOMER DETAILS =================

router.get(
    "/customer/details/:id",
    AdminAuth,
    CustomerController.details
);


// ================= CUSTOMER STATUS =================

router.get(
    "/customer/status/:id",
    AdminAuth,
    CustomerController.changeStatus
);


// ================= CUSTOMER DELETE =================

router.get(
    "/customer/delete/:id",
    AdminAuth,
    CustomerController.delete
);


module.exports = router;