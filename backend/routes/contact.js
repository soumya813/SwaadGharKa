const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { userRateLimit } = require('../middleware/auth');

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

// Configure nodemailer (conditionally)
let transporter;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
router.post('/',
  userRateLimit(3, 15 * 60 * 1000), // 3 messages per 15 minutes
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .optional()
      .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)
      .withMessage('Please provide a valid Indian phone number'),
    body('subject')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Subject must be between 5 and 100 characters'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Message must be between 10 and 1000 characters'),
    body('category')
      .optional()
      .isIn(['general', 'order-inquiry', 'feedback', 'complaint', 'suggestion', 'catering'])
      .withMessage('Invalid category')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { name, email, phone, subject, message, category = 'general' } = req.body;

      // Create email content
      const emailContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from SwaadGharKa contact form at ${new Date().toLocaleString()}</small></p>
      `;

      // Send email to admin
      const adminMailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `SwaadGharKa Contact: ${subject}`,
        html: emailContent
      };

      // Send confirmation email to user
      const userMailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Thank you for contacting SwaadGharKa',
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to SwaadGharKa. We have received your message and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>If you have any urgent inquiries, please call us at <strong>+91-9876543210</strong></p>
          <p>Best regards,<br>SwaadGharKa Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            SwaadGharKa - Authentic Home-Style Cooking<br>
            Email: info@swaadgharka.com | Phone: +91-9876543210
          </p>
        `
      };

      // Send emails
      if (process.env.NODE_ENV === 'production' && transporter) {
        try {
          await transporter.sendMail(adminMailOptions);
          await transporter.sendMail(userMailOptions);
        } catch (emailError) {
          console.error('Email sending error:', emailError);
          // Don't fail the request if email fails
        }
      }

      // Log the contact form submission (in production, save to database)
      console.log('Contact form submission:', {
        name,
        email,
        phone,
        subject,
        category,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get contact information
// @route   GET /api/contact/info
// @access  Public
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    contactInfo: {
      name: 'SwaadGharKa',
      tagline: 'Authentic Home-Style Cooking',
      address: {
        street: '123 Food Street',
        area: 'Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      },
      phone: {
        primary: '+91-9876543210',
        secondary: '+91-9876543211'
      },
      email: {
        general: 'info@swaadgharka.com',
        orders: 'orders@swaadgharka.com',
        support: 'support@swaadgharka.com'
      },
      hours: {
        monday: '9:00 AM - 10:00 PM',
        tuesday: '9:00 AM - 10:00 PM',
        wednesday: '9:00 AM - 10:00 PM',
        thursday: '9:00 AM - 10:00 PM',
        friday: '9:00 AM - 11:00 PM',
        saturday: '9:00 AM - 11:00 PM',
        sunday: '9:00 AM - 10:00 PM'
      },
      social: {
        facebook: 'https://facebook.com/swaadgharka',
        instagram: 'https://instagram.com/swaadgharka',
        twitter: 'https://twitter.com/swaadgharka',
        youtube: 'https://youtube.com/swaadgharka'
      },
      deliveryInfo: {
        areas: [
          'Connaught Place',
          'Karol Bagh',
          'Lajpat Nagar',
          'Hauz Khas',
          'Saket',
          'Dwarka',
          'Gurgaon Sector 14-30'
        ],
        minimumOrder: 150,
        deliveryCharges: {
          below300: 30,
          above300: 0
        },
        estimatedTime: '30-45 minutes'
      }
    }
  });
});

// @desc    Subscribe to newsletter
// @route   POST /api/contact/newsletter
// @access  Public
router.post('/newsletter',
  userRateLimit(5, 60 * 60 * 1000), // 5 subscriptions per hour
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
  ],
  checkValidationErrors,
  async (req, res, next) => {
    try {
      const { email, name } = req.body;

      // In production, save to database and integrate with email service
      console.log('Newsletter subscription:', {
        email,
        name: name || 'Not provided',
        timestamp: new Date().toISOString()
      });

      // Send welcome email
      if (process.env.NODE_ENV === 'production' && transporter) {
        const welcomeMailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Welcome to SwaadGharKa Newsletter!',
          html: `
            <h2>Welcome to SwaadGharKa!</h2>
            <p>Dear ${name || 'Food Lover'},</p>
            <p>Thank you for subscribing to our newsletter! You'll now receive:</p>
            <ul>
              <li>🍽️ Weekly menu updates and new dish announcements</li>
              <li>🎉 Exclusive offers and discounts</li>
              <li>👨‍🍳 Chef's tips and recipes</li>
              <li>📅 Special event notifications</li>
            </ul>
            <p>Stay tuned for delicious updates!</p>
            <p>Best regards,<br>SwaadGharKa Team</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              If you wish to unsubscribe, please email us at unsubscribe@swaadgharka.com
            </p>
          `
        };

        try {
          await transporter.sendMail(welcomeMailOptions);
        } catch (emailError) {
          console.error('Newsletter welcome email error:', emailError);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Successfully subscribed to newsletter! Check your email for confirmation.'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get FAQ
// @route   GET /api/contact/faq
// @access  Public
router.get('/faq', (req, res) => {
  res.status(200).json({
    success: true,
    faq: [
      {
        question: 'What are your delivery areas?',
        answer: 'We deliver to major areas in Delhi NCR including Connaught Place, Karol Bagh, Lajpat Nagar, Hauz Khas, Saket, Dwarka, and Gurgaon (Sectors 14-30).'
      },
      {
        question: 'What is the minimum order value?',
        answer: 'The minimum order value is ₹150. Free delivery is available for orders above ₹300.'
      },
      {
        question: 'How long does delivery take?',
        answer: 'Our estimated delivery time is 30-45 minutes from the time of order confirmation.'
      },
      {
        question: 'Do you offer vegetarian and vegan options?',
        answer: 'Yes! We have a wide variety of vegetarian, vegan, and Jain food options. All items are clearly labeled with dietary information.'
      },
      {
        question: 'Can I customize the spice level?',
        answer: 'Absolutely! You can choose from mild, medium, spicy, or extra-spicy for most of our dishes.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards, UPI payments, digital wallets, and cash on delivery (COD).'
      },
      {
        question: 'Can I cancel or modify my order?',
        answer: 'Orders can be cancelled or modified within 5 minutes of placing. After that, please contact our support team.'
      },
      {
        question: 'Do you cater for events and parties?',
        answer: 'Yes! We offer catering services for events, parties, and corporate functions. Please contact us at least 24 hours in advance.'
      },
      {
        question: 'How fresh are your ingredients?',
        answer: 'We source fresh ingredients daily from local markets and prepare all dishes fresh to order.'
      },
      {
        question: 'Do you have any loyalty programs?',
        answer: 'Yes! Join our loyalty program to earn points on every order and get exclusive discounts and offers.'
      }
    ]
  });
});

module.exports = router;
