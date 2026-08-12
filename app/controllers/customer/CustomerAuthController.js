const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../../models/User");
const Role = require("../../models/Role");

const sendMail = require("../../utils/sendMail");

class CustomerAuthController {

    // ===========================
    // Register Page
    // ===========================

    async registerPage(req, res) {

        try {

            return res.render("customer/auth/register", {

                title: "Customer Register"

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ===========================
    // Register Customer
    // ===========================

    async register(req, res) {

        try {

            const {

                name,

                email,

                phone,

                password,

                confirmPassword

            } = req.body;

            if (password !== confirmPassword) {

                return res.render("customer/auth/register", {

                    title: "Register",

                    message: "Passwords do not match."

                });

            }

            const existingUser = await User.findOne({

                $or: [

                    { email },

                    { phone }

                ]

            });

            if (existingUser) {

                return res.render("customer/auth/register", {

                    title: "Register",

                    message: "Email or Phone already exists."

                });

            }

            const customerRole = await Role.findOne({

                roleName: "Customer"

            });

            if (!customerRole) {

                return res.render("customer/auth/register", {

                    title: "Register",

                    message: "Customer role not found."

                });

            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const verificationToken = crypto.randomBytes(32).toString("hex");

            await User.create({

                role: customerRole._id,

                name,

                email,

                phone,

                password: hashedPassword,

                isVerified: false,

                verificationToken

            });

            const verifyLink = `http://localhost:${process.env.PORT}/customer/verify-email/${verificationToken}`;

            await sendMail.sendMail(

                email,

                "Verify Your Account",

                `
    <h2>Welcome to VendorHub</h2>

    <p>Please click below to verify your account.</p>

    <a href="${verifyLink}">
        Verify Email
    </a>
    `

            );

            return res.render("customer/auth/login", {

                title: "Login",

                success: "Registration successful. Please verify your email."

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ===========================
    // Verify Email
    // ===========================

    async verifyEmail(req, res) {

        try {

            const user = await User.findOne({

                verificationToken: req.params.token

            });

            if (!user) {

                return res.send("Invalid verification link.");

            }

            user.isVerified = true;

            user.verificationToken = "";

            await user.save();

            return res.render("customer/auth/verifySuccess", {

                title: "Verified"

            });

        } catch (error) {

            console.log(error);

        }

    }

    // ===========================
    // Login Page
    // ===========================

    async loginPage(req, res) {

        return res.render("customer/auth/login", {

            title: "Customer Login"

        });

    }

    // ===========================
    // Login
    // ===========================

    // async login(req, res) {

    //     try {

    //         const {

    //             email,

    //             password

    //         } = req.body;

    //         const customerRole = await Role.findOne({

    //             roleName: "Customer"

    //         });

    //         const user = await User.findOne({

    //             email,

    //             role: customerRole._id

    //         }).populate("role");

    //         if (!user) {

    //             return res.render("customer/auth/login", {

    //                 title: "Login",

    //                 message: "Invalid Email."

    //             });

    //         }

    //         const match = await bcrypt.compare(

    //             password,

    //             user.password

    //         );

    //         if (!match) {

    //             return res.render("customer/auth/login", {

    //                 title: "Login",

    //                 message: "Invalid Password."

    //             });

    //         }

    //         if (!user.isVerified) {

    //             return res.render("customer/auth/login", {

    //                 title: "Login",

    //                 message: "Please verify your email."

    //             });

    //         }

    //         req.session.customer = user;

    //         req.session.save((err) => {

    //             if (err) {
    //                 console.log(err);
    //                 return res.redirect("/customer/login");
    //             }

    //             return res.redirect("/");

    //         });

    //     } catch (error) {

    //         console.log(error);

    //     }

    // }

    async login(req, res) {

        try {

            const { email, password } = req.body;

            const customerRole = await Role.findOne({ roleName: "Customer" });

            const user = await User.findOne({
                email,
                role: customerRole._id
            }).populate("role");

            if (!user) {
                return res.render("customer/auth/login", {
                    title: "Login",
                    message: "Invalid Email."
                });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.render("customer/auth/login", {
                    title: "Login",
                    message: "Invalid Password."
                });
            }

            if (!user.isVerified) {
                return res.render("customer/auth/login", {
                    title: "Login",
                    message: "Please verify your email."
                });
            }

            req.session.customer = user;

            req.session.save((err) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/customer/login");
                }

                return res.redirect("/"); 
            });

        } catch (error) {
            console.log(error);
        }

    }

     async dashboard(req, res) {

        try {

            return res.render("customer/dashboard", {
                title: "My Dashboard",
                user: req.session.customer
            });

        } catch (error) {
            console.log(error);
        }

    }
    // ===========================
    // Logout
    // ===========================

   async logout(req, res) {

    try {

        req.session.destroy((error) => {

            if (error) {

                console.log(
                    "CUSTOMER LOGOUT ERROR:",
                    error
                );

                return res.redirect("/");
            }

            res.clearCookie("connect.sid");

            return res.redirect("/");

        });

    } catch (error) {

        console.log(
            "CUSTOMER LOGOUT ERROR:",
            error
        );

        return res.redirect("/");

    }

}

    async forgotPasswordPage(req, res) {

        return res.render("customer/auth/forgotPassword", {

            title: "Forgot Password"

        });

    }

    async forgotPassword(req, res) {

        try {

            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {

                return res.render("customer/auth/forgotPassword", {

                    title: "Forgot Password",

                    message: "Email not found."

                });

            }

            const resetToken = crypto.randomBytes(32).toString("hex");

            user.resetPasswordToken = resetToken;

            user.resetPasswordExpire = Date.now() + 1000 * 60 * 30;

            await user.save();

            const resetLink = `${req.protocol}://${req.get("host")}/customer/reset-password/${resetToken}`;

            await sendMail(

                user.email,

                "VendorHub Password Reset",

                `
            <h2>Password Reset Request</h2>

            <p>Click the button below to reset your password.</p>

            <a href="${resetLink}"
               style="
                    background:#2563eb;
                    color:#fff;
                    padding:12px 25px;
                    text-decoration:none;
                    border-radius:8px;
               ">

               Reset Password

            </a>

            <br><br>

            <small>This link expires in 30 minutes.</small>
            `
            );

            return res.render("customer/auth/forgotPassword", {

                title: "Forgot Password",

                success: "Password reset link sent successfully."

            });

        } catch (error) {

            console.log(error);

        }

    }

    async resetPasswordPage(req, res) {

        try {

            const user = await User.findOne({

                resetPasswordToken: req.params.token,

                resetPasswordExpire: { $gt: Date.now() }

            });

            if (!user) {

                return res.send("Reset link expired.");

            }

            return res.render("customer/auth/resetPassword", {

                title: "Reset Password"

            });

        } catch (error) {

            console.log(error);

        }

    }

    async resetPassword(req, res) {

        try {

            const {

                password,

                confirmPassword

            } = req.body;

            if (password !== confirmPassword) {

                return res.render("customer/auth/resetPassword", {

                    title: "Reset Password",

                    message: "Passwords do not match."

                });

            }

            const user = await User.findOne({

                resetPasswordToken: req.params.token,

                resetPasswordExpire: {

                    $gt: Date.now()

                }

            });

            if (!user) {

                return res.send("Invalid or expired reset link.");

            }

            user.password = await bcrypt.hash(password, 10);

            user.resetPasswordToken = undefined;

            user.resetPasswordExpire = undefined;

            await user.save();

            return res.render("customer/auth/login", {

                title: "Login",

                success: "Password reset successfully. Please login."

            });

        } catch (error) {

            console.log(error);

        }

    }

}

module.exports = new CustomerAuthController();