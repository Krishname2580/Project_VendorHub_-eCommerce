const User = require("../../models/User");
const Role = require("../../models/Role");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const sendMail = require("../../utils/sendMail");
const generateToken = require("../../utils/generateToken");
const Vendor = require("../../models/Vendor");
class AuthController {

    // ================= Register Page =================

    async registerPage(req, res) {

        try {

            const roles = await Role.find({
                roleName: {
                    $in: ["Vendor", "Customer"]
                }
            });

            return res.render("auth/register", {
                roles
            });

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Login Page =================

    async loginPage(req, res) {

        try {

            return res.render("auth/login");

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Register =================

    async register(req, res) {

        try {

            const {
                name,
                email,
                phone,
                password,
                confirmPassword,
                role
            } = req.body;

            const roles = await Role.find({
                roleName: {
                    $in: ["Vendor", "Customer"]
                }
            });

            const existUser = await User.findOne({ email });

            if (existUser) {

                return res.render("auth/register", {
                    roles,
                    error: "Email already exists.",
                    success: null
                });

            }

            if (password !== confirmPassword) {

                return res.render("auth/register", {
                    roles,
                    error: "Password and Confirm Password do not match.",
                    success: null
                });

            }

            const roleData = await Role.findById(role);

            if (!roleData) {

                return res.render("auth/register", {
                    roles,
                    error: "Role not found.",
                    success: null
                });

            }

            const hashPassword = await bcrypt.hash(password, 10);

            const verificationToken = crypto.randomBytes(32).toString("hex");

            // Create User
            const user = await User.create({

                role: roleData._id,

                name,

                email,

                phone,

                password: hashPassword,

                verificationToken

            });

            // Create Vendor (Only if Vendor Role)
            if (roleData.roleName === "Vendor") {

                await Vendor.create({

                    user: user._id,

                    approvalStatus: "Pending"

                });

            }

            const verifyLink = `http://localhost:${process.env.PORT}/auth/verify/${verificationToken}`;

            await sendMail.sendMail(

                email,

                "Verify Your Account",

                `
            <h2>VendorHub Email Verification</h2>

            <p>Please click below link.</p>

            <a href="${verifyLink}">
                Verify Account
            </a>
            `

            );

            return res.redirect("/auth/login");

        } catch (error) {

            console.log(error);

        }

    }
    // ================= Verify Email =================

    async verifyEmail(req, res) {

        try {

            const { token } = req.params;

            const user = await User.findOne({
                verificationToken: token
            });

            if (!user) {

                return res.render("auth/login", {

                    error: "Invalid verification link."

                });

            }

            user.isVerified = true;
            user.verificationToken = null;

            await user.save();

            return res.redirect("/auth/login");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Login =================

    async login(req, res) {

    try {

        const { email, password } = req.body;

        // ===============================
        // Find User
        // ===============================

        const user = await User.findOne({ email })
            .populate("role");

        if (!user) {

            return res.render("auth/login", {
                error: "Invalid Email"
            });

        }


        // ===============================
        // Email Verification
        // ===============================

        if (!user.isVerified) {

            return res.render("auth/login", {
                error: "Please verify your email."
            });

        }


        // ===============================
        // Password Check
        // ===============================

        const checkPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!checkPassword) {

            return res.render("auth/login", {
                error: "Invalid Password"
            });

        }


        // ===============================
        // Account Status
        // ===============================

        if (!user.status) {

            return res.render("auth/login", {
                error: "Your account is inactive."
            });

        }


        // ===============================
        // Block User Check
        // ===============================

        if (user.isBlocked) {

            return res.render("auth/login", {
                error: "Your account has been blocked."
            });

        }


        // ===============================
        // Vendor Approval Check
        // ===============================

        let vendor = null;

        if (user.role.roleName === "Vendor") {

            vendor = await Vendor.findOne({
                user: user._id
            });

            if (!vendor) {

                return res.render("auth/login", {
                    error: "Vendor profile not found."
                });

            }


            if (vendor.approvalStatus === "Pending") {

                return res.render("auth/login", {
                    error:
                        "Your vendor account is waiting for admin approval."
                });

            }


            if (vendor.approvalStatus === "Rejected") {

                return res.render("auth/login", {
                    error:
                        "Your vendor account has been rejected."
                });

            }


            if (vendor.approvalStatus !== "Approved") {

                return res.render("auth/login", {
                    error:
                        "Your vendor account is not approved."
                });

            }

        }


        // ===============================
        // Generate Token
        // ===============================

       const token = generateToken({
    id: user._id,
    role: user.role.roleName
});

const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

if (user.role.roleName === "Super Admin") {

    res.cookie("adminToken", token, cookieOptions);

    return res.redirect("/admin/dashboard");
}

if (user.role.roleName === "Vendor") {

    res.cookie("vendorToken", token, cookieOptions);

    return res.redirect("/vendor/dashboard");
}

if (user.role.roleName === "Customer") {

    res.cookie("customerToken", token, cookieOptions);

    return res.redirect("/");

}
    } catch (error) {

        console.log("LOGIN ERROR:", error);

        return res.render("auth/login", {

            error: "Something went wrong."

        });

    }

}


    // ================= Logout =================

   // ================= Logout =================

async logout(req, res) {
    try {

        res.clearCookie("adminToken");
        res.clearCookie("vendorToken");
        res.clearCookie("customerToken");

        return res.redirect("/auth/login");

    } catch (error) {

        console.log("LOGOUT ERROR:", error);

        return res.redirect("/auth/login");
    }
}

    // ================= Forgot Password Page =================

    async forgotPasswordPage(req, res) {

        try {

            return res.render("auth/forgotPassword");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Forgot Password =================

    async forgotPassword(req, res) {

        try {

            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {

                return res.render("auth/forgotPassword", {

                    error: "Email not found."

                });

            }

            const resetToken =
                crypto.randomBytes(32).toString("hex");

            user.resetPasswordToken = resetToken;

            user.resetPasswordExpire =
                Date.now() + 1000 * 60 * 30;

            await user.save();

            const resetLink =
                `http://localhost:${process.env.PORT}/auth/reset-password/${resetToken}`;

            await sendMail(

                email,

                "Reset Password",

                `
            <h2>Reset Password</h2>

            <a href="${resetLink}">
            Reset Password
            </a>
            `

            );

            return res.redirect("/auth/login");

        } catch (error) {

            console.log(error);

        }

    }

    // ================= Reset Password Page =================

    async resetPasswordPage(req, res) {

        try {

            return res.render("auth/resetPassword", {

                token: req.params.token

            });

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Reset Password =================

    async resetPassword(req, res) {

        try {

            const { token } = req.params;

            const { password } = req.body;

            const user = await User.findOne({

                resetPasswordToken: token,

                resetPasswordExpire: {

                    $gt: Date.now()

                }

            });

            if (!user) {

                return res.send("Reset link expired.");

            }

            const hashPassword =
                await bcrypt.hash(password, 10);

            user.password = hashPassword;

            user.resetPasswordToken = null;

            user.resetPasswordExpire = null;

            await user.save();

            return res.redirect("/auth/login");

        } catch (error) {

            console.log(error);

        }

    }


    // ================= Change Password =================

    async changePassword(req, res) {

        try {

            const {

                oldPassword,

                newPassword

            } = req.body;

            const user = await User.findById(req.user.id);

            const match =
                await bcrypt.compare(

                    oldPassword,

                    user.password

                );

            if (!match) {

                return res.send("Old password is incorrect.");

            }

            user.password =
                await bcrypt.hash(newPassword, 10);

            await user.save();

            return res.redirect("/profile");

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new AuthController();