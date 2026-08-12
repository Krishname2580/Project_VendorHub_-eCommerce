const express = require("express");

const router = express.Router();

const BrandController = require("../../controllers/admin/BrandController");

const upload = require("../../middleware/upload");

const AdminAuth = require("../../middleware/AdminAuthCheck");

// Brand List

router.get(

    "/brand/list",

    AdminAuth,

    BrandController.list

);

// Add Brand Page

router.get(

    "/brand/add",

    AdminAuth,

    BrandController.addPage

);

// Create Brand

router.post(

    "/brand/create",

    AdminAuth,

    upload.single("image"),

    BrandController.createBrand

);

// Brand Details

router.get(

    "/brand/details/:id",

    AdminAuth,

    BrandController.details

);

// Edit Brand Page

router.get(

    "/brand/edit/:id",

    AdminAuth,

    BrandController.editPage

);

// Update Brand

router.post(

    "/brand/update/:id",

    AdminAuth,

    upload.single("image"),

    BrandController.updateBrand

);

// Change Status

router.get(

    "/brand/change-status/:id",

    AdminAuth,

    BrandController.changeStatus

);

// Delete Brand

router.get(

    "/brand/delete/:id",

    AdminAuth,

    BrandController.deleteBrand

);

module.exports = router;