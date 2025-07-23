const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Extract field name from error
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    
    if (field === 'email') {
      message = `Email ${value} is already registered`;
    } else if (field === 'phone') {
      message = `Phone number ${value} is already registered`;
    } else {
      message = `${field} already exists`;
    }
    
    error = {
      message,
      statusCode: 400,
      field
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = {
      message: messages.join(', '),
      statusCode: 400,
      errors: messages
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      message,
      statusCode: 401
    };
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    let message = 'Payment processing error';
    let statusCode = 400;

    switch (err.type) {
      case 'StripeCardError':
        message = err.message || 'Your card was declined';
        break;
      case 'StripeRateLimitError':
        message = 'Too many requests made to Stripe API';
        statusCode = 429;
        break;
      case 'StripeInvalidRequestError':
        message = 'Invalid payment request';
        break;
      case 'StripeAPIError':
        message = 'Payment service temporarily unavailable';
        statusCode = 503;
        break;
      case 'StripeConnectionError':
        message = 'Network error during payment processing';
        statusCode = 503;
        break;
      case 'StripeAuthenticationError':
        message = 'Payment authentication error';
        statusCode = 500;
        break;
      default:
        message = err.message || 'Payment processing error';
    }

    error = {
      message,
      statusCode,
      type: 'PAYMENT_ERROR'
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large',
      statusCode: 400,
      type: 'FILE_ERROR'
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = {
      message: 'Too many files',
      statusCode: 400,
      type: 'FILE_ERROR'
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'Unexpected file field',
      statusCode: 400,
      type: 'FILE_ERROR'
    };
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    error = {
      message: 'Database connection error. Please try again later.',
      statusCode: 503,
      type: 'DATABASE_ERROR'
    };
  }

  // Rate limiting errors
  if (err.status === 429 || err.statusCode === 429) {
    error = {
      message: 'Too many requests. Please try again later.',
      statusCode: 429,
      type: 'RATE_LIMIT_ERROR',
      retryAfter: err.retryAfter || 60
    };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Prepare response object
  const response = {
    success: false,
    message
  };

  // Add additional error information in development
  if (process.env.NODE_ENV === 'development') {
    response.error = err;
    response.stack = err.stack;
  }

  // Add specific error fields if they exist
  if (error.field) response.field = error.field;
  if (error.errors) response.errors = error.errors;
  if (error.type) response.type = error.type;
  if (error.retryAfter) response.retryAfter = error.retryAfter;

  // Log critical errors
  if (statusCode >= 500) {
    console.error('Critical Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user ? req.user._id : 'Not authenticated',
      timestamp: new Date().toISOString()
    });
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
