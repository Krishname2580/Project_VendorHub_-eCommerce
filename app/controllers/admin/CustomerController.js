const User = require("../../models/User");
const Role = require("../../models/Role");

class CustomerController {

    // ================= CUSTOMER LIST =================

    async list(req, res) {

        try {

            const customerRole = await Role.findOne({
                roleName: "Customer"
            });

            if (!customerRole) {

                return res.render("admin/customer/list", {
                    title: "Customer List",
                    admin: req.user,
                    customers: []
                });

            }

            const customers = await User.find({
                role: customerRole._id
            })
                .populate("role")
                .sort({
                    createdAt: -1
                });

            return res.render(
                "admin/customer/list",
                {
                    title: "Customer List",

                    admin: req.user,

                    customers
                }
            );

        } catch (error) {

            console.log(
                "CUSTOMER LIST ERROR:",
                error
            );

            return res.redirect(
                "/admin/dashboard"
            );
        }
    }


    // ================= CUSTOMER DETAILS =================

    async details(req, res) {

        try {

            const customer = await User.findById(
                req.params.id
            )
                .populate("role");

            if (!customer) {

                return res.redirect(
                    "/admin/customer/list"
                );

            }

            return res.render(
                "admin/customer/details",
                {
                    title: "Customer Details",

                    admin: req.user,

                    customer
                }
            );

        } catch (error) {

            console.log(
                "CUSTOMER DETAILS ERROR:",
                error
            );

            return res.redirect(
                "/admin/customer/list"
            );
        }
    }


    // ================= CHANGE STATUS =================

    async changeStatus(req, res) {

        try {

            const customer = await User.findById(
                req.params.id
            );

            if (!customer) {

                return res.redirect(
                    "/admin/customer/list"
                );

            }

            customer.status = !customer.status;

            await customer.save();

            return res.redirect(
                "/admin/customer/list"
            );

        } catch (error) {

            console.log(
                "CUSTOMER STATUS ERROR:",
                error
            );

            return res.redirect(
                "/admin/customer/list"
            );
        }
    }


    // ================= DELETE CUSTOMER =================

    async delete(req, res) {

        try {

            const customer = await User.findById(
                req.params.id
            );

            if (!customer) {

                return res.redirect(
                    "/admin/customer/list"
                );

            }

            await User.findByIdAndDelete(
                req.params.id
            );

            return res.redirect(
                "/admin/customer/list"
            );

        } catch (error) {

            console.log(
                "CUSTOMER DELETE ERROR:",
                error
            );

            return res.redirect(
                "/admin/customer/list"
            );
        }
    }

}

module.exports = new CustomerController();