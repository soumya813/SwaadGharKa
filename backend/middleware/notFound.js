const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: '/api/auth',
      users: '/api/users',
      menu: '/api/menu',
      orders: '/api/orders',
      payments: '/api/payments',
      contact: '/api/contact',
      health: '/api/health'
    }
  });
};

module.exports = { notFound };
