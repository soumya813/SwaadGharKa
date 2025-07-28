# 🍽️ SwaadGharKa - Home Kitchen Food Delivery Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0.3-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **SwaadGharKa** (Taste of Home) is a modern, full-stack food delivery platform that connects home chefs with food lovers. Built with cutting-edge technologies, it offers a seamless experience for ordering authentic homemade meals.

## 🌟 Features

### 🍕 For Customers
- **Browse Authentic Home Meals** - Discover dishes from local home chefs
- **Smart Menu System** - Filter by cuisine, dietary preferences, and ratings
- **Real-time Cart Management** - Add items, modify quantities, and track totals
- **Secure Payment Processing** - Multiple payment options including UPI, Stripe, and Razorpay
- **Order Tracking** - Real-time updates on order status and delivery
- **User Profiles** - Save preferences, view order history, and manage addresses
- **Responsive Design** - Seamless experience across all devices

### 👨‍🍳 For Home Chefs
- **Menu Management** - Easy CRUD operations for menu items
- **Order Management** - Accept, reject, and track orders
- **Analytics Dashboard** - Sales reports and customer insights
- **Profile Management** - Update kitchen details and availability
- **Payment Processing** - Secure payment collection and disbursement

### 🛡️ Security & Performance
- **JWT Authentication** - Secure user sessions and API access
- **Rate Limiting** - Protection against abuse and DDoS attacks
- **Input Validation** - Comprehensive data sanitization and validation
- **CORS Protection** - Secure cross-origin resource sharing
- **XSS Prevention** - Protection against cross-site scripting attacks
- **MongoDB Sanitization** - Prevention of NoSQL injection attacks

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swaadgharka.git
   cd swaadgharka
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   # Frontend (.env)
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   
   # Backend (.env)
   MONGODB_URI=mongodb://localhost:27017/swaadgharka
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:8080
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Hero.tsx        # Landing page hero section
│   ├── Navigation.tsx  # Main navigation
│   └── Cart.tsx        # Shopping cart component
├── pages/              # Route components
│   ├── Index.tsx       # Home page
│   ├── Menu.tsx        # Menu browsing
│   ├── Payment.tsx     # Payment processing
│   └── Contact.tsx     # Contact form
├── context/            # React context providers
│   └── CartContext.tsx # Shopping cart state
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── config/             # Configuration files
```

### Backend Architecture
```
backend/
├── routes/             # API route handlers
│   ├── auth.js         # Authentication routes
│   ├── menu.js         # Menu management
│   ├── orders.js       # Order processing
│   └── payments.js     # Payment processing
├── models/             # MongoDB schemas
│   ├── User.js         # User model
│   ├── MenuItem.js     # Menu item model
│   └── Order.js        # Order model
├── middleware/         # Express middleware
│   ├── auth.js         # JWT authentication
│   └── errorHandler.js # Error handling
└── config/             # Configuration files
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Stripe** - Payment processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Multer** - File upload handling
- **Nodemailer** - Email functionality
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vite** - Development server and build tool

## 📱 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
```

### Menu Endpoints
```http
GET    /api/menu           # Get all menu items
GET    /api/menu/:id       # Get specific menu item
POST   /api/menu           # Create menu item (Admin)
PUT    /api/menu/:id       # Update menu item (Admin)
DELETE /api/menu/:id       # Delete menu item (Admin)
```

### Order Endpoints
```http
GET    /api/orders         # Get user orders
POST   /api/orders         # Create new order
GET    /api/orders/:id     # Get specific order
PUT    /api/orders/:id     # Update order status
```

### Payment Endpoints
```http
POST /api/payments/create-intent  # Create payment intent
POST /api/payments/confirm        # Confirm payment
GET  /api/payments/history        # Payment history
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend Deployment (Railway)
```bash
# Connect to Railway
railway login
railway link
railway up
```

### Environment Variables for Production
```bash
# Frontend (.env.production)
VITE_API_URL=https://your-api-domain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend (.env.production)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

## 🧪 Testing

### Frontend Testing
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Testing
```bash
cd backend

# Run tests
npm test

# Seed database
npm run seed

# Clean database
npm run clean
```

## 📊 Performance Metrics

- **Bundle Size**: 226.69 kB (main bundle)
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **API Response Time**: < 200ms average
- **Database Queries**: Optimized with proper indexing
- **Security Audit**: Zero vulnerabilities in production dependencies

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style Guidelines
- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Vite** - For the lightning-fast build tool
- **MongoDB** - For the reliable database solution
- **Stripe** - For secure payment processing

---

<div align="center">
  <p>Made with ❤️ by Soumya</p>
  <p>Bringing the taste of home to your doorstep</p>
</div>
