const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

const vendorAuthMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.vendorToken;

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
            user.role.roleName !== "Vendor"
        ) {
            return res.status(403).send("Access Denied");
        }

        const vendor = await Vendor.findOne({
            user: user._id
        });

        if (!vendor) {
            return res.status(403).send(
                "Vendor profile not found."
            );
        }

        req.user = user;

        req.vendor = vendor;

        res.locals.vendor = vendor;

        next();

    } catch (error) {

        console.log("VENDOR AUTH ERROR:", error);

        return res.redirect("/auth/login");

    }

};

module.exports = vendorAuthMiddleware;