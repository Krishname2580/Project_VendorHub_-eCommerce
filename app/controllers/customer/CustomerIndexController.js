// controllers/customerController.js
//
// Holds the logic for every customer-facing page.
// Routes just call these functions — they don't render or query anything themselves.

// TEMP: dummy data so pages have something to loop over.
// Replace this with real DB calls (Mongoose/Sequelize/etc.) once you have models.
const dummyProducts = [
  { id: 1, name: 'Wireless Headphones', price: 59.99, image: '/img/product-1.png', category: 'accessories' },
  { id: 2, name: 'Smart Watch', price: 89.99, image: '/img/product-2.png', category: 'accessories' },
  { id: 3, name: '4K Monitor', price: 249.99, image: '/img/product-3.png', category: 'electronics' },
  { id: 4, name: 'Gaming Laptop', price: 999.99, image: '/img/product-4.png', category: 'laptops' },
];

// Helper: read the cart out of the session and compute a total.
// Assumes req.session.cart is an array of { productId, qty, price }.
function getCartSummary(req) {
  const cart = (req.session && req.session.cart) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { cart, cartTotal: total.toFixed(2) };
}

exports.getHome = (req, res) => {
  const { cartTotal } = getCartSummary(req);
  res.render('customer/index', {
    currentPage: 'home',
    pageTitle: 'Electro - Home',
    cartTotal,
    featuredProducts: dummyProducts,
  });
};

exports.getShop = (req, res) => {
  const { cartTotal } = getCartSummary(req);
  const { category, q } = req.query;

  let products = dummyProducts;
  if (category) products = products.filter(p => p.category === category);
  if (q) products = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  res.render('customer/shop', {
    currentPage: 'shop',
    pageTitle: 'Electro - Shop',
    cartTotal,
    products,
    activeCategory: category || '',
    searchQuery: q || '',
  });
};

exports.getSingleProduct = (req, res) => {
  const { cartTotal } = getCartSummary(req);
  const productId = parseInt(req.params.id, 10);
  const product = dummyProducts.find(p => p.id === productId);

  if (!product) {
    return res.status(404).render('customer/404', { currentPage: '404', pageTitle: 'Product Not Found', cartTotal });
  }

  res.render('customer/single', {
    currentPage: 'single',
    pageTitle: `Electro - ${product.name}`,
    cartTotal,
    product,
  });
};

exports.getCart = (req, res) => {
  const { cart, cartTotal } = getCartSummary(req);
  res.render('customer/cart', {
    currentPage: 'cart',
    pageTitle: 'Electro - Cart',
    cartTotal,
    cart,
  });
};

exports.addToCart = (req, res) => {
  const productId = parseInt(req.body.productId, 10);
  const qty = parseInt(req.body.qty, 10) || 1;
  const product = dummyProducts.find(p => p.id === productId);

  if (!product) return res.redirect('/shop');

  req.session.cart = req.session.cart || [];
  const existing = req.session.cart.find(i => i.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    req.session.cart.push({ productId, name: product.name, price: product.price, qty });
  }

  res.redirect('/cart');
};

exports.removeFromCart = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(i => i.productId !== productId);
  }
  res.redirect('/cart');
};

exports.getCheckout = (req, res) => {
  const { cart, cartTotal } = getCartSummary(req);
  res.render('customer/checkout', {
    currentPage: 'checkout',
    pageTitle: 'Electro - Checkout',
    cartTotal,
    cart,
  });
};

exports.postCheckout = (req, res) => {
  // TODO: validate req.body, create an order in the DB, charge payment, etc.
  req.session.cart = [];
  res.redirect('/');
};

exports.getContact = (req, res) => {
  const { cartTotal } = getCartSummary(req);
  res.render('customer/contact', {
    currentPage: 'contact',
    pageTitle: 'Electro - Contact',
    cartTotal,
  });
};

exports.postContact = (req, res) => {
  // TODO: save the message or send an email (nodemailer, etc.)
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.redirect('/contact');
};

exports.getBestseller = (req, res) => {
  const { cartTotal } = getCartSummary(req);
  res.render('customer/bestseller', {
    currentPage: 'bestseller',
    pageTitle: 'Electro - Bestsellers',
    cartTotal,
    products: dummyProducts,
  });
};

exports.notFound = (req, res) => {
  const { cartTotal } = getCartSummary(req);
  res.status(404).render('customer/404', {
    currentPage: '404',
    pageTitle: 'Page Not Found',
    cartTotal,
  });
};
