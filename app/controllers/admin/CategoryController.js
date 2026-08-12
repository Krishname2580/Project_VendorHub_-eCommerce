const Category = require("../../models/Category");
const cloudinary = require("../../config/cloudinary");
const slugify = require("slugify");

class CategoryController {

    // Category List

    async list(req, res) {

        try {

            const categories = await Category.find()
                .sort({ createdAt: -1 });

            return res.render("admin/category/list", {

                title: "Category List",

                admin: req.user,

                categories

            });

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/dashboard");

        }

    }

    // Add Category Page

    async addPage(req, res) {

        try {

            return res.render("admin/category/add", {

                title: "Add Category",

                admin: req.user

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Create Category

    async createCategory(req, res) {

        try {

            const {

                name,

                description,

                status

            } = req.body;

            const result = await cloudinary.uploader.upload(req.file.path);

            const category = new Category({

                name,

                slug: slugify(name, {
                lower: true,
                strict: true
            }),
                description,

                status,

                image: result.secure_url,

            });

            
            await category.save();
            return res.redirect("/admin/category/list");

        } catch (error) {

            console.log(error);

            return res.redirect("/admin/dashboard");

        }

    }

    // Category Details

    async details(req, res) {

        try {

            const category = await Category.findById(req.params.id);

            return res.render("admin/category/details", {

                title: "Category Details",

                admin: req.user,

                category

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Edit Page

    async editPage(req, res) {

        try {

            const category = await Category.findById(req.params.id);

            return res.render("admin/category/edit", {

                title: "Edit Category",

                admin: req.user,

                category

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Update Category

    async updateCategory(req, res) {

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

            await Category.findByIdAndUpdate(

                req.params.id,

                updateData

            );

            return res.redirect("/admin/category/list");

        } catch (error) {

            console.log(error);

        }

    }

    // Change Status

    async changeStatus(req, res) {

        try {

            const category = await Category.findById(req.params.id);

            category.status = !category.status;

            await category.save();

            return res.redirect("/admin/category/list");

        } catch (error) {

            console.log(error);

        }

    }

    // Delete Category

    async deleteCategory(req, res) {

        try {

            await Category.findByIdAndDelete(req.params.id);

            return res.redirect("/admin/category/list");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new CategoryController();