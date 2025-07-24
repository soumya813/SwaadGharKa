# SwaadGharKa Deployment Guide

## 🚀 Deployment Readiness Checklist

### Backend Deployment

#### Railway/Heroku/DigitalOcean:
1. **Environment Variables**: Set all variables from `.env.production`
2. **MongoDB**: Use the provided Atlas URI or set up a new cluster
3. **Domain**: Update `CLIENT_URL` and `CORS_ORIGIN` to your frontend domain
4. **Payment Keys**: Add production Stripe/Razorpay keys when ready to accept payments

#### Commands:
```bash
# Install dependencies
npm install

# Start production server
npm start

# Seed database (run once)
npm run seed
```

### Frontend Deployment

#### Vercel/Netlify/Railway:
1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Environment Variables**: Set `VITE_API_BASE_URL` to your backend domain

#### Update API Base URL:
Create `.env.production` in frontend root:
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Pre-Deployment Steps

1. **Update Payment Gateway URLs** in frontend payment components
2. **Configure Email Service** with production SMTP settings
3. **Set up Domain and SSL** certificates
4. **Test all API endpoints** in production environment
5. **Run security audit**: `npm audit`

### Production Environment Variables

#### Required for Backend:
- `NODE_ENV=production`
- `MONGODB_URI` (your production database)
- `JWT_SECRET` (generate a new secure one)
- `CLIENT_URL` (your frontend domain)
- `CORS_ORIGIN` (your frontend domain)

#### Optional but Recommended:
- Email service credentials for notifications
- Stripe/Razorpay production keys for real payments
- File upload service (AWS S3, Cloudinary)

### Security Notes

✅ **Implemented**:
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- Password hashing
- JWT authentication
- MongoDB sanitization

⚠️ **Additional for Production**:
- SSL/HTTPS certificates
- Environment-specific secrets
- Database backups
- Monitoring and logging
- Error tracking (Sentry)

### Deployment Platforms

#### Recommended Combinations:

1. **Full-Stack on Railway**:
   - Deploy both frontend and backend
   - Automatic HTTPS
   - Easy environment management

2. **Vercel + Railway**:
   - Frontend on Vercel
   - Backend on Railway
   - Best performance

3. **Netlify + Heroku**:
   - Frontend on Netlify
   - Backend on Heroku
   - Traditional approach

### Testing Deployment

1. **Health Check**: `GET /api/health`
2. **Menu API**: `GET /api/menu`
3. **Authentication**: `POST /api/auth/register`
4. **Frontend Build**: Ensure no build errors
5. **CORS**: Test cross-origin requests

## 🎉 Your App is Production Ready!

Once you deploy and update the environment variables, your SwaadGharKa application will be fully functional in production.
