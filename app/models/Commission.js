const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },

        percentage: Number,

        amount: Number
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Commission", commissionSchema);