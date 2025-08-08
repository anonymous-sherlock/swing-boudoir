/**
 * Authentication Utilities for Swing Boudoir Showcase
 * 
 * This module handles:
 * - Manual email/password authentication
 * - JWT token management and validation
 * - API authentication headers
 * - User session management
 * 
 * @author Swing Boudoir Development Team
 * @version 1.0.0
 */

import { jwtDecode } from 'jwt-decode';

// API Configuration
export const API_BASE_URL = '/api/v1';

// JWT Token Interface
export interface JWTPayload {
  sub: string;           // User ID
  email: string;         // User email
  name: string;          // User full name
  picture?: string;      // Profile picture URL
  iat: number;          // Issued at timestamp
  exp: number;          // Expiration timestamp
}

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Stored User Interface (includes password for localStorage)
interface StoredUser extends User {
  password: string;
}

// Authentication Response Interface
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

/**
 * Register new user with email and password
 * @param userData - User registration data
 * @returns Promise<AuthResponse> - Registration result with user data and token
 */
export const registerUser = async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  try {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    const emailExists = existingUsers.some((user: StoredUser) => user.email === userData.email);
    if (emailExists) {
      return {
        success: false,
        error: 'An account with this email already exists'
      };
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      picture: undefined,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create a simple token (in real app, this would be a JWT)
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add user to localStorage
    existingUsers.push({
      ...newUser,
      password: userData.password // In real app, this would be hashed
    });
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Store authentication data
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify(newUser));
    
    return {
      success: true,
      user: newUser,
      token: token
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    };
  }
};

/**
 * Authenticate user with email and password
 * @param credentials - User login credentials
 * @returns Promise<AuthResponse> - Authentication result with user data and token
 */
export const loginWithEmail = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching credentials
    const user = users.find((u: StoredUser) => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Create a simple token (in real app, this would be a JWT)
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store authentication data
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token: token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
};

/**
 * Validate and decode JWT token
 * @param token - JWT token to validate
 * @returns JWTPayload | null - Decoded token payload or null if invalid
 */
export const validateToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Get current authentication token
 * @returns string | null - Current token or null if not authenticated
 */
export const getAuthToken = (): string | null => {
  const token = sessionStorage.getItem('authToken');
  if (!token) return null;
  
  // Validate token before returning
  const isValid = validateToken(token);
  if (!isValid) {
    // Clear invalid token
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    return null;
  }
  
  return token;
};

/**
 * Get current user data
 * @returns User | null - Current user data or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  const userData = sessionStorage.getItem('userData');
  const token = getAuthToken();
  
  if (!userData || !token) {
    return null;
  }
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Logout user and clear session
 */
export const logout = (): void => {
  // Clear session storage
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userData');
  
  // Clear any refresh token timers
  if (window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
  }
};

/**
 * Setup automatic token refresh
 * @param token - Current JWT token
 */
const setupTokenRefresh = (token: string): void => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
    
    // Refresh token 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 60000); // Minimum 1 minute
    
    window.tokenRefreshTimer = setTimeout(async () => {
      await refreshToken();
    }, refreshTime);
  } catch (error) {
    console.error('Error setting up token refresh:', error);
  }
};

/**
 * Refresh authentication token
 */
const refreshToken = async (): Promise<void> => {
  try {
    const currentToken = getAuthToken();
    if (!currentToken) return;
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result: AuthResponse = await response.json();
    
    if (result.success && result.token) {
      sessionStorage.setItem('authToken', result.token);
      setupTokenRefresh(result.token);
    } else {
      // Token refresh failed, logout user
      logout();
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    logout();
  }
};

/**
 * Create authenticated API headers
 * @returns Headers object with authentication token
 */
export const createAuthHeaders = (): Headers => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  
  const token = getAuthToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  return headers;
};

/**
 * Check if user is authenticated
 * @returns boolean - True if user is authenticated and token is valid
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Extend Window interface for token refresh timer
declare global {
  interface Window {
    tokenRefreshTimer?: NodeJS.Timeout;
  }
}