const mongoose = require("mongoose");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

class VendorDashboardController {

    // =========================================
    // VENDOR DASHBOARD
    // =========================================

    async dashboard(req, res) {

        try {

            // =========================================
            // GET VENDOR FROM JWT MIDDLEWARE
            // =========================================

            const vendor = req.vendor;

            if (!vendor) {

                return res.redirect("/auth/login");

            }

            const vendorId = new mongoose.Types.ObjectId(
                vendor._id
            );


            // =========================================
            // VENDOR ORDERS
            // =========================================

            const orders = await Order.find({

                "items.vendor": vendorId

            }).lean();


            // =========================================
            // ORDER SUMMARY
            // =========================================

            let totalSales = 0;

            const totalOrders = orders.length;

            let pendingOrders = 0;
            let confirmedOrders = 0;
            let packedOrders = 0;
            let shippedOrders = 0;
            let deliveredOrders = 0;
            let cancelledOrders = 0;
            let returnedOrders = 0;


            // =========================================
            // CALCULATE SALES + STATUS
            // =========================================

            orders.forEach(order => {

                // Vendor items

                order.items.forEach(item => {

                    if (
                        item.vendor &&
                        item.vendor.toString() ===
                        vendorId.toString()
                    ) {

                        totalSales += Number(
                            item.total || 0
                        );

                    }

                });


                // Order status

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

            });


            // =========================================
            // VENDOR PRODUCTS
            // =========================================

            const totalProducts =
                await Product.countDocuments({

                    vendor: vendorId

                });


            // =========================================
            // MONTHLY SALES
            // =========================================

            const monthlySales =
                await Order.aggregate([

                    {
                        $unwind: "$items"
                    },

                    {
                        $match: {

                            "items.vendor": vendorId

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


            // =========================================
            // MONTH NAMES
            // =========================================

            const monthNames = [

                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"

            ];


            // =========================================
            // LAST 12 MONTHS
            // =========================================

            const currentDate = new Date();

            const salesLabels = [];

            const salesData = [];


            for (let i = 11; i >= 0; i--) {

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
                    monthlySales.find(item => {

                        return (

                            item._id.year === year &&

                            item._id.month === month

                        );

                    });


                salesLabels.push(

                    `${monthNames[month - 1]} ${year}`

                );


                salesData.push(

                    found
                        ? Number(found.totalSales || 0)
                        : 0

                );

            }


           

            // =========================================
            // RENDER DASHBOARD
            // =========================================

            return res.render(
                "vendor/dashboard/index",
                {

                    title: "Vendor Dashboard",

                    vendor,

                    totalSales,

                    totalOrders,

                    totalProducts,

                    pendingOrders,

                    confirmedOrders,

                    packedOrders,

                    shippedOrders,

                    deliveredOrders,

                    cancelledOrders,

                    returnedOrders,

                    salesLabels,

                    salesData

                }
            );


        } catch (error) {

            console.log(
                "VENDOR DASHBOARD ERROR:",
                error
            );

            return res.redirect(
                "/vendor/dashboard"
            );

        }

    }

}


module.exports = new VendorDashboardController();