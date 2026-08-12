const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            unique: true
        },

        balance: {
            type: Number,
            default: 0
        },

        totalEarning: {
            type: Number,
            default: 0
        },

        totalWithdraw: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Wallet", walletSchema);