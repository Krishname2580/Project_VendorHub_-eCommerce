const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            enum: ["Super Admin", "Admin", "Vendor", "Customer"],
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Role", roleSchema);