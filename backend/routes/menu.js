const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

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

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
router.get('/',
  optionalAuth,
  [
    query('category')
      .optional()
      .isIn([
        'appetizers', 'main-course', 'rice-biryani', 'bread-roti', 'dal-curry',
        'vegetables', 'snacks', 'sweets-desserts', 'beverages', 'combo-meals',
        'regional-specials', 'chef-special'
      ])
      .withMessage('Invalid category'),
    query('cuisine')
      .optional()
      .isIn([
        'north-indian', 'south-indian', 'gujarati', 'punjabi', 'bengali',
        'maharashtrian', 'rajasthani', 'kerala', 'tamil', 'hyderabadi',
        'mughlai', 'street-food', 'chinese', 'continental'
      ])
      .withMessage('Invalid cuisine type'),
    query('minPrice')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Minimum price must be a non-negative integer'),
    query('maxPrice')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Maximum price must be a non-negative integer'),
    query('spiceLevel')
      .optional()
      .isIn(['mild', 'medium', 'spicy', 'extra-spicy'])
      .withMessage('Invalid spice level'),
    query('tags')
      .optional()
      .isIn([
        'vegetarian', 'vegan', 'jain', 'halal', 'gluten-free', 'dairy-free',
        'spicy', 'mild', 'sweet', 'tangy', 'crispy', 'healthy', 'comfort-food',
        'traditional', 'fusion', 'home-style', 'restaurant-style', 'quick-bite',
        'family-pack', 'single-serve'
      ])
      .withMessage('Invalid tag'),
    query('search')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Search term must be at least 2 characters'),
    query('sortBy')
      .optional()
      .isIn(['price', 'rating', 'name', 'createdAt', 'popular'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const {
        category,
        cuisine,
        minPrice,
        maxPrice,
        spiceLevel,
        tags,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 12
      } = req.query;

      const skip = (page - 1) * limit;

      // Build query
      const query = { isActive: true };

      if (category) query.category = category;
      if (cuisine) query.cuisine = cuisine;
      if (spiceLevel) query.spiceLevel = spiceLevel;
      if (tags) query.tags = { $in: [tags] };

      // Price range filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }

      // Text search
      if (search) {
        query.$text = { $search: search };
      }

      // Build sort object
      let sort = {};
      if (sortBy === 'popular') {
        sort = { 'ratings.count': -1, 'ratings.average': -1 };
      } else if (sortBy === 'rating') {
        sort = { 'ratings.average': sortOrder === 'asc' ? 1 : -1 };
      } else {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      }

      // Get menu items
      const menuItems = await MenuItem.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-ingredients -nutritionalInfo -reviews');

      // Get total count for pagination
      const total = await MenuItem.countDocuments(query);

      // Get categories and cuisines for filters
      const filters = await MenuItem.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            categories: { $addToSet: '$category' },
            cuisines: { $addToSet: '$cuisine' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        count: menuItems.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        filters: filters[0] || { categories: [], cuisines: [], minPrice: 0, maxPrice: 1000 },
        menuItems
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
router.get('/:id',
  optionalAuth,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid menu item ID')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const menuItem = await MenuItem.findById(req.params.id)
        .populate('reviews', 'rating review customer createdAt')
        .populate('createdBy', 'name');

      if (!menuItem || !menuItem.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        menuItem
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get featured menu items
// @route   GET /api/menu/featured/items
// @access  Public
router.get('/featured/items', async (req, res, next) => {
  try {
    const featuredItems = await MenuItem.findFeatured()
      .limit(8)
      .select('-ingredients -nutritionalInfo -reviews');

    res.status(200).json({
      success: true,
      count: featuredItems.length,
      menuItems: featuredItems
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get chef's special items
// @route   GET /api/menu/special/items
// @access  Public
router.get('/special/items', async (req, res, next) => {
  try {
    const specialItems = await MenuItem.findSpecial()
      .limit(6)
      .select('-ingredients -nutritionalInfo -reviews');

    res.status(200).json({
      success: true,
      count: specialItems.length,
      menuItems: specialItems
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get menu items by category
// @route   GET /api/menu/category/:category
// @access  Public
router.get('/category/:category',
  [
    param('category')
      .isIn([
        'appetizers', 'main-course', 'rice-biryani', 'bread-roti', 'dal-curry',
        'vegetables', 'snacks', 'sweets-desserts', 'beverages', 'combo-meals',
        'regional-specials', 'chef-special'
      ])
      .withMessage('Invalid category'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { page = 1, limit = 12 } = req.query;
      const skip = (page - 1) * limit;

      const menuItems = await MenuItem.findByCategory(req.params.category)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-ingredients -nutritionalInfo -reviews');

      const total = await MenuItem.countDocuments({ 
        category: req.params.category, 
        isActive: true 
      });

      res.status(200).json({
        success: true,
        count: menuItems.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        category: req.params.category,
        menuItems
      });

    } catch (error) {
      next(error);
    }
  }
);

// Admin routes

// @desc    Create menu item (Admin)
// @route   POST /api/menu
// @access  Private/Admin
router.post('/',
  protect,
  adminOnly,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Item name must be between 2 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('price')
      .isInt({ min: 1, max: 10000 })
      .withMessage('Price must be between ₹1 and ₹10,000'),
    body('category')
      .isIn([
        'appetizers', 'main-course', 'rice-biryani', 'bread-roti', 'dal-curry',
        'vegetables', 'snacks', 'sweets-desserts', 'beverages', 'combo-meals',
        'regional-specials', 'chef-special'
      ])
      .withMessage('Invalid category'),
    body('cuisine')
      .isIn([
        'north-indian', 'south-indian', 'gujarati', 'punjabi', 'bengali',
        'maharashtrian', 'rajasthani', 'kerala', 'tamil', 'hyderabadi',
        'mughlai', 'street-food', 'chinese', 'continental'
      ])
      .withMessage('Invalid cuisine type'),
    body('preparationTime')
      .isInt({ min: 5, max: 120 })
      .withMessage('Preparation time must be between 5 and 120 minutes'),
    body('servingSize')
      .isIn(['1 person', '2-3 people', '4-5 people', 'family pack'])
      .withMessage('Invalid serving size')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const menuItemData = {
        ...req.body,
        createdBy: req.user._id
      };

      const menuItem = await MenuItem.create(menuItemData);

      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        menuItem
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Update menu item (Admin)
// @route   PUT /api/menu/:id
// @access  Private/Admin
router.put('/:id',
  protect,
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid menu item ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Item name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('price')
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage('Price must be between ₹1 and ₹10,000')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const menuItem = await MenuItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        menuItem
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Delete menu item (Admin)
// @route   DELETE /api/menu/:id
// @access  Private/Admin
router.delete('/:id',
  protect,
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid menu item ID')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const menuItem = await MenuItem.findById(req.params.id);

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      // Soft delete by setting isActive to false
      menuItem.isActive = false;
      await menuItem.save();

      res.status(200).json({
        success: true,
        message: 'Menu item deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
