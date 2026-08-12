const User = require("../../models/User");
const Role = require("../../models/Role");
const Vendor = require("../../models/Vendor");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const Order = require("../../models/Order");

class DashboardController {

    async dashboard(req, res) {

        try {

            // ==========================================
            // ROLES
            // ==========================================

            const vendorRole = await Role.findOne({
                roleName: "Vendor"
            });

            const customerRole = await Role.findOne({
                roleName: "Customer"
            });


            // ==========================================
            // DASHBOARD COUNTS
            // ==========================================

            const totalVendors = vendorRole
                ? await User.countDocuments({
                    role: vendorRole._id
                })
                : 0;

            const totalCustomers = customerRole
                ? await User.countDocuments({
                    role: customerRole._id
                })
                : 0;

            const totalProducts = await Product.countDocuments();

            const totalCategories = await Category.countDocuments();

            const totalBrands = await Brand.countDocuments();

            const totalOrders = await Order.countDocuments();

            const pendingVendors = await Vendor.countDocuments({
                approvalStatus: "Pending"
            });


            // ==========================================
            // REVENUE
            // ==========================================

            const revenue = await Order.aggregate([
                {
                    $match: {
                        orderStatus: {
                            $in: [
                                "Confirmed",
                                "Packed",
                                "Shipped",
                                "Delivered"
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]);

            const totalRevenue = revenue.length
                ? revenue[0].totalRevenue
                : 0;


            // ==========================================
            // LATEST VENDORS
            // ==========================================

            const vendors = await Vendor.find()
                .populate("user")
                .sort({
                    createdAt: -1
                });


            // ==========================================
            // LATEST ORDERS
            // ==========================================

            const latestOrders = await Order.find()
                .populate("customer")
                .populate("items.product")
                .sort({
                    createdAt: -1
                })
                .limit(6);


            // ==========================================
            // MONTHLY ORDERS
            // ==========================================

            const monthlyOrders = await Order.aggregate([

                {
                    $match: {
                        orderStatus: {
                            $in: [
                                "Confirmed",
                                "Packed",
                                "Shipped",
                                "Delivered"
                            ]
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            month: {
                                $month: "$createdAt"
                            }
                        },

                        totalOrders: {
                            $sum: 1
                        }
                    }
                },

                {
                    $sort: {
                        "_id.month": 1
                    }
                }

            ]);


            // ==========================================
            // CUSTOMER REGISTRATION
            // ==========================================

            const customerRegistration = customerRole
                ? await User.aggregate([

                    {
                        $match: {
                            role: customerRole._id
                        }
                    },

                    {
                        $group: {
                            _id: {
                                month: {
                                    $month: "$createdAt"
                                }
                            },

                            totalCustomers: {
                                $sum: 1
                            }
                        }
                    },

                    {
                        $sort: {
                            "_id.month": 1
                        }
                    }

                ])
                : [];


            // ==========================================
            // TOP SELLING PRODUCTS
            // ==========================================

            const topProducts = await Order.aggregate([

                {
                    $match: {
                        orderStatus: {
                            $in: [
                                "Confirmed",
                                "Packed",
                                "Shipped",
                                "Delivered"
                            ]
                        }
                    }
                },

                {
                    $unwind: "$items"
                },

                {
                    $group: {
                        _id: "$items.product",

                        name: {
                            $first: "$items.name"
                        },

                        sold: {
                            $sum: "$items.quantity"
                        },

                        sales: {
                            $sum: "$items.total"
                        }
                    }
                },

                {
                    $sort: {
                        sold: -1
                    }
                },

                {
                    $limit: 5
                }
            ]);


            // ==========================================
            // LOW STOCK PRODUCTS
            // ==========================================

            const lowStockProducts = await Product.find({
                stock: {
                    $lte: 5
                }
            })
                .sort({
                    stock: 1
                })
                .limit(5);


            // ==========================================
            // PENDING PRODUCTS
            // ==========================================

            const pendingProducts = await Product.countDocuments({
                status: "Pending"
            });


            // ==========================================
            // CATEGORY CHART
            // ==========================================

            const categoryChart = await Product.aggregate([

                {
                    $group: {
                        _id: "$category",

                        total: {
                            $sum: 1
                        }
                    }
                },

                {
                    $lookup: {
                        from: "categories",

                        localField: "_id",

                        foreignField: "_id",

                        as: "category"
                    }
                },

                {
                    $unwind: "$category"
                }

            ]);


            // ==========================================
            // PRODUCT SALES
            // ==========================================

            const productSales = await Order.aggregate([

                {
                    $match: {
                        orderStatus: {
                            $in: [
                                "Confirmed",
                                "Packed",
                                "Shipped",
                                "Delivered"
                            ]
                        }
                    }
                },

                {
                    $unwind: "$items"
                },

                {
                    $group: {
                        _id: "$items.product",

                        name: {
                            $first: "$items.name"
                        },

                        totalSold: {
                            $sum: "$items.quantity"
                        }
                    }
                },

                {
                    $sort: {
                        totalSold: -1
                    }
                },

                {
                    $limit: 10
                }

            ]);


            // ==========================================
            // ORDER SUMMARY
            // ==========================================

            const orderSummary = await Order.aggregate([
                {
                    $match: {
                        orderStatus: {
                            $in: [
                                "Confirmed",
                                "Packed",
                                "Shipped",
                                "Delivered"
                            ]
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },

                        totalOrders: {
                            $sum: 1
                        },

                        totalRevenue: {
                            $sum: "$totalAmount"
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


            // ==========================================
            // ONLINE ORDERS
            // Razorpay + Stripe
            // ==========================================

            const onlineOrders = await Order.countDocuments({
                paymentMethod: {
                    $in: [
                        "Razorpay",
                        "Stripe"
                    ]
                }
            });


            // ==========================================
            // OFFLINE ORDERS
            // Your schema does not have "Offline",
            // so keep this as 0.
            // ==========================================

            const offlineOrders = 0;


            // ==========================================
            // COD ORDERS
            // ==========================================

            const codOrders = await Order.countDocuments({
                paymentMethod: "COD"
            });


            // ==========================================
            // TOTAL ORDER COUNT
            // ==========================================

            const totalOrderCount = await Order.countDocuments();


            // ==========================================
            // ORDER PERCENTAGES
            // ==========================================

            const onlinePercent = totalOrderCount
                ? ((onlineOrders / totalOrderCount) * 100).toFixed(0)
                : 0;

            const offlinePercent = totalOrderCount
                ? ((offlineOrders / totalOrderCount) * 100).toFixed(0)
                : 0;

            const codPercent = totalOrderCount
                ? ((codOrders / totalOrderCount) * 100).toFixed(0)
                : 0;


            // ==========================================
            // CATEGORY LABELS / VALUES
            // ==========================================

            const labels = categoryChart.map(
                item => item.category.name
            );

            const values = categoryChart.map(
                item => item.total
            );


            // ==========================================
            // MONTHLY SALES
            // ==========================================

            const monthlySales = await Order.aggregate([
                {
                    $match: {
                        orderStatus: {
                            $in: [
                                "Confirmed",
                                "Packed",
                                "Shipped",
                                "Delivered"
                            ]
                        }
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
                            $sum: "$totalAmount"
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


            // ==========================================
            // ADMIN
            // ==========================================

            const admin = await User.findById(req.user.id);


            return res.render(
                "admin/dashboard/index",
                {

                    admin,

                    // Counts
                    totalVendors,
                    totalCustomers,
                    totalProducts,
                    totalCategories,
                    totalBrands,
                    totalOrders,

                    // Vendors / Products
                    pendingVendors,
                    pendingProducts,

                    // Revenue
                    totalRevenue,

                    // Charts
                    categoryChart,
                    monthlyOrders,
                    monthlySales,
                    customerRegistration,
                    topProducts,
                    productSales,
                    orderSummary,

                    // Products
                    lowStockProducts,

                    // Category chart
                    labels,
                    values,

                    // Latest data
                    vendors,
                    latestOrders,
                    latestVendors: await Vendor.find()
                        .populate("user")
                        .sort({
                            createdAt: -1
                        })
                        .limit(5),

                    // Payment orders
                    onlineOrders,
                    offlineOrders,
                    codOrders,

                    // Percentages
                    onlinePercent,
                    offlinePercent,
                    codPercent
                }
            );

        } catch (error) {

            console.log(
                "Dashboard Error:",
                error
            );

            return res.redirect("back");
        }

    }

}

module.exports = new DashboardController();