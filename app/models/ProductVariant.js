const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        color: {
            type: String
        },

        size: {
            type: String
        },

        sku: {
            type: String,
            unique: true
        },

        price: {
            type: Number,
            required: true
        },

        stock: {
            type: Number,
            default: 0
        },

        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);