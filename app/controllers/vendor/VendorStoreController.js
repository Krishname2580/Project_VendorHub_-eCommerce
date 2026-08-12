const Store = require("../../models/Store");
const Vendor = require("../../models/Vendor");

class VendorStoreController {

    // ================= Store Details =================

    async store(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            }).populate("user");

            const store = await Store.findOne({
                vendor: vendor._id
            });

            if (!store) {

                return res.redirect("/vendor/store/add");

            }

            return res.render("vendor/store/index", {

                title: "My Store",

                vendor,

                store

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Add Store Page =================

    async addStorePage(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            });

            const existStore = await Store.findOne({
                vendor: vendor._id
            });

            if (existStore) {

                return res.redirect("/vendor/store");

            }

            return res.render("vendor/store/add", {

                title: "Create Store",
                vendor

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Create Store =================

    async createStore(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            });

            const {

                storeName,
                address,
                description

            } = req.body;

            let logo = "";

            let banner = "";

            if (req.files?.logo) {

                logo = req.files.logo[0].path;

            }

            if (req.files?.banner) {

                banner = req.files.banner[0].path;

            }

            await Store.create({

                vendor: vendor._id,

                storeName,

                address,

                description,

                logo,

                banner

            });

            return res.redirect("/vendor/store");

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Edit Store =================

    async editStorePage(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            });

            const store = await Store.findOne({
                vendor: vendor._id
            });

            return res.render("vendor/store/edit", {

                title: "Edit Store",

                vendor,

                store

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Update Store =================

    async updateStore(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            });

            const store = await Store.findOne({
                vendor: vendor._id
            });

            store.storeName = req.body.storeName;

            store.address = req.body.address;

            store.description = req.body.description;

            if (req.files?.logo) {

                store.logo = req.files.logo[0].path;

            }

            if (req.files?.banner) {

                store.banner = req.files.banner[0].path;

            }

            await store.save();

            return res.redirect("/vendor/store");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new VendorStoreController();