const express = require("express");

const router = express.Router();

const SettingController = require("../../controllers/admin/SettingController");

const authMiddleware = require("../../middleware/authMiddleware");

const AdminAuth = require("../../middleware/AdminAuthCheck");

const upload = require("../../middleware/upload");



// Settings Page

router.get(

    "/settings/index",

  AdminAuth,

    SettingController.settings

);



// Update Settings

router.post(

    "/settings/update",
AdminAuth,

    upload.fields([

        {

            name: "logo",

            maxCount: 1

        },

        {

            name: "favicon",

            maxCount: 1

        }

    ]),

    SettingController.updateSettings

);

module.exports = router;