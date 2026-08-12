const Brand = require("../../models/Brand");
const cloudinary = require("../../config/cloudinary");
const slugify = require("slugify");

class BrandController {

    // Brand List

    async list(req, res) {

        try {

            const brands = await Brand.find()
                .sort({ createdAt: -1 });

            return res.render("admin/brand/list", {

                title: "Brand List",

                admin: req.user,

                brands

            });

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/dashboard");

        }

    }

    // Add Brand Page

    async addPage(req, res) {

        try {

            return res.render("admin/brand/add", {

                title: "Add Brand",

                admin: req.user

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Create Brand

    async createBrand(req, res) {

        try {

            const {

                name,

                description,

                status

            } = req.body;

            const result = await cloudinary.uploader.upload(req.file.path);

            const brand = new Brand({

                name,

                slug: slugify(name, {
                    lower: true,
                    strict: true
                }),

                description,

                status,

                image: result.secure_url,

            });

            await brand.save();
            return res.redirect("/admin/brand/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/dashboard");

        }

    }

    // Brand Details

    async details(req, res) {

        try {

            const brand = await Brand.findById(req.params.id);

            return res.render("admin/brand/details", {

                title: "Brand Details",

                admin: req.user,

                brand

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Edit Brand Page

    async editPage(req, res) {

        try {

            const brand = await Brand.findById(req.params.id);

            return res.render("admin/brand/edit", {

                title: "Edit Brand",

                admin: req.user,

                brand

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Update Brand

    async updateBrand(req, res) {

        try {

            const {

                name,

                description,

                status

            } = req.body;

            const updateData = {

                name,

                description,

                status

            };

            if (req.file) {

                updateData.image = req.file.filename;

            }

            await Brand.findByIdAndUpdate(

                req.params.id,

                updateData

            );

            return res.redirect("/admin/brand/list");

        } catch (error) {

            console.log(error);

        }

    }

    // Change Status

    async changeStatus(req, res) {

        try {

            const brand = await Brand.findById(req.params.id);

            brand.status = !brand.status;

            await brand.save();

            return res.redirect("/admin/brand/list");

        } catch (error) {

            console.log(error);

        }

    }

    // Delete Brand

    async deleteBrand(req, res) {

        try {

            await Brand.findByIdAndDelete(req.params.id);

            return res.redirect("/admin/brand/list");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new BrandController();