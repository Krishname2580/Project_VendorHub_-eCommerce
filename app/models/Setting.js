const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({

    siteName: {
        type: String,
        default: "VendorHub"
    },

    logo: {
        type: String,
        default: ""
    },

    favicon: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    currency: {
        type: String,
        default: "INR"
    },

    tax: {
        type: Number,
        default: 0
    },

    shippingCharge: {
        type: Number,
        default: 0
    },

    maintenanceMode: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Setting", settingSchema);