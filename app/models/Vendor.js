const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        gstNumber: {
            type: String
        },

        panNumber: {
            type: String
        },

        aadharNumber: {
            type: String
        },

        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },

        status: {
            type: Boolean,
            default: true
        },

        commission: {
            type: Number,
            default: 10
        },

        walletBalance: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vendor", vendorSchema);