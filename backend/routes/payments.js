const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect, userRateLimit } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay (conditionally)
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

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

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
router.post('/stripe/create-intent',
  protect,
  userRateLimit(10, 15 * 60 * 1000), // 10 attempts per 15 minutes
  [
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('Amount must be a positive integer'),
    body('currency')
      .optional()
      .isIn(['inr', 'usd'])
      .withMessage('Currency must be INR or USD')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { orderId, amount, currency = 'inr' } = req.body;

      // Check if Stripe is configured
      if (!stripe) {
        return res.status(503).json({
          success: false,
          message: 'Stripe payment service is not configured'
        });
      }

      // Verify order belongs to user
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to pay for this order'
        });
      }

      // Verify amount matches order total
      if (amount !== order.pricing.total) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount does not match order total'
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in smallest currency unit (paise)
        currency,
        metadata: {
          orderId: orderId,
          userId: req.user._id.toString(),
          orderNumber: order.orderNumber
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

      // Update order with payment info
      order.paymentInfo.transactionId = paymentIntent.id;
      order.paymentInfo.paymentGateway = 'stripe';
      order.paymentInfo.status = 'processing';
      await order.save();

      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Confirm Stripe payment
// @route   POST /api/payments/stripe/confirm
// @access  Private
router.post('/stripe/confirm',
  protect,
  [
    body('paymentIntentId')
      .notEmpty()
      .withMessage('Payment intent ID is required'),
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { paymentIntentId, orderId } = req.body;

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed',
          status: paymentIntent.status
        });
      }

      // Update order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      order.paymentInfo.status = 'completed';
      order.paymentInfo.paidAmount = paymentIntent.amount / 100;
      order.paymentInfo.paymentDate = new Date();
      order.status = 'confirmed';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        order
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
router.post('/razorpay/create-order',
  protect,
  userRateLimit(10, 15 * 60 * 1000),
  [
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('Amount must be a positive integer')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { orderId, amount } = req.body;

      // Verify order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to pay for this order'
        });
      }

      if (amount !== order.pricing.total) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount does not match order total'
        });
      }

      // Check if Razorpay is configured
      if (!razorpay) {
        return res.status(503).json({
          success: false,
          message: 'Razorpay payment service is not configured'
        });
      }

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: orderId,
          userId: req.user._id.toString()
        }
      });

      // Update order with payment info
      order.paymentInfo.transactionId = razorpayOrder.id;
      order.paymentInfo.paymentGateway = 'razorpay';
      order.paymentInfo.status = 'processing';
      await order.save();

      res.status(200).json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
router.post('/razorpay/verify',
  protect,
  [
    body('razorpay_order_id')
      .notEmpty()
      .withMessage('Razorpay order ID is required'),
    body('razorpay_payment_id')
      .notEmpty()
      .withMessage('Razorpay payment ID is required'),
    body('razorpay_signature')
      .notEmpty()
      .withMessage('Razorpay signature is required'),
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId
      } = req.body;

      // Verify signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }

      // Fetch payment details from Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      if (payment.status !== 'captured') {
        return res.status(400).json({
          success: false,
          message: 'Payment not captured',
          status: payment.status
        });
      }

      // Update order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      order.paymentInfo.status = 'completed';
      order.paymentInfo.paidAmount = payment.amount / 100;
      order.paymentInfo.paymentDate = new Date();
      order.status = 'confirmed';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Process UPI payment (simulation for development)
// @route   POST /api/payments/upi/process
// @access  Private
router.post('/upi/process',
  protect,
  userRateLimit(10, 15 * 60 * 1000),
  [
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('upiId')
      .matches(/^[\w.-]+@[\w.-]+$/)
      .withMessage('Invalid UPI ID format'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('Amount must be a positive integer')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { orderId, upiId, amount } = req.body;

      // Verify order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to pay for this order'
        });
      }

      if (amount !== order.pricing.total) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount does not match order total'
        });
      }

      // Simulate UPI payment processing
      // In production, integrate with actual UPI payment gateway
      const transactionId = `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate payment success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        // Update order with payment success
        order.paymentInfo.status = 'completed';
        order.paymentInfo.transactionId = transactionId;
        order.paymentInfo.paymentGateway = 'upi';
        order.paymentInfo.paidAmount = amount;
        order.paymentInfo.paymentDate = new Date();
        order.status = 'confirmed';
        await order.save();

        res.status(200).json({
          success: true,
          message: 'UPI payment processed successfully',
          transactionId,
          order
        });
      } else {
        // Simulate payment failure
        order.paymentInfo.status = 'failed';
        await order.save();

        res.status(400).json({
          success: false,
          message: 'UPI payment failed. Please try again.',
          transactionId
        });
      }

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Process COD order
// @route   POST /api/payments/cod/confirm
// @access  Private
router.post('/cod/confirm',
  protect,
  [
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { orderId } = req.body;

      // Verify order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to confirm this order'
        });
      }

      if (order.paymentInfo.method !== 'cod') {
        return res.status(400).json({
          success: false,
          message: 'This order is not a COD order'
        });
      }

      // Update order for COD
      order.paymentInfo.status = 'pending'; // Will be completed on delivery
      order.status = 'confirmed';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'COD order confirmed successfully',
        order
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
router.post('/refund',
  protect,
  [
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('Refund amount must be a positive integer'),
    body('reason')
      .notEmpty()
      .withMessage('Refund reason is required')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { orderId, amount, reason } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check authorization
      if (order.customer.toString() !== req.user._id.toString() && 
          req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to process refund for this order'
        });
      }

      // Check if payment was completed
      if (order.paymentInfo.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot refund order with incomplete payment'
        });
      }

      // Check refund amount
      if (amount > order.paymentInfo.paidAmount) {
        return res.status(400).json({
          success: false,
          message: 'Refund amount cannot exceed paid amount'
        });
      }

      let refundId;

      // Process refund based on payment gateway
      try {
        if (order.paymentInfo.paymentGateway === 'stripe') {
          const refund = await stripe.refunds.create({
            payment_intent: order.paymentInfo.transactionId,
            amount: amount * 100, // Amount in paise
            reason: 'requested_by_customer'
          });
          refundId = refund.id;
        } else if (order.paymentInfo.paymentGateway === 'razorpay') {
          const refund = await razorpay.payments.refund(
            order.paymentInfo.transactionId,
            {
              amount: amount * 100, // Amount in paise
              notes: { reason }
            }
          );
          refundId = refund.id;
        } else {
          // For UPI or other methods, create a manual refund record
          refundId = `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        // Update order with refund information
        order.paymentInfo.refundId = refundId;
        order.paymentInfo.refundAmount = amount;
        order.paymentInfo.refundDate = new Date();
        order.status = 'refunded';
        order.cancellation.refundProcessed = true;
        await order.save();

        res.status(200).json({
          success: true,
          message: 'Refund processed successfully',
          refundId,
          order
        });

      } catch (refundError) {
        console.error('Refund processing error:', refundError);
        res.status(500).json({
          success: false,
          message: 'Failed to process refund. Please contact support.',
          error: refundError.message
        });
      }

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get payment status
// @route   GET /api/payments/status/:orderId
// @access  Private
router.get('/status/:orderId',
  protect,
  [
    param('orderId')
      .isMongoId()
      .withMessage('Invalid order ID')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.customer.toString() !== req.user._id.toString() && 
          req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view payment status'
        });
      }

      res.status(200).json({
        success: true,
        paymentInfo: order.paymentInfo,
        orderStatus: order.status
      });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
