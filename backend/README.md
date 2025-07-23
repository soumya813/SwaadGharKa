# SwaadGharKa Backend API

A comprehensive Node.js backend for the SwaadGharKa home kitchen application with authentication, order management, payment processing, and menu management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration, login, and password reset
- **Menu Management**: Full CRUD operations for menu items with categories, pricing, and availability
- **Order Management**: Complete order lifecycle from placement to delivery tracking
- **Payment Integration**: Support for Stripe, Razorpay, UPI, and Cash on Delivery
- **Security**: Rate limiting, input validation, CORS protection, and security headers
- **Database**: MongoDB with Mongoose for data modeling and validation
- **Email Service**: Contact forms and notification emails via Nodemailer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. **Required Environment Variables**
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/swaadgharka
   
   # JWT Security
   JWT_SECRET=your_super_secure_jwt_secret_key_min_32_characters
   
   # Payment Gateways (Optional for development)
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   RAZORPAY_KEY_ID=rzp_test_your_razorpay_key
   
   # Email Service (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. **Start MongoDB**
   Ensure MongoDB is running on your system

6. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

7. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── notFound.js          # 404 handler
├── models/
│   ├── User.js              # User schema
│   ├── MenuItem.js          # Menu item schema
│   └── Order.js             # Order schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management
│   ├── menu.js              # Menu operations
│   ├── orders.js            # Order management
│   ├── payments.js          # Payment processing
│   └── contact.js           # Contact forms
├── scripts/
│   └── seedDatabase.js      # Database seeding
├── .env.example             # Environment template
├── server.js                # Main server file
└── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Menu
- `GET /api/menu` - Get all menu items (with filters)
- `GET /api/menu/:id` - Get single menu item
- `GET /api/menu/featured/items` - Get featured items
- `GET /api/menu/special/items` - Get chef's special items
- `GET /api/menu/category/:category` - Get items by category
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/review` - Rate and review order
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments
- `POST /api/payments/stripe/create-intent` - Create Stripe payment
- `POST /api/payments/stripe/confirm` - Confirm Stripe payment
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `POST /api/payments/upi/process` - Process UPI payment
- `POST /api/payments/cod/confirm` - Confirm COD order
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/status/:orderId` - Get payment status

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact/info` - Get contact information
- `POST /api/contact/newsletter` - Newsletter subscription
- `GET /api/contact/faq` - Get FAQ

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/profile` - Get user profile

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: Configurable rate limits per endpoint
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **XSS Protection**: Input sanitization
- **NoSQL Injection Protection**: MongoDB sanitization

## 💳 Payment Integration

### Stripe
- Credit/Debit card payments
- Payment intents for secure processing
- Webhook support for payment confirmation

### Razorpay
- Indian payment gateway
- Multiple payment methods
- Signature verification for security

### UPI
- Unified Payments Interface support
- QR code generation
- Transaction verification

### Cash on Delivery (COD)
- Order confirmation without payment
- Payment collection on delivery

## 📧 Email Features

- Contact form submissions
- Newsletter subscriptions
- Order confirmations
- Password reset emails
- Admin notifications

## 🗄️ Database Models

### User Model
- Personal information (name, email, phone)
- Address details
- Dietary preferences
- Order history
- Authentication data

### MenuItem Model
- Item details (name, description, price)
- Category and cuisine classification
- Ingredients and nutritional info
- Availability and timing
- Images and ratings

### Order Model
- Customer information
- Ordered items with quantities
- Delivery address
- Payment information
- Order status tracking
- Pricing breakdown

## 📊 Sample Data

The backend includes a comprehensive seeding script that creates:
- Admin user account
- Sample customer accounts
- Diverse menu items across categories
- Featured and special items

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swaadgharka
JWT_SECRET=your_production_jwt_secret
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
RAZORPAY_KEY_ID=rzp_live_your_live_razorpay_key
```

### Deployment Platforms
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **DigitalOcean App Platform**: Deploy from Git
- **AWS/Azure**: Use container or serverless deployment

## 📈 Monitoring & Logging

- Request logging for debugging
- Error tracking with detailed stack traces
- Performance monitoring ready
- Health check endpoint at `/api/health`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@swaadgharka.com
- GitHub Issues: Create an issue in the repository
- Documentation: Check the API documentation

---

**Note**: This backend is designed to work seamlessly with the SwaadGharKa React frontend. Ensure both services are running for full functionality.
