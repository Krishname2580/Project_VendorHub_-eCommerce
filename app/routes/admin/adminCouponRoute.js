const express = require("express");

const router = express.Router();

const CouponController = require("../../controllers/admin/CouponController");

const authMiddleware = require("../../middleware/authMiddleware");

const AdminAuthCheck = require("../../middleware/AdminAuthCheck");


// ================= Coupon List =================

router.get(
    "/coupon/list",
    authMiddleware,
    AdminAuthCheck,
    CouponController.couponList
);


// ================= Add Coupon =================

router.get(
    "/coupon/add",
    authMiddleware,
    AdminAuthCheck,
    CouponController.addCoupon
);


// ================= Create Coupon =================

router.post(
    "/coupon/create",
    authMiddleware,
    AdminAuthCheck,
    CouponController.createCoupon
);


// ================= Edit Coupon =================

router.get(
    "/coupon/edit/:id",
    authMiddleware,
    AdminAuthCheck,
    CouponController.editCoupon
);


// ================= Update Coupon =================

router.post(
    "/coupon/update/:id",
    authMiddleware,
    AdminAuthCheck,
    CouponController.updateCoupon
);


// ================= Delete Coupon =================

router.get(
    "/coupon/delete/:id",
    authMiddleware,
    AdminAuthCheck,
    CouponController.deleteCoupon
);


// ================= Change Status =================

router.get(
    "/coupon/status/:id",
    authMiddleware,
    AdminAuthCheck,
    CouponController.changeStatus
);


module.exports = router;