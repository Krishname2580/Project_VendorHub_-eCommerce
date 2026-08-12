const Vendor = require("../../models/Vendor");
const User = require("../../models/User");
const Store = require("../../models/Store");

class VendorProfileController {

    // ================= Profile =================

    async profile(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const store = await Store.findOne({
                vendor: vendor._id
            });

            return res.render("vendor/profile/index", {

                title: "My Profile",

                vendor,

                store

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Edit Page =================

    async editProfilePage(req, res) {

        try {

            const vendor = await Vendor.findOne({

                user: req.user._id

            }).populate("user");

            const store = await Store.findOne({

                vendor: vendor._id

            });

            return res.render("vendor/profile/edit", {

                title: "Edit Profile",

                vendor,

                store

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Update =================

    async updateProfile(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            });

            const updateData = {
                name: req.body.name,
                phone: req.body.phone
            };

            if (req.file) {
                updateData.image = req.file.path;
            }

            console.log(req.body);
            console.log(req.file);

            await User.findByIdAndUpdate(req.user._id, updateData);

            if (vendor) {

                vendor.gstNumber = req.body.gstNumber;
                vendor.panNumber = req.body.panNumber;
                vendor.aadharNumber = req.body.aadharNumber;

                await vendor.save();

            }

            const store = await Store.findOne({
                vendor: vendor._id
            });

            if (store) {

                store.storeName = req.body.storeName;
                store.address = req.body.address;
                store.description = req.body.description;

                await store.save();

            }

            return res.redirect("/vendor/profile");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new VendorProfileController();