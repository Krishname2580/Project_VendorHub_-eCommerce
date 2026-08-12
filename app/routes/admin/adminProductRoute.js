const express = require("express");
const router = express.Router();

const ProductController = require("../../controllers/admin/ProductController");
const authMiddleware = require("../../middleware/authMiddleware");
const AdminAuth = require("../../middleware/AdminAuthCheck");
const upload = require("../../middleware/upload")

router.get("/product/list",
    AdminAuth,
    ProductController.list
);

router.get("/product/pending",
    AdminAuth,
    ProductController.pending
);

router.get("/product/approved",
    AdminAuth,
    ProductController.approved
);

router.get("/product/rejected",
    AdminAuth,
    ProductController.rejected
);

router.get("/product/approve/:id",
    AdminAuth,
    ProductController.approve
);

router.get("/product/reject/:id",
    AdminAuth,
    ProductController.reject
);
// Product Details

router.get(
    "/product/details/:id",
    AdminAuth,
    ProductController.details
);

// Delete Product

router.get(
    "/product/delete/:id",
    AdminAuth,
    ProductController.delete
);

// Edit Page

router.get(
    "/product/edit/:id",
    AdminAuth,
    ProductController.editPage
);


// Update Product

router.post(
    "/product/update/:id",
    AdminAuth,
    upload.single("image"),
    ProductController.update
);

// Change Status

router.get(
    "/product/status/:id",
    AdminAuth,
    ProductController.changeStatus
);


// Toggle Bestseller
router.get(
    "/product/toggle-bestseller/:id",
    AdminAuth,
    ProductController.toggleBestSeller
);

// Toggle Featured
router.get(
    "/product/toggle-featured/:id",
    AdminAuth,
    ProductController.toggleFeatured
);

module.exports = router;