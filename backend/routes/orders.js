const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly, checkAccountStatus } = require('../middleware/auth');

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

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/',
  protect,
  checkAccountStatus,
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    body('items.*.menuItem')
      .isMongoId()
      .withMessage('Invalid menu item ID'),
    body('items.*.quantity')
      .isInt({ min: 1, max: 10 })
      .withMessage('Quantity must be between 1 and 10'),
    body('deliveryAddress.street')
      .trim()
      .notEmpty()
      .withMessage('Street address is required'),
    body('deliveryAddress.city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    body('deliveryAddress.state')
      .trim()
      .notEmpty()
      .withMessage('State is required'),
    body('deliveryAddress.pincode')
      .matches(/^[1-9][0-9]{5}$/)
      .withMessage('Please provide a valid Indian pincode'),
    body('contactInfo.phone')
      .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)
      .withMessage('Please provide a valid Indian phone number'),
    body('contactInfo.email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('paymentInfo.method')
      .isIn(['card', 'upi', 'cod', 'wallet'])
      .withMessage('Invalid payment method'),
    body('orderType')
      .optional()
      .isIn(['delivery', 'pickup'])
      .withMessage('Order type must be delivery or pickup')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const {
        items,
        deliveryAddress,
        contactInfo,
        paymentInfo,
        orderType = 'delivery',
        specialInstructions,
        scheduledDelivery
      } = req.body;

      // Validate menu items and calculate pricing
      const orderItems = [];
      let subtotal = 0;

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        
        if (!menuItem || !menuItem.isActive) {
          return res.status(400).json({
            success: false,
            message: `Menu item not found or unavailable: ${item.menuItem}`
          });
        }

        if (!menuItem.isCurrentlyAvailable) {
          return res.status(400).json({
            success: false,
            message: `Item "${menuItem.name}" is currently unavailable`
          });
        }

        const itemTotal = menuItem.price * item.quantity;
        const customizationTotal = (item.customizations || []).reduce(
          (total, customization) => total + (customization.extraCost || 0),
          0
        );

        orderItems.push({
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
          customizations: item.customizations || []
        });

        subtotal += itemTotal + (customizationTotal * item.quantity);
      }

      // Calculate taxes and fees
      const taxRate = 0.18; // 18% GST
      const tax = Math.round(subtotal * taxRate);
      const deliveryFee = orderType === 'delivery' ? 
        (subtotal > 300 ? 0 : 30) : 0; // Free delivery over ₹300
      const packagingFee = 10; // Fixed packaging fee

      const total = subtotal + tax + deliveryFee + packagingFee;

      // Create order
      const order = await Order.create({
        customer: req.user._id,
        items: orderItems,
        pricing: {
          subtotal,
          tax,
          deliveryFee,
          packagingFee,
          total
        },
        deliveryAddress,
        contactInfo,
        orderType,
        paymentInfo,
        specialInstructions,
        scheduledDelivery
      });

      // Update order counts for menu items
      for (const item of items) {
        await MenuItem.findByIdAndUpdate(
          item.menuItem,
          { $inc: { 'availability.currentOrdersToday': item.quantity } }
        );
      }

      // Populate the order for response
      const populatedOrder = await Order.findById(order._id)
        .populate('items.menuItem', 'name images category')
        .populate('customer', 'name email phone');

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: populatedOrder
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/',
  protect,
  [
    query('status')
      .optional()
      .isIn(['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'picked-up', 'cancelled', 'refunded'])
      .withMessage('Invalid status filter'),
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
      const { status, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      // Build query
      const query = { customer: req.user._id, isActive: true };
      if (status) query.status = status;

      // Get orders with pagination
      const orders = await Order.find(query)
        .populate('items.menuItem', 'name images category price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Order.countDocuments(query);

      res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        orders
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id',
  protect,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('items.menuItem', 'name images category price description')
        .populate('customer', 'name email phone');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user owns this order or is admin
      if (order.customer._id.toString() !== req.user._id.toString() && 
          req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this order'
        });
      }

      res.status(200).json({
        success: true,
        order
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel',
  protect,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('reason')
      .isIn(['customer-request', 'item-unavailable', 'other'])
      .withMessage('Invalid cancellation reason')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { reason } = req.body;

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user owns this order
      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this order'
        });
      }

      // Check if order can be cancelled
      if (!order.canCancel) {
        return res.status(400).json({
          success: false,
          message: 'Order cannot be cancelled at this stage'
        });
      }

      // Update order status
      order.status = 'cancelled';
      order.cancellation = {
        reason,
        cancelledBy: req.user._id,
        cancelledAt: new Date()
      };

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Rate and review order
// @route   PUT /api/orders/:id/review
// @access  Private
router.put('/:id/review',
  protect,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('rating.food')
      .isInt({ min: 1, max: 5 })
      .withMessage('Food rating must be between 1 and 5'),
    body('rating.delivery')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Delivery rating must be between 1 and 5'),
    body('rating.overall')
      .isInt({ min: 1, max: 5 })
      .withMessage('Overall rating must be between 1 and 5'),
    body('review')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Review cannot exceed 500 characters')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { rating, review } = req.body;

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user owns this order
      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to review this order'
        });
      }

      // Check if order is delivered
      if (!order.isDelivered) {
        return res.status(400).json({
          success: false,
          message: 'Can only review completed orders'
        });
      }

      // Check if already reviewed
      if (order.rating.overall) {
        return res.status(400).json({
          success: false,
          message: 'Order has already been reviewed'
        });
      }

      // Update order with rating and review
      order.rating = rating;
      if (review) order.review = review;

      await order.save();

      // Update menu item ratings
      for (const item of order.items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (menuItem) {
          await menuItem.updateRating(rating.food);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Review submitted successfully',
        order
      });

    } catch (error) {
      next(error);
    }
  }
);

// Admin routes

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all',
  protect,
  adminOnly,
  [
    query('status')
      .optional()
      .isIn(['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'picked-up', 'cancelled', 'refunded'])
      .withMessage('Invalid status filter'),
    query('date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { status, date, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      // Build query
      const query = { isActive: true };
      if (status) query.status = status;
      
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        
        query.createdAt = {
          $gte: startOfDay,
          $lt: endOfDay
        };
      }

      // Get orders with pagination
      const orders = await Order.find(query)
        .populate('customer', 'name email phone')
        .populate('items.menuItem', 'name category price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Order.countDocuments(query);

      // Get summary statistics
      const summary = await Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.total' },
            avgOrderValue: { $avg: '$pricing.total' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        summary: summary[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
        orders
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status',
  protect,
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('status')
      .isIn(['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'picked-up', 'cancelled', 'refunded'])
      .withMessage('Invalid status'),
    body('notes')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Notes cannot exceed 200 characters')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { status, notes } = req.body;

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update order status
      await order.updateStatus(status, req.user._id, notes);

      const updatedOrder = await Order.findById(order._id)
        .populate('customer', 'name email phone')
        .populate('items.menuItem', 'name category price');

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: updatedOrder
      });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
