require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const path = require('path')
const dbConnection = require('./app/config/dbCon')
const cors = require('cors')
const session = require("express-session");

const cookieParser = require("cookie-parser");

const notificationMiddleware = require("./app/middleware/notificationMiddleware");
const messageMiddleware = require("./app/middleware/messageMiddleware");
const injectCustomer = require('./app/middleware/injectCustomer');


const app = express()
dbConnection()

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());
app.use(session({
    secret: "vendorhub",
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.customer = req.session.customer;
    next();

});
app.use(express.static('public'))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//corse middleware
app.use(cors())
app.use((req, res, next) => {
    res.locals.req = req;
    next();
});


app.use(notificationMiddleware);
app.use(messageMiddleware);
app.use(injectCustomer);
// auth
const authRoute = require('./app/routes/auth/authRoute')
app.use('/auth', authRoute);

// admin
const dashboardRoute = require('./app/routes/admin/adminDashboardRoute')
app.use('/admin', dashboardRoute);

const adminVendorRoute = require("./app/routes/admin/adminVendorRoute");
app.use("/admin", adminVendorRoute);

const categoryRoute = require('./app/routes/admin/adminCategoryRoute')
app.use('/admin', categoryRoute);

const adminProductRoute = require('./app/routes/admin/adminProductRoute')
app.use('/admin', adminProductRoute);

const adminProfileRoute = require('./app/routes/admin/adminProfileRoute')
app.use('/admin', adminProfileRoute);

const brandRoute = require('./app/routes/admin/adminBrandRoute')
app.use('/admin', brandRoute);

const customerRoute = require('./app/routes/admin/adminCustomerRoute')
app.use('/admin', customerRoute);

const adminOrderRoute = require('./app/routes/admin/adminOrderRoute')
app.use('/admin', adminOrderRoute);


const couponRoute = require('./app/routes/admin/adminCouponRoute')
app.use('/admin', couponRoute);

const adminReportRoute = require('./app/routes/admin/adminReportRoute')
app.use('/admin', adminReportRoute);

const adminNotificationRoute = require('./app/routes/admin/adminNotificationRoute')
app.use('/admin', adminNotificationRoute);

const adminSettingRoute = require('./app/routes/admin/adminSettingRoute')
app.use('/admin', adminSettingRoute);


const adminStoreRoute = require("./app/routes/admin/adminStoreRoute");
app.use("/admin", adminStoreRoute);

// vendor----------------------------------------------------

const vendorDashboardRoute = require("./app/routes/vendor/vendorDashboardRoute");
app.use("/vendor", vendorDashboardRoute);

const vendorProfileRoute = require("./app/routes/vendor/vendorProfileRoute");
app.use("/vendor", vendorProfileRoute);

const vendorStoreRoute = require("./app/routes/vendor/vendorStoreRoute");
app.use("/vendor", vendorStoreRoute);

const vendorProductRoute = require("./app/routes/vendor/vendorProductRoute");
app.use("/vendor", vendorProductRoute);

const vendorOrderRoute = require("./app/routes/vendor/vendorOrderRoute");
app.use("/vendor", vendorOrderRoute);

const vendorReportRoute = require("./app/routes/vendor/vendorReportRoute");
app.use("/vendor", vendorReportRoute);

const vendorNotificationRoute = require("./app/routes/vendor/vendorNotificationRoute");
app.use("/vendor", vendorNotificationRoute);

const vendorMessageRoute = require("./app/routes/vendor/vendorMessageRoute");
app.use("/vendor", vendorMessageRoute);

const AIProductRoute = require("./app/routes/vendor/AIProductRoute.js");
app.use("/vendor/ai", AIProductRoute);


// Customer-----------------------------------------------------

const customerAuthRoute = require("./app/routes/customer/customerAuthRoute");
app.use("/customer", customerAuthRoute);

const customerHomeRoute = require("./app/routes/customer/customerHomeRoute");
app.use("/", customerHomeRoute);

const customerShopRoute = require("./app/routes/customer/customerShopRoute");
app.use("/", customerShopRoute);

const customerProductRoute = require("./app/routes/customer/customerProductRoute");
app.use("/customer", customerProductRoute);

const customerCartRoute = require("./app/routes/customer/customerCartRoute");
app.use("/customer", customerCartRoute);

const customerAddressRoute = require("./app/routes/customer/customerAddressRoute");
app.use("/customer", customerAddressRoute);

const customerCheckoutRoute = require("./app/routes/customer/customerCheckoutRoute");
app.use("/customer", customerCheckoutRoute);

const customerOrderRoute = require("./app/routes/customer/customerOrderRoute");
app.use("/customer", customerOrderRoute);

const customerWishlistRoute = require("./app/routes/customer/customerWishlistRoute");
app.use("/customer", customerWishlistRoute);

const PORT = process.env.PORT || 5006;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});




