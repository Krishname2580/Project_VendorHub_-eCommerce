const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Vendor = require("../../models/Vendor");
const Role = require("../../models/Role");
const Payment = require("../../models/Payment");
const Coupon = require("../../models/Coupon");
const Offer = require("../../models/Offer");


class ReportController {


    // =====================================
    // Reports Dashboard
    // =====================================

    async dashboard(req,res){

        try {


            const customerRole = await Role.findOne({
                roleName:"Customer"
            });


            const totalSales = await Order.aggregate([

                {
                    $match:{
                        orderStatus:"Delivered"
                    }
                },

                {
                    $group:{
                        _id:null,
                        total:{
                            $sum:"$totalAmount"
                        }
                    }
                }

            ]);


            const data = {

                totalRevenue:
                    totalSales.length
                    ? totalSales[0].total
                    : 0,


                totalOrders:
                    await Order.countDocuments(),


                deliveredOrders:
                    await Order.countDocuments({
                        orderStatus:"Delivered"
                    }),


                pendingOrders:
                    await Order.countDocuments({
                        orderStatus:"Pending"
                    }),


                cancelledOrders:
                    await Order.countDocuments({
                        orderStatus:"Cancelled"
                    }),


                totalProducts:
                    await Product.countDocuments(),


                totalCustomers:
                    customerRole
                    ? await User.countDocuments({
                        role:customerRole._id
                    })
                    : 0,


                totalVendors:
                    await Vendor.countDocuments()


            };



            return res.render(
                "admin/reports/dashboard",
                {
                    ...data
                }
            );


        }
        catch(error){

            console.log(error);

            return res.redirect("back");

        }

    }





    // =====================================
    // Sales Report
    // =====================================


    async salesReport(req,res){

        try{


            const sales = await Order.find({

                orderStatus:"Delivered"

            })
            .populate("customer")
            .sort({
                createdAt:-1
            });



            return res.render(
                "admin/reports/sales",
                {
                    sales
                }
            );


        }
        catch(error){

            console.log(error);

        }

    }





    // =====================================
    // Order Report
    // =====================================


    async orderReport(req, res) {
    try {

        const orders = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",

                    totalOrders: {
                        $sum: 1
                    },

                    totalAmount: {
                        $sum: {
                            $toDouble: {
                                $ifNull: ["$totalAmount", 0]
                            }
                        }
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }
        ]);


        return res.render("admin/reports/orders", {
            title: "Order Report",
            admin: req.user,
            orders
        });

    } catch (error) {

        console.log("ORDER REPORT ERROR:", error);

        return res.redirect("/admin/reports/dashboard");
    }
}




    // =====================================
    // Product Report
    // =====================================


    async productReport(req,res){

        try{


            const products = await Product.find()

            .populate("category")

            .populate("brand")

            .populate("vendor")

            .sort({
                stock:1
            });



            return res.render(
                "admin/reports/products",
                {
                    products
                }
            );


        }
        catch(error){

            console.log(error);

        }

    }





    // =====================================
    // Customer Report
    // =====================================


    async customerReport(req,res){

        try{


            const customers = await Order.aggregate([


                {

                    $group:{


                        _id:"$customer",


                        totalOrders:{
                            $sum:1
                        },


                        totalSpent:{
                            $sum:"$totalAmount"
                        }


                    }

                },


                {
                    $sort:{
                        totalSpent:-1
                    }
                }


            ]);



            await User.populate(
                customers,
                {
                    path:"_id",
                    select:"name email phone"
                }
            );



            return res.render(
                "admin/reports/customers",
                {
                    customers
                }
            );


        }
        catch(error){

            console.log(error);

        }

    }





    // =====================================
    // Vendor Report
    // =====================================


    async vendorReport(req, res) {

    try {

        const orderItems = await OrderItem.find()
            .populate("vendor", "storeName email")
            .lean();


        console.log("========== VENDOR ORDER ITEMS ==========");

        console.log(
            JSON.stringify(orderItems, null, 2)
        );


        const vendorMap = {};


        orderItems.forEach(item => {

            // Skip if vendor is not found
            if (!item.vendor) {
                return;
            }


            const vendorId = item.vendor._id.toString();


            // Create vendor entry
            if (!vendorMap[vendorId]) {

                vendorMap[vendorId] = {

                    _id: item.vendor,

                    totalSales: 0,

                    totalProducts: 0

                };

            }


            // Add quantity
            vendorMap[vendorId].totalProducts +=
                Number(item.quantity || 0);


            // Add revenue
            vendorMap[vendorId].totalSales +=
                Number(item.total || 0);

        });


        // Convert object to array
        const vendors = Object.values(vendorMap);


        // Highest sales first
        vendors.sort(
            (a, b) =>
                b.totalSales - a.totalSales
        );


        console.log("========== FINAL VENDOR REPORT ==========");

        console.log(
            JSON.stringify(vendors, null, 2)
        );


        return res.render(
            "admin/reports/vendors",
            {

                title: "Vendor Report",

                admin: req.user,

                vendors

            }
        );


    } catch (error) {

        console.log(
            "VENDOR REPORT ERROR:",
            error
        );

        return res.redirect(
            "/admin/reports/dashboard"
        );

    }

}





    // =====================================
    // Payment Report
    // =====================================


    async paymentReport(req,res){

        try{


            const payments = await Payment.find()

            .populate("order")

            .sort({
                createdAt:-1
            });



            return res.render(
                "admin/reports/payments",
                {
                    payments
                }
            );


        }
        catch(error){

            console.log(error);

        }

    }





    // =====================================
    // Inventory Report
    // =====================================


    async inventoryReport(req,res){

        try{


            const inventory = await Product.find()

            .select(
                "name stock price"
            )

            .sort({
                stock:1
            });



            return res.render(
                "admin/reports/inventory",
                {
                    inventory
                }
            );


        }
        catch(error){

            console.log(error);

        }

    }





    // =====================================
    // Coupon Report
    // =====================================


    async couponReport(req,res){

        try{


            const coupons = await Coupon.find()

            .sort({
                createdAt:-1
            });



            return res.render(
                "admin/reports/coupons",
                {
                    coupons
                }
            );


        }
        catch(error){

            console.log(error);

        }

    }





    // =====================================
    // Offer Report
    // =====================================


    async offerReport(req,res){

        try{


            const offers = await Offer.find()

            .populate("product")

            .populate("category")

            .sort({
                createdAt:-1
            });



            return res.render(
                "admin/reports/offers",
                {
                    offers
                }
            );


        }
        catch(error){

            console.log(error);

        }

    }



}


module.exports = new ReportController();