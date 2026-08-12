const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
    {
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true
        },

        amount: Number,

        type: {
            type: String,
            enum: ["Credit", "Debit"]
        },

        description: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);