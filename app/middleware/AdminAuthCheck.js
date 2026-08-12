const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AdminAuth = async (req, res, next) => {
    try {

        const token = req.cookies.adminToken;

        if (!token) {
            return res.redirect("/auth/login");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id)
            .populate("role");

        if (!user) {
            return res.redirect("/auth/login");
        }

        if (
            !user.role ||
            user.role.roleName !== "Super Admin"
        ) {
            return res.status(403).send("Access Denied");
        }

        req.user = user;

        res.locals.admin = user;

        next();

    } catch (error) {

        console.log("ADMIN AUTH ERROR:", error);

        return res.redirect("/auth/login");
    }
};

module.exports = AdminAuth;