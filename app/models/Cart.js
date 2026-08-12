const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductVariant",
            default: null
        },

        quantity: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);
cartSchema.index(
    {
        user: 1,
        product: 1,
        variant: 1
    },
    {
        unique: true
    }
);
module.exports = mongoose.model("Cart", cartSchema);
