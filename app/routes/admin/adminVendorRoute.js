const express = require("express");
const router = express.Router();


const authMiddleware = require("../../middleware/authMiddleware");
const VendorController = require("../../controllers/admin/VendorController");
const AdminAuth = require("../../middleware/AdminAuthCheck");

// ================= Vendor List =================

router.get(
    "/vendor/list",
    AdminAuth,
    VendorController.vendorList
);

// ================= Vendor Details =================

router.get(
    "/vendor/details/:id",
    AdminAuth,
    VendorController.vendorDetails
);

// ================= Pending Vendors =================

router.get(
    "/vendor/pending",
    AdminAuth,
    VendorController.pendingVendorList
);

// ================= Approved Vendors =================

router.get(
    "/vendor/approved",
    AdminAuth,
    VendorController.approvedVendorList
);

// ================= Rejected Vendors =================

router.get(
    "/vendor/rejected",
    AdminAuth,
    VendorController.rejectedVendorList
);

// ================= Approve Vendor =================

router.get(
    "/vendor/approved/:id",
    AdminAuth,
    VendorController.approveVendor
);

// ================= Reject Vendor =================

router.get(
    "/vendor/rejected/:id",
    AdminAuth,
    VendorController.rejectVendor
);

module.exports = router;