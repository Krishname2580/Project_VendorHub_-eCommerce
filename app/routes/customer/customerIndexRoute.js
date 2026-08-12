// routes/customer.js
const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customer/CustomerIndexController');
 
router.get('/', customerController.getHome);
router.get('/shop', customerController.getShop);
router.get('/product/:id', customerController.getSingleProduct);
 
router.get('/cart', customerController.getCart);
router.post('/cart/add', customerController.addToCart);
router.post('/cart/remove/:id', customerController.removeFromCart);
 
router.get('/checkout', customerController.getCheckout);
router.post('/checkout', customerController.postCheckout);
 
router.get('/contact', customerController.getContact);
router.post('/contact', customerController.postContact);
 
router.get('/bestseller', customerController.getBestseller);
 
// Keep this LAST — catches any unmatched route
router.use(customerController.notFound);
 
module.exports = router;