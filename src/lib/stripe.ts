// Stripe configuration and utilities
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here',
  successUrl: `${window.location.origin}/voters/payment-success`,
  cancelUrl: `${window.location.origin}/voters/payment-failure`,
};

// Stripe price IDs for different vote packages
export const STRIPE_PRICE_IDS = {
  starter: 'price_starter_pack',
  popular: 'price_popular_choice', 
  premium: 'price_premium_pack',
  ultimate: 'price_ultimate_vip',
};

// Vote package configurations
export const VOTE_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    votes: 25,
    price: 5,
    stripePriceId: STRIPE_PRICE_IDS.starter,
  },
  {
    id: 'popular',
    name: 'Popular Choice',
    votes: 100,
    price: 15,
    originalPrice: 20,
    savings: 25,
    stripePriceId: STRIPE_PRICE_IDS.popular,
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    votes: 250,
    price: 35,
    originalPrice: 50,
    savings: 30,
    stripePriceId: STRIPE_PRICE_IDS.premium,
  },
  {
    id: 'ultimate',
    name: 'Ultimate VIP',
    votes: 1000,
    price: 100,
    originalPrice: 200,
    savings: 50,
    stripePriceId: STRIPE_PRICE_IDS.ultimate,
  },
];

// Utility function to get package by ID
export const getPackageById = (id: string) => {
  return VOTE_PACKAGES.find(pkg => pkg.id === id);
};

// Utility function to format price
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Utility function to calculate savings percentage
export const calculateSavings = (originalPrice: number, currentPrice: number) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
