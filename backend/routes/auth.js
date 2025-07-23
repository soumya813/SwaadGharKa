const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect, userRateLimit } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid Indian pincode')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Helper function to check validation errors
const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', 
  userRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  validateRegistration,
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { name, email, phone, password, address, preferences } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }]
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
          });
        }
        if (existingUser.phone === phone) {
          return res.status(400).json({
            success: false,
            message: 'User with this phone number already exists'
          });
        }
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        password,
        address,
        preferences: preferences || {}
      });

      // Generate email verification token
      const emailVerificationToken = user.getEmailVerificationToken();
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      // Remove password from response
      user.password = undefined;

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email.',
        token,
        user,
        emailVerificationRequired: true
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login',
  userRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  validateLogin,
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user by email and include password
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated. Please contact support.'
        });
      }

      // Check password
      const isPasswordMatch = await user.matchPassword(password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Remove password from response
      user.password = undefined;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('orders', 'orderNumber status total createdAt');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', 
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)
      .withMessage('Please provide a valid Indian phone number'),
    body('address.street')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Street address cannot be empty'),
    body('address.city')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('City cannot be empty'),
    body('address.state')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('State cannot be empty'),
    body('address.pincode')
      .optional()
      .matches(/^[1-9][0-9]{5}$/)
      .withMessage('Please provide a valid Indian pincode')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { name, phone, address, preferences } = req.body;

      // Check if phone number is already taken by another user
      if (phone) {
        const existingUser = await User.findOne({ 
          phone, 
          _id: { $ne: req.user.id } 
        });
        
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Phone number is already registered with another account'
          });
        }
      }

      // Update user
      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (address) updateData.address = { ...req.user.address, ...address };
      if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password',
  protect,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id).select('+password');

      // Check current password
      const isCurrentPasswordMatch = await user.matchPassword(currentPassword);

      if (!isCurrentPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password',
  userRateLimit(3, 15 * 60 * 1000), // 3 attempts per 15 minutes
  validateForgotPassword,
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No user found with this email address'
        });
      }

      // Generate reset token
      const resetToken = user.getResetPasswordToken();
      await user.save();

      // Create reset URL
      const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

      // Send email (implement email service)
      // For now, just return success with token in development
      const message = process.env.NODE_ENV === 'development' 
        ? `Reset token: ${resetToken}` 
        : 'Password reset email sent';

      res.status(200).json({
        success: true,
        message,
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
router.put('/reset-password/:resettoken',
  validateResetPassword,
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { password } = req.body;

      // Get hashed token
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Set new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      // Generate new token
      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        message: 'Password reset successful',
        token
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
