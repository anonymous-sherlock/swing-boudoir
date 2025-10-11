/**
 * Environment-based API Configuration
 * 
 * This module provides dynamic API configuration that works in both
 * development (localhost) and production environments.
 */

// Detect current environment
const isDevelopment = import.meta.env.DEV;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Preferred dev host (can be overridden with VITE_API_HOST)
const DEV_HOST = (import.meta.env.VITE_API_HOST as string) || 'http://localhost:9999';
const PROD_HOST = 'https://api.swingboudoirmag.com';


export const BASE_HOST_URL = isDevelopment || isLocalhost ? "http://localhost:5173" : "https://app.swingboudoirmag.com";

// API Base URLs - Using env-aware values
export const API_CONFIG = {
  // Better Auth API
  AUTH_BASE_URL: `${isDevelopment || isLocalhost ? DEV_HOST : PROD_HOST}/api/v1/auth`,

  // Main API
  API_BASE_URL: `${isDevelopment || isLocalhost ? DEV_HOST : PROD_HOST}/api/v1`,
  API_BASE_HOST: isDevelopment || isLocalhost ? DEV_HOST : PROD_HOST,

  // Upload service
  UPLOAD_URL: `${isDevelopment || isLocalhost ? DEV_HOST : PROD_HOST}/api/v1/uploadthing`,

  // Current origin for callback URLs
  CURRENT_ORIGIN: window.location.origin,

  // Environment info
  IS_DEVELOPMENT: isDevelopment,
  IS_LOCALHOST: isLocalhost
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // If endpoint starts with /api/v1, use host + endpoint
  if (endpoint.startsWith('/api/v1')) {
    return `${API_CONFIG.API_BASE_HOST}${endpoint}`;
  }

  // Otherwise, prepend the API base URL
  return `${API_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function to get auth API URL
export const getAuthUrl = (endpoint: string): string => {
  return `${API_CONFIG.AUTH_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function to get relative path
export const getCallbackUrl = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`;
};


export const getFullCallbackUrl = (path: string): string => {
  return `${API_CONFIG.CURRENT_ORIGIN}${getCallbackUrl(path)}`;
};

/**
 * Generate OAuth callback URL with redirect parameter
 * This is used for social login flows where the backend needs to redirect back to frontend
 */
export const getOAuthCallbackUrl = (redirectTo?: string): string => {
  const baseCallbackUrl = getFullCallbackUrl('/auth/callback');

  if (!redirectTo) {
    return baseCallbackUrl;
  }

  return `${baseCallbackUrl}?redirectTo=${encodeURIComponent(redirectTo)}`;
};