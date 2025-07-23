const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('orders', 'orderNumber status pricing.total createdAt')
      .populate('favoriteItems', 'name price images category');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.isActive = status === 'active';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
