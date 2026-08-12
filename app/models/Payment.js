const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        transactionId: String,

        paymentGateway: {
            type: String,
            enum: ["COD", "Razorpay", "Stripe"]
        },

        amount: Number,

        status: {
            type: String,
            enum: ["Pending", "Success", "Failed", "Refunded"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema);