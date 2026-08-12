const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true
        },

        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand"
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        discountPrice: {
            type: Number,
            default: 0
        },

        sku: {
            type: String,
            unique: true
        },

        stock: {
            type: Number,
            default: 0
        },

        thumbnail: {
            type: String,
            default: ""
        },

        images: [
            {
                imageUrl: String,
                imageId: String
            }
        ],

        weight: Number,

        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected"
            ],
            default: "Pending"
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        isBestSeller: {
            type: Boolean,
            default: false
        },

        isNewArrival: {
            type: Boolean,
            default: false
        },
        shortDescription: {
            type: String,
            default: ""
        },

        features: [{
            type: String
        }],

        seoTitle: {
            type: String,
            default: ""
        },

        seoDescription: {
            type: String,
            default: ""
        },

        seoKeywords: [{
            type: String
        }],

        tags: [{
            type: String
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);