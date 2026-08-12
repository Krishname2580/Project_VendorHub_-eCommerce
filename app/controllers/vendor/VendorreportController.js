const mongoose = require("mongoose");
const Vendor = require("../../models/Vendor");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem");

class VendorReportController {

    // Dashboard Report


    async dashboard(req, res) {

        try {
            const vendor = req.vendor;

            if (!vendor) {

                return res.redirect("/auth/login");

            }

            const vendorId = new mongoose.Types.ObjectId(
                vendor._id
            );


            // =====================================================
            // GET ALL ORDERS OF THIS VENDOR
            // =====================================================

            const orders = await Order.find({
                "items.vendor": vendorId
            })
                .populate("customer")
                .populate("items.product")
                .sort({
                    createdAt: -1
                })
                .lean();


            console.log(
                "VENDOR ORDERS:",
                orders.length
            );


            // =====================================================
            // TOTAL PRODUCTS
            // =====================================================

            const totalProducts =
                await Product.countDocuments({
                    vendor: vendorId
                });


            // =====================================================
            // VARIABLES
            // =====================================================

            let totalOrders = orders.length;

            let totalSales = 0;

            let totalQuantity = 0;


            let pendingOrders = 0;

            let confirmedOrders = 0;

            let packedOrders = 0;

            let shippedOrders = 0;

            let deliveredOrders = 0;

            let cancelledOrders = 0;

            let returnedOrders = 0;


            // =====================================================
            // PROCESS ORDERS
            // =====================================================

            orders.forEach(order => {

                // -----------------------------------------------
                // ORDER STATUS
                // -----------------------------------------------

                switch (order.orderStatus) {

                    case "Pending":

                        pendingOrders++;

                        break;


                    case "Confirmed":

                        confirmedOrders++;

                        break;


                    case "Packed":

                        packedOrders++;

                        break;


                    case "Shipped":

                        shippedOrders++;

                        break;


                    case "Delivered":

                        deliveredOrders++;

                        break;


                    case "Cancelled":

                        cancelledOrders++;

                        break;


                    case "Returned":

                        returnedOrders++;

                        break;

                }


                // -----------------------------------------------
                // VENDOR ITEMS
                // -----------------------------------------------

                order.items.forEach(item => {

                    if (
                        item.vendor &&
                        item.vendor.toString() ===
                        vendorId.toString()
                    ) {

                        const quantity =
                            Number(item.quantity || 0);

                        const total =
                            Number(item.total || 0);


                        totalQuantity += quantity;


                        // Count sales from delivered orders
                        if (
                            order.orderStatus ===
                            "Delivered"
                        ) {

                            totalSales += total;

                        }

                    }

                });

            });


            // =====================================================
            // MONTHLY SALES
            // LAST 12 MONTHS
            // =====================================================

            const monthlySales = await Order.aggregate([

                {
                    $unwind: "$items"
                },


                {
                    $match: {

                        "items.vendor": vendorId,

                        orderStatus: "Delivered"

                    }
                },


                {
                    $group: {

                        _id: {

                            year: {
                                $year: "$createdAt"
                            },

                            month: {
                                $month: "$createdAt"
                            }

                        },


                        totalSales: {

                            $sum: {

                                $ifNull: [
                                    "$items.total",
                                    0
                                ]

                            }

                        }

                    }

                },


                {
                    $sort: {

                        "_id.year": 1,

                        "_id.month": 1

                    }

                }

            ]);


            console.log(
                "MONTHLY SALES:",
                monthlySales
            );


            // =====================================================
            // CREATE LAST 12 MONTHS
            // =====================================================

            const monthNames = [

                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"

            ];


            const currentDate = new Date();


            const salesLabels = [];

            const salesData = [];


            for (
                let i = 11;
                i >= 0;
                i--
            ) {

                const date = new Date(

                    currentDate.getFullYear(),

                    currentDate.getMonth() - i,

                    1

                );


                const year =
                    date.getFullYear();


                const month =
                    date.getMonth() + 1;


                const found =
                    monthlySales.find(item =>

                        item._id.year === year &&
                        item._id.month === month

                    );


                salesLabels.push(

                    `${monthNames[month - 1]} ${year}`

                );


                salesData.push(

                    found
                        ? Number(found.totalSales)
                        : 0

                );

            }


            console.log(
                "SALES LABELS:",
                salesLabels
            );


            console.log(
                "SALES DATA:",
                salesData
            );


            // =====================================================
            // ORDER SUMMARY DATA
            // =====================================================

            const orderSummary = [

                pendingOrders,

                confirmedOrders,

                packedOrders,

                shippedOrders,

                deliveredOrders,

                cancelledOrders,

                returnedOrders

            ];


            console.log(
                "ORDER SUMMARY:",
                orderSummary
            );


            // =====================================================
            // RENDER
            // =====================================================

            return res.render(
                "vendor/report/dashboard",
                {

                    title:
                        "Vendor Reports",

                    vendor,

                    totalProducts,

                    totalOrders,

                    totalSales,

                    totalQuantity,


                    pendingOrders,

                    confirmedOrders,

                    packedOrders,

                    shippedOrders,

                    deliveredOrders,

                    cancelledOrders,

                    returnedOrders,


                    salesLabels,

                    salesData,

                    orderSummary

                }
            );


        } catch (error) {

            console.log(
                "======================================"
            );

            console.log(
                "VENDOR REPORT ERROR:",
                error
            );

            console.log(
                "======================================"
            );


            return res.redirect(
                "/vendor/dashboard"
            );

        }

    }

    // Sales Report

    async sales(req, res) {

        try {

            const vendor = await Vendor.findOne({
                user: req.user._id
            });

            const sales = await OrderItem.find({

                vendor: vendor._id

            })

                .populate("product")

                .populate({

                    path: "order",

                    populate: {

                        path: "customer"

                    }

                })

                .sort({

                    createdAt: -1

                });

            return res.render("vendor/report/sales", {

                vendor,

                sales

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Orders Report

    async orders(req, res) {

        try {

            const vendor = await Vendor.findOne({

                user: req.user._id

            });

            const orders = await OrderItem.find({

                vendor: vendor._id

            })

                .populate("product")

                .populate({

                    path: "order",

                    populate: {

                        path: "customer"

                    }

                })

                .sort({

                    createdAt: -1

                });

            return res.render("vendor/report/orders", {

                vendor,

                orders

            });

        } catch (error) {

            console.log(error);

        }

    }

    // Product Report

    async products(req, res) {

        try {

            const vendor = await Vendor.findOne({

                user: req.user._id

            });

            const products = await Product.find({

                vendor: vendor._id

            })

                .populate("category")

                .populate("brand")

                .sort({

                    createdAt: -1

                });

            return res.render("vendor/report/products", {

                vendor,

                products

            });

        } catch (error) {

            console.log(error);

        }

    }

    async sales(req, res) {

        try {

            // ==============================
            // CHECK VENDOR SESSION
            // ==============================

            const vendor = req.vendor;

            if (!vendor) {
                return res.redirect("/auth/login");
            }

            const vendorId = vendor._id;


            // ==============================
            // GET ORDERS
            // ==============================

            const orders = await Order.find({
                "items.vendor": vendorId
            })
                .populate("customer")
                .populate("items.product")
                .sort({ createdAt: -1 })
                .lean();


            // ==============================
            // CREATE SALES ARRAY
            // ==============================

            const sales = [];


            orders.forEach(order => {

                if (!order.items) {
                    return;
                }


                order.items.forEach(item => {

                    // Only this vendor's products

                    if (
                        item.vendor &&
                        item.vendor.toString() ===
                        vendorId.toString()
                    ) {

                        const quantity =
                            Number(item.quantity || 0);

                        const price =
                            Number(item.price || 0);

                        const total =
                            Number(
                                item.total ||
                                (quantity * price)
                            );


                        sales.push({

                            order: order,

                            product: item.product,

                            quantity: quantity,

                            price: price,

                            total: total,

                            createdAt: order.createdAt

                        });

                    }

                });

            });


            // ==============================
            // TOTAL SALES
            // ==============================

            const totalSales = sales.reduce(
                (sum, sale) =>
                    sum + Number(sale.total || 0),
                0
            );


            // ==============================
            // TOTAL QUANTITY
            // ==============================

            const totalQuantity = sales.reduce(
                (sum, sale) =>
                    sum + Number(sale.quantity || 0),
                0
            );


            // ==============================
            // RENDER
            // ==============================

            return res.render(
                "vendor/report/sales",
                {

                    title: "Sales Report",

                    vendor,

                    sales,

                    totalSales,

                    totalQuantity

                }
            );


        } catch (error) {

            console.log(
                "VENDOR SALES REPORT ERROR:",
                error
            );

            return res.redirect(
                "/vendor/report/dashboard"
            );

        }

    }

    // =========================================
    // ORDERS REPORT
    // =========================================

    async orders(req, res) {

        try {

            const vendor = req.vendor;

            // Check vendor login
            if (!vendor) {
                return res.redirect("/auth/login");
            }

            const vendorId = vendor._id;

            // Get orders containing this vendor's products
            const orders = await Order.find({
                "items.vendor": vendorId
            })
                .populate("customer")
                .populate("items.product")
                .sort({ createdAt: -1 })
                .lean();


            // Keep only this vendor's items
            const vendorOrders = orders.map(order => {

                const vendorItems = order.items.filter(item => {

                    return (
                        item.vendor &&
                        item.vendor.toString() ===
                        vendorId.toString()
                    );

                });

                return {
                    ...order,
                    items: vendorItems
                };

            });


            return res.render(
                "vendor/report/orders",
                {

                    title: "Orders Report",

                    vendor,

                    orders: vendorOrders

                }
            );


        } catch (error) {

            console.log(
                "VENDOR ORDERS REPORT ERROR:",
                error
            );

            return res.redirect(
                "/vendor/report/dashboard"
            );

        }

    }

    // =========================================
    // PRODUCTS REPORT
    // =========================================

    async products(req, res) {

        try {

            const vendor = req.vendor;

            // Check vendor login
            if (!vendor) {
                return res.redirect("/auth/login");
            }

            const vendorId = vendor._id;


            // Get vendor products
            const products = await Product.find({
                vendor: vendorId
            })
                .sort({ createdAt: -1 })
                .lean();


            // Calculate sales information
            const orders = await Order.find({
                "items.vendor": vendorId
            })
                .lean();


            const productStats = {};


            orders.forEach(order => {

                if (!order.items) {
                    return;
                }


                order.items.forEach(item => {

                    if (
                        item.vendor &&
                        item.vendor.toString() ===
                        vendorId.toString()
                    ) {

                        const productId =
                            item.product
                                ? item.product.toString()
                                : null;


                        if (!productId) {
                            return;
                        }


                        if (!productStats[productId]) {

                            productStats[productId] = {

                                quantity: 0,

                                sales: 0

                            };

                        }


                        productStats[productId].quantity +=
                            Number(item.quantity || 0);


                        productStats[productId].sales +=
                            Number(item.total || 0);

                    }

                });

            });


            // Add sales information to products
            const productReport = products.map(product => {

                const stats =
                    productStats[product._id.toString()] || {

                        quantity: 0,

                        sales: 0

                    };


                return {

                    ...product,

                    quantitySold: stats.quantity,

                    totalSales: stats.sales

                };

            });


            return res.render(
                "vendor/report/products",
                {

                    title: "Products Report",

                    vendor,

                    products: productReport

                }
            );


        } catch (error) {

            console.log(
                "VENDOR PRODUCTS REPORT ERROR:",
                error
            );

            return res.redirect(
                "/vendor/report/dashboard"
            );

        }

    }


}

module.exports = new VendorReportController();