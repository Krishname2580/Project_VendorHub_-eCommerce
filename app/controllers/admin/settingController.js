const Setting = require("../../models/Setting");

class SettingController {

    // ==========================================
    // SETTINGS PAGE
    // ==========================================

    async settings(req, res) {

        try {

            let setting = await Setting.findOne();

            // Create default settings if not available
            if (!setting) {

                setting = await Setting.create({

                    siteName: "",
                    email: "",
                    phone: "",
                    address: "",
                    currency: "INR",
                    tax: 0,
                    shippingCharge: 0,
                    maintenanceMode: false,
                    logo: "",
                    favicon: ""

                });

            }

            return res.render(
                "admin/settings/index",
                {

                    title: "Website Settings",

                    admin: req.user,

                    setting

                }
            );

        }
        catch (error) {

            console.log(
                "SETTINGS PAGE ERROR:",
                error
            );

            return res.redirect("/admin/dashboard");

        }

    }


    // ==========================================
    // UPDATE SETTINGS
    // ==========================================

    async updateSettings(req, res) {

        try {

            let setting = await Setting.findOne();


            // Create setting if it doesn't exist
            if (!setting) {

                setting = new Setting();

            }


            // ==========================================
            // BASIC SETTINGS
            // ==========================================

            setting.siteName =
                req.body.siteName || "";

            setting.email =
                req.body.email || "";

            setting.phone =
                req.body.phone || "";

            setting.address =
                req.body.address || "";

            setting.currency =
                req.body.currency || "INR";


            // ==========================================
            // TAX
            // ==========================================

            setting.tax =
                Number(req.body.tax) || 0;


            // ==========================================
            // SHIPPING
            // ==========================================

            setting.shippingCharge =
                Number(req.body.shippingCharge) || 0;


            // ==========================================
            // MAINTENANCE MODE
            // ==========================================

            setting.maintenanceMode =
                req.body.maintenanceMode === "true";


            // ==========================================
            // LOGO
            // ==========================================

            if (
                req.files &&
                req.files.logo &&
                req.files.logo.length > 0
            ) {

                setting.logo =
                    req.files.logo[0].filename;

            }


            // ==========================================
            // FAVICON
            // ==========================================

            if (
                req.files &&
                req.files.favicon &&
                req.files.favicon.length > 0
            ) {

                setting.favicon =
                    req.files.favicon[0].filename;

            }


            // ==========================================
            // SAVE
            // ==========================================

            await setting.save();


            console.log(
                "Website settings updated successfully"
            );


            return res.redirect(
                "/admin/settings/index"
            );

        }
        catch (error) {

            console.log(
                "UPDATE SETTINGS ERROR:",
                error
            );

            return res.redirect(
                "/admin/dashboard"
            );

        }

    }

}


module.exports = new SettingController();