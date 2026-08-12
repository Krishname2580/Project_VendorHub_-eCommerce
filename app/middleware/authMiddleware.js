const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/auth/login");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).populate("role");

        if (!user) {
            return res.redirect("/auth/login");
        }

        req.user = user;

        res.locals.admin = user;
        next();

    } catch (error) {

        console.log(error);

        return res.redirect("/auth/login");

    }

};

module.exports = authMiddleware;