const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and add to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      
      let message = 'Not authorized to access this route';
      
      if (error.name === 'TokenExpiredError') {
        message = 'Token has expired';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token';
      }

      return res.status(401).json({
        success: false,
        message
      });
    }
  }

  // No token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Optional authentication - doesn't require token but adds user if present
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Silently fail for optional auth
      req.user = null;
    }
  }

  next();
};

// Check if user owns resource or is admin
const authorize = (resourceField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (req.resource && req.resource[resourceField]) {
      if (req.resource[resourceField].toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }
    }

    next();
  };
};

// Rate limiting for specific user actions
const userRateLimit = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create user request history
    if (!requests.has(userId)) {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    requests.set(userId, validRequests);

    // Check if user has exceeded limit
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000 / 60} minutes.`,
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    validRequests.push(now);
    requests.set(userId, validRequests);

    next();
  };
};

// Verify email before certain actions
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email before proceeding.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

// Check if user can perform action based on account status
const checkAccountStatus = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account has been deactivated. Please contact support.',
      code: 'ACCOUNT_DEACTIVATED'
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
  optionalAuth,
  authorize,
  userRateLimit,
  requireEmailVerification,
  checkAccountStatus
};
