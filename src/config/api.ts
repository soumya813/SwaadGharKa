// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  },
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-domain.com/api',
    timeout: 15000,
  }
};

const currentEnv = import.meta.env.MODE || 'development';
export const apiConfig = API_CONFIG[currentEnv as keyof typeof API_CONFIG];

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh'
  },
  // Menu
  menu: {
    list: '/menu',
    item: (id: string) => `/menu/${id}`,
    categories: '/menu/categories',
    search: '/menu/search'
  },
  // Orders
  orders: {
    create: '/orders',
    list: '/orders',
    item: (id: string) => `/orders/${id}`,
    track: (id: string) => `/orders/${id}/track`
  },
  // Payments
  payments: {
    create: '/payments/create',
    verify: '/payments/verify',
    refund: '/payments/refund'
  },
  // Contact
  contact: '/contact',
  // Health
  health: '/health'
};

export default apiConfig;
