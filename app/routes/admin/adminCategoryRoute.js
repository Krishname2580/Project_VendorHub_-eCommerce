const express = require("express");
const router = express.Router();

const CategoryController = require("../../controllers/admin/CategoryController");
const upload = require("../../middleware/upload");

const AdminAuthCheck = require("../../middleware/AdminAuthCheck");

// List
router.get("/category/list", AdminAuthCheck, CategoryController.list);

// Add Page
router.get("/category/add", AdminAuthCheck, CategoryController.addPage);

// Create
router.post(
    "/category/create",
    AdminAuthCheck,
    upload.single("image"),
    CategoryController.createCategory
);

// Details
router.get("/category/details/:id", AdminAuthCheck, CategoryController.details);

// Edit
router.get("/category/edit/:id", AdminAuthCheck, CategoryController.editPage);

// Update
router.post(
    "/category/update/:id",
    AdminAuthCheck,
    upload.single("image"),
    CategoryController.updateCategory
);

// Change Status
router.get(
    "/category/change-status/:id",
    AdminAuthCheck,
    CategoryController.changeStatus
);

// Delete
router.get(
    "/category/delete/:id",
    AdminAuthCheck,
    CategoryController.deleteCategory
);

module.exports = router;