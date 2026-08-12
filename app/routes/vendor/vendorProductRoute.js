const express = require("express");
const router = express.Router();

const VendorProductController = require("../../controllers/vendor/VendorProductController");

const authMiddleware = require("../../middleware/authMiddleware");
const VendorMiddleware = require("../../middleware/vendorMiddleware");

const upload = require("../../middleware/upload");

// ================= Add Product =================

router.get(
    "/product/add",
    VendorMiddleware,
    VendorProductController.addProductPage
);

router.post(
    "/product/create",
    VendorMiddleware,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 5
        }
    ]),
    VendorProductController.createProduct
);

// ================= Product List =================

router.get(
    "/product/list",
    VendorMiddleware,
    VendorProductController.productList
);

// ================= Pending Products =================

router.get(
    "/product/pending",
    VendorMiddleware,
    VendorProductController.pendingProducts
);

// ================= Approved Products =================

router.get(
    "/product/approved",
    VendorMiddleware,
    VendorProductController.approvedProducts
);

// ================= Rejected Products =================

router.get(
    "/product/rejected",
    VendorMiddleware,
    VendorProductController.rejectedProducts
);

// ================= Product Details =================

router.get(
    "/product/details/:id",
    VendorMiddleware,
    VendorProductController.productDetails
);

// ================= Edit Product =================

router.get(
    "/product/edit/:id",
    VendorMiddleware,
    VendorProductController.editProductPage
);

router.post(
    "/product/update/:id",
    VendorMiddleware,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 5
        }
    ]),
    VendorProductController.updateProduct
);

// ================= Delete Product =================

router.get(
    "/product/delete/:id",
    VendorMiddleware,
    VendorProductController.deleteProduct
);

module.exports = router;