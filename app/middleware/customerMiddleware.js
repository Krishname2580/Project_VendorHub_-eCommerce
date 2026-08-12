// const User = require("../models/User");

// class CustomerMiddleware {

//     async check(req, res, next) {

//         try {

//             const user = await User.findById(req.user.id)
//                 .populate("role");

//             if (!user) {

//                 return res.redirect("/auth/login");

//             }

//             if (user.role.roleName !== "Customer") {

//                 return res.send("Access Denied");

//             }
//             exports.isLoggedIn = (req, res, next) => {
//                 if (req.session && req.session.customer) {
//                     return next();
//                 }
//                 res.redirect('/customer/login');
//             };


//             next();

//         } catch (error) {

//             console.log(error);

//         }

//     }

// }

// module.exports = new CustomerMiddleware();



exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.customer) {
    return next();
  }
  res.redirect('/customer/login');
};
