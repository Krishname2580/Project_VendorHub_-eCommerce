const User = require("../../models/User");
const Vendor = require("../../models/Vendor");
const Role = require("../../models/Role");
const Store = require("../../models/Store");

class VendorController {

    // ================= Vendor List =================

    async vendorList(req, res) {

        try {

            const vendors = await Vendor.find()
                .populate({
                    path: "user",
                    populate: {
                        path: "role"
                    }
                })
                .sort({ createdAt: -1 });

            return res.render("admin/vendor/list", {
                title: "Vendor List",
                vendors,
                admin: req.user      // <-- Add this
            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Vendor Details =================

    async vendorDetails(req, res) {

        try {

            const vendor = await Vendor.findById(req.params.id)
                .populate({
                    path: "user",
                    populate: {
                        path: "role"
                    }
                });

            if (!vendor) {

                return res.redirect("/admin/vendors");

            }

            const store = await Store.findOne({
                vendor: vendor._id
            });

            return res.render("admin/vendor/details", {

                title: "Vendor Details",

                admin: req.user,

                vendor,

                store

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Pending Vendors =================

    async pendingVendorList(req, res) {

        try {

            const vendors = await Vendor.find({
                approvalStatus: "Pending"
            })
                .populate({
                    path: "user",
                    populate: {
                        path: "role"
                    }
                });

            return res.render("admin/vendor/pending", {
                title: "Vendor List",
                admin: req.user,
                vendors
            });

        } catch (error) {

            console.log(error);

        }

    }
    // ================= Approve Vendor =================

    async approvedVendorList(req, res) {

        try {

            const vendors = await Vendor.find({
                approvalStatus: "Approved"
            }).populate("user");

            console.log("Approved Vendors:", vendors.length);

            return res.render("admin/vendor/approved", {
                title: "Approved Vendors",
                admin: req.user,
                vendors
            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Reject Vendor =================

    // ================= Rejected Vendors =================

    async rejectedVendorList(req, res) {

        try {

            const vendors = await Vendor.find({

                approvalStatus: "Rejected"

            }).populate({

                path: "user"

            });

            return res.render("admin/vendor/rejected", {

                title: "Rejected Vendors",
                
                admin: req.user,

                vendors

            });

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/vendor/list");

        }

    }

    // ================= Approve Vendor =================

    async approveVendor(req, res) {

        try {

            const vendor = await Vendor.findById(req.params.id);

            if (!vendor) {

                return res.redirect("/admin/vendor/pending");

            }

            vendor.approvalStatus = "Approved";

            await vendor.save();

            return res.redirect("/admin/vendor/approved");

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Reject Vendor =================

    async rejectVendor(req, res) {

        try {

            const vendor = await Vendor.findById(req.params.id);

            if (!vendor) {

                return res.redirect("/admin/vendor/pending");

            }

            vendor.approvalStatus = "Rejected";

            await vendor.save();

            return res.redirect("/admin/vendor/rejected");

        } catch (error) {

            console.log(error);

        }

    }
}

module.exports = new VendorController();