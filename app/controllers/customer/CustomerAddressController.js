const Address = require("../../models/Address");

class CustomerAddressController {

    // ==========================
    // Address List
    // ==========================

    async list(req, res) {

        try {

            const customer = req.session.customer;

            const addresses = await Address.find({

                user: customer._id

            }).sort({

                createdAt: -1

            });

            return res.render("customer/address/list", {

                title: "My Addresses",

                customer,

                addresses

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ==========================
    // Add Page
    // ==========================

    async addPage(req, res) {

        return res.render("customer/address/add", {

            title: "Add Address",

            customer: req.session.customer

        });

    }

    // ==========================
    // Save Address
    // ==========================

    async add(req, res) {

        try {

            const customer = req.session.customer;

            if (!customer) {
                return res.redirect("/customer/login");
            }

            await Address.create({

                user: customer._id,

                fullName: req.body.fullName,

                mobile: req.body.phone,

                addressLine1: req.body.address,

                addressLine2: req.body.addressLine2 || "",

                city: req.body.city,

                state: req.body.state,

                country: req.body.country,

                pincode: req.body.pincode,

                addressType: req.body.addressType || "Home"

            });

            return res.redirect("/customer/address");

        } catch (error) {

            console.log(error);

            return res.send(error.message);

        }

    }

    // ==========================
    // Edit Page
    // ==========================

    async editPage(req, res) {

        try {

            const address = await Address.findById(req.params.id);
            
            const addresses = await Address.find({

                user:req.user._id

            });
            return res.render("customer/address/edit", {

                title: "Edit Address",

                customer: req.session.customer,

                address,

                addresses

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ==========================
    // Update Address
    // ==========================

    async update(req, res) {

        try {

            await Address.findByIdAndUpdate(

                req.params.id,

                req.body

            );

            return res.redirect("/customer/address");

        } catch (error) {

            console.log(error);

        }

    }

    // ==========================
    // Delete Address
    // ==========================

    async delete(req, res) {

        try {

            await Address.findByIdAndDelete(

                req.params.id

            );

            return res.redirect("/customer/address");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new CustomerAddressController();