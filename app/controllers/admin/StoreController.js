const Store = require("../../models/Store");
const Vendor = require("../../models/Vendor");

class StoreController {

    // ================= Store List =================

    async storeList(req, res) {

        try {

            const stores = await Store.find()
                .populate({
                    path: "vendor",
                    populate: {
                        path: "user"
                    }
                })
                .sort({ createdAt: -1 });

            return res.render("admin/store/list", {
                title: "Store List",
                stores,
                admin: req.user
            });

        } catch (error) {

            console.log(error);
            return res.redirect("/admin/dashboard");

        }

    }

    // ================= Store Details =================

    async storeDetails(req, res) {

        try {

            const store = await Store.findById(req.params.id);

            if (!store) {
                return res.redirect("/admin/store/list");
            }

            const vendor = await Vendor.findById(store.vendor)
                .populate("user");

            return res.render("admin/store/details", {
                title: "Store Details",
                admin: req.user,
                store,
                vendor
            });

        } catch (error) {

            console.log(error);

        }
    }

    // ================= Approve Store =================

    // ================= Approve Store =================

    async approveStore(req, res) {

        try {

            const store = await Store.findById(req.params.id);


            if (!store) {

                return res.redirect("/admin/store/list");

            }


            store.approvalStatus = "Approved";
            store.isActive = true;


            await store.save();


            return res.redirect("/admin/store/list");


        } catch (error) {

            console.log(error);

            return res.redirect("/admin/store/list");

        }

    }
    // ================= Reject Store =================

    // ================= Reject Store =================

    async rejectStore(req, res) {

        try {


            await Store.findByIdAndUpdate(

                req.params.id,

                {

                    approvalStatus: "Rejected",

                    isActive: false

                }

            );


            return res.redirect("/admin/store/list");


        } catch (error) {


            console.log(error);


            return res.redirect("/admin/store/list");


        }

    }

    // ================= Suspend Store =================

    // ================= Suspend Store =================

    async suspendStore(req, res) {

        try {

            const store = await Store.findById(req.params.id);


            if (!store) {

                return res.redirect("/admin/store/list");

            }


            await Store.findByIdAndUpdate(

                req.params.id,

                {
                    isActive: false
                }

            );


            return res.redirect("/admin/store/list");


        } catch (error) {

            console.log(error);

            return res.redirect("/admin/store/list");

        }

    }

    // ================= Activate Store =================

    async activateStore(req, res) {

        try {

            await Store.findByIdAndUpdate(req.params.id, {

                status: "Approved"

            });

            return res.redirect("/admin/store/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/store/list");

        }

    }

}

module.exports = new StoreController();