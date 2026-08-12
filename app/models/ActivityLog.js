const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(

    {

        admin: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        action: {

            type: String,

            required: true

        },

        module: {

            type: String,

            required: true

        },

        description: {

            type: String,

            default: ""

        },

        ipAddress: {

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

module.exports = mongoose.model("ActivityLog", activityLogSchema);