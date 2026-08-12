============================================================
              VENDORHUB E-COMMERCE PROJECT
============================================================

Project Name:
VendorHUB - Multi-Vendor E-Commerce Website

Developer:
Krishna Prasad Kundu

------------------------------------------------------------
1. PROJECT DESCRIPTION
------------------------------------------------------------

VendorHUB is a multi-vendor e-commerce web application where
customers can browse and purchase products, vendors can manage
their products and orders, and administrators can manage the
complete platform.

The project provides separate functionality for:

1. Super Admin--krishna@yopmail.comm(pass-123456)
2. Vendor--rathin@yopmail.com(pass-123456)
3. Customer-tubai@yopmail.com(pass-123456)

Each role has its own dashboard and access permissions.

------------------------------------------------------------
2. TECHNOLOGIES USED
------------------------------------------------------------

Frontend:
- HTML
- CSS
- Bootstrap
- JavaScript
- EJS

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose

Authentication:
- JWT Authentication
- Role-Based Access Control (RBAC)
- Separate authentication tokens for Admin, Vendor and Customer

Other Technologies:
- Multer
- Cloudinary / Image Upload
- Nodemailer
- bcryptjs
- dotenv
- Express Session
- Cookie Parser

------------------------------------------------------------
3. USER ROLES
------------------------------------------------------------

A. SUPER ADMIN
----------------

Admin can:

- Login securely
- Manage vendors
- Approve vendors
- Reject vendors
- View vendor details
- Manage customers
- Manage products
- Approve products
- Reject products
- Manage categories
- Manage brands
- Manage orders
- View reports
- View sales information
- View dashboard statistics
- Manage platform data

Admin authentication is handled using:

adminToken


B. VENDOR
----------------

Vendor can:

- Register as a vendor
- Verify email
- Login after admin approval
- Manage vendor profile
- Manage store
- Add products
- Edit products
- Delete products
- View pending products
- View approved products
- View rejected products
- View vendor orders
- View order details
- Update order status
- View sales reports
- View order reports
- View product reports
- View vendor dashboard statistics

Vendor authentication is handled using:

vendorToken


C. CUSTOMER
----------------

Customer can:

- Register
- Verify email
- Login
- Browse products
- View product details
- Add products to cart
- Update cart quantity
- Remove products from cart
- Manage addresses
- Apply coupons
- Checkout
- Select Cash on Delivery
- Place orders
- View orders
- View order details
- Logout

Customer authentication is handled using:

customerToken

------------------------------------------------------------
4. AUTHENTICATION & AUTHORIZATION
------------------------------------------------------------

The project uses JWT-based authentication.

Separate cookies/tokens are used for different roles:

Admin:
adminToken

Vendor:
vendorToken

Customer:
customerToken

Role-based middleware protects different sections of the
application.

Admin routes are protected using AdminAuthCheck.

Vendor routes are protected using VendorMiddleware.

Unauthorized users are redirected to the login page.

------------------------------------------------------------
5. E-COMMERCE FEATURES
------------------------------------------------------------

Product Management:
- Product CRUD
- Product categories
- Product brands
- Product images
- Product stock
- Product pricing
- Discount pricing
- Product approval system
- Featured products
- Best seller products
- New arrival products

Cart:
- Add to cart
- Remove from cart
- Update quantity
- Calculate subtotal
- Calculate shipping
- Calculate grand total

Checkout:
- Customer information
- Address information
- Order notes
- Payment method selection
- Cash on Delivery
- Order creation

Order Management:
- Order number generation
- Customer orders
- Vendor orders
- Order status management
- Pending
- Confirmed
- Packed
- Shipped
- Delivered
- Cancelled
- Returned

------------------------------------------------------------
6. VENDOR PRODUCT APPROVAL FLOW
------------------------------------------------------------

Vendor creates a product.

        |
        v
Product Status = Pending
        |
        v
Admin reviews product
        |
   ----------------
   |              |
   v              v
Approved        Rejected
   |
   v
Product becomes available

------------------------------------------------------------
7. VENDOR APPROVAL FLOW
------------------------------------------------------------

Vendor registers.

        |
        v
Email Verification
        |
        v
Vendor Status = Pending
        |
        v
Admin reviews vendor
        |
   ----------------
   |              |
   v              v
Approved        Rejected
   |
   v
Vendor can login

------------------------------------------------------------
8. ORDER FLOW
------------------------------------------------------------

Customer selects product
        |
        v
Add to Cart
        |
        v
Checkout
        |
        v
Select Address
        |
        v
Select Payment Method
        |
        v
Cash on Delivery
        |
        v
Place Order
        |
        v
Order Created
        |
        v
Vendor receives order
        |
        v
Vendor updates order status
        |
        v
Order Delivered

------------------------------------------------------------
9. REPORTS
------------------------------------------------------------

Admin Reports:
- Total sales
- Orders
- Products
- Customers
- Vendors
- Sales statistics
- Dashboard charts

Vendor Reports:
- Total sales
- Total orders
- Total quantity sold
- Monthly sales
- Order status summary
- Product sales report
- Orders report
