const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    discountType: {
        type: String,
        enum: ["Flat", "Percentage"],
        required: true
    },

    discountValue: {
        type: Number,
        required: true
    },

    minimumPurchase: {
        type: Number,
        default: 0
    },

    maximumDiscount: {
        type: Number,
        default: 0
    },

    expiryDate: {
        type: Date,
        required: true
    },

    usageLimit: {
        type: Number,
        default: 1
    },

    usedCount: {
        type: Number,
        default: 0
    },

    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Coupon", couponSchema);