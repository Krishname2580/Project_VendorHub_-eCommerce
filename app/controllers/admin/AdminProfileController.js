const User = require("../../models/User");

// ======================
// Admin Profile Page
// ======================

exports.adminProfile = async (req, res) => {

    try {

        const admin = await User.findById(req.user.id)
            .populate("role");

        if (!admin) {

            return res.redirect("/auth/login");

        }

        return res.render("admin/profile/profile", {

            title: "My Profile",

            admin

        });

    } catch (error) {

        console.log(error);

        return res.redirect("/admin/dashboard");

    }

};


// ======================
// Update Admin Profile
// ======================

exports.updateAdminProfile = async (req, res) => {

    try {

        const { name, phone } = req.body;

        const admin = await User.findById(req.user.id);

        if (!admin) {

            return res.redirect("/auth/login");

        }

        admin.name = name;
        admin.phone = phone;

        // Image Upload
        if (req.file) {

            admin.image = req.file.path;

        }

        await admin.save();

        return res.redirect("/admin/profile");

    } catch (error) {

        console.log(error);

        return res.redirect("/admin/profile");

    }

};