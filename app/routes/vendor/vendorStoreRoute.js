const express = require("express");
const router = express.Router();

const VendorStoreController = require("../../controllers/vendor/VendorStoreController");

const authMiddleware = require("../../middleware/authMiddleware");
const VendorMiddleware = require("../../middleware/vendorMiddleware");

const upload = require("../../middleware/upload");

// ================= Store Details =================

router.get(
    "/store",
    VendorMiddleware,
    VendorStoreController.store
);

// ================= Add Store =================

router.get(
    "/store/add",
   VendorMiddleware,
    VendorStoreController.addStorePage
);

router.post(
    "/store/create",
    VendorMiddleware,
    upload.fields([
        {
            name: "logo",
            maxCount: 1
        },
        {
            name: "banner",
            maxCount: 1
        }
    ]),
    VendorStoreController.createStore
);

// ================= Edit Store =================

router.get(
    "/store/edit",
   VendorMiddleware,
    VendorStoreController.editStorePage
);

router.post(
    "/store/update",
   VendorMiddleware,
    upload.fields([
        {
            name: "logo",
            maxCount: 1
        },
        {
            name: "banner",
            maxCount: 1
        }
    ]),
    VendorStoreController.updateStore
);

module.exports = router;