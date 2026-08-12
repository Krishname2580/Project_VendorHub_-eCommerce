module.exports = (req, res, next) => {
  res.locals.customer = (req.session && req.session.customer) || null;
  next();
};
 