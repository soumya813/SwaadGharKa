import { loadStripe } from '@stripe/stripe-js';

// Replace this with your actual Stripe publishable key
// For demo purposes, using a test environment
const stripePublishableKey = 'pk_test_demo_key';

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);
