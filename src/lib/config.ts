/**
 * Environment-based API Configuration
 * 
 * This module provides dynamic API configuration that works in both
 * development (localhost) and production environments.
 */

// Detect current environment
const isDevelopment = import.meta.env.DEV;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API Base URLs - Using relative paths for universal compatibility
export const API_CONFIG = {
  // Better Auth API - use relative path (will be proxied in development)
  AUTH_BASE_URL: 'https://api.swingboudoirmag.com/api/v1/auth',
  
  // Main API - use relative URLs (works in both localhost and production)
  API_BASE_URL: 'https://api.swingboudoirmag.com/api/v1',
  
  // Upload service - use relative path (will be proxied in development)
  UPLOAD_URL: 'https://api.swingboudoirmag.com/api/v1/uploadthing',
  
  // Current origin for callback URLs
  CURRENT_ORIGIN: window.location.origin,
  
  // Environment info
  IS_DEVELOPMENT: isDevelopment,
  IS_LOCALHOST: isLocalhost
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // If endpoint starts with /api/v1, use relative URL
  if (endpoint.startsWith('/api/v1')) {
    return endpoint;
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