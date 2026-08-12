const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
{
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },

    storeName: {
        type: String,
        required: true
    },

    logo: {
        type: String,
        default: ""
    },

    banner: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    address: String,

    city: String,

    state: String,

    pincode: String,

    country: {
        type: String,
        default: "India"
    },

    phone: String,

    email: String,

    facebook: String,

    instagram: String,

    twitter: String,


    // Admin Approval

    approvalStatus: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Rejected"
        ],
        default: "Pending"
    },


    isActive: {
        type: Boolean,
        default: true
    }

},
{
    timestamps:true
});


module.exports = mongoose.model("Store",storeSchema);