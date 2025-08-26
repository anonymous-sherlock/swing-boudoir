/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Utilities and Fetch Wrapper
 * 
 * This module provides:
 * - Centralized fetch wrapper with proper error handling
 * - Automatic authentication headers
 * - Proper base URL handling
 * - Request/response interceptors
 * - Generic type support for all API calls
 */

import { SignInWithEmailRequest, SignInWithUsernameRequest, SignUpWithEmailRequest, User_Type } from '@/types';
import { AUTH_TOKEN_KEY } from './auth';
import { getApiUrl, getAuthUrl } from './config';

// Common API response types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  errors?: Record<string, string[]>;
  data?: any;
}

// Union type for API responses
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Utility functions for API responses
 */
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

export const isApiError = <T>(response: ApiResponse<T>): response is ApiErrorResponse => {
  return response.success === false;
};

/**
 * Extract data from API response with type safety
 */
export const extractApiData = <T>(response: ApiResponse<T>): T | null => {
  if (isApiSuccess(response)) {
    return response.data;
  }
  return null;
};

/**
 * Extract error from API response
 */
export const extractApiError = <T>(response: ApiResponse<T>): string | null => {
  if (isApiError(response)) {
    return response.error;
  }
  return null;
};

// Request options interface
export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  requireAuth?: boolean;
  baseUrl?: 'api' | 'auth';
}

// Common request/response data types



export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
  bio?: string;
}


/**
 * Enhanced fetch wrapper with proper error handling and authentication
 */
const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    body,
    requireAuth = true,
    baseUrl = 'api',
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  // Build the full URL
  const url = baseUrl === 'auth' ? getAuthUrl(endpoint) : getApiUrl(endpoint);

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders,
  };

  // Add authentication if required
  if (requireAuth) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Prepare the request
  const requestConfig: RequestInit = {
    ...fetchOptions,
    headers,
  };

  // Add body if provided
  if (body) {
    if (body instanceof FormData) {
      // Remove Content-Type header for FormData (browser will set it with boundary)
      delete (headers as any)['Content-Type'];
      requestConfig.body = body;
    } else {
      requestConfig.body = JSON.stringify(body);
    }
  }

  try {

    const response = await fetch(url, requestConfig);

    // Handle different response types
    let responseData: any;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log(`API Response: ${response.status} ${response.statusText}`, responseData);

    // Handle successful responses
    if (response.ok) {
      return {
        success: true,
        data: responseData,
        message: responseData?.message
      };
    }

    // Handle error responses
    let errorMessage = 'Request failed';
    let errors: Record<string, string[]> | undefined;

    if (typeof responseData === 'object' && responseData !== null) {
      errorMessage = responseData.message || responseData.error || responseData.statusText || errorMessage;
      errors = responseData.errors;
    } else if (typeof responseData === 'string') {
      errorMessage = responseData;
    }

    // Add status code to error message if helpful
    if (response.status >= 400) {
      errorMessage = `${errorMessage} (${response.status})`;
    }

    return {
      success: false,
      error: errorMessage,
      errors,
      data: responseData
    };

  } catch (error) {
    console.error('API Request Error:', error);

    let errorMessage = 'Network error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * Authentication-specific API calls with generic response types
 */
export const authApi = {
  register: <T = any>(userData: SignUpWithEmailRequest) =>
    api.post<T>('/sign-up/email', userData, { baseUrl: 'auth', requireAuth: false }),

  login: <T = any>(credentials: SignInWithEmailRequest) =>
    api.post<T>('/sign-in/email', credentials, { baseUrl: 'auth', requireAuth: false }),

  loginWithUsername: <T = any>(credentials: SignInWithUsernameRequest) =>
    api.post<T>('/sign-in/username', credentials, { baseUrl: 'auth', requireAuth: false }),

  loginWithGoogle: <T = any>(data: { provider: string; callbackURL: string; type?: User_Type }) =>
    api.post<T>('/sign-in/social?type=' + data.type, data, { baseUrl: 'auth', requireAuth: false, }),

  logout: <T = any>() =>
    api.post<T>('/sign-out', {}, { baseUrl: 'auth' }),

  getSession: <T = any>() =>
    api.get<T>('/get-session', { baseUrl: 'auth', requireAuth: true }),

  getOAuthSession: <T = any>() =>
    api.get<T>('/get-session', {
      baseUrl: 'auth', requireAuth: false, credentials: 'include'
    }),

  refreshToken: <T = any>() =>
    api.post<T>('/refresh', {}, { baseUrl: 'auth' }),

  updateUser: <T = any>(data: { name?: string; image?: string }) =>
    api.post<T>('/update-user', data, { baseUrl: 'auth', requireAuth: true }),

  changePassword: <T = any>(data: { currentPassword: string; newPassword: string }) =>
    api.post<T>('/change-password', data, { baseUrl: 'auth' }),

  deleteUser: <T = any>(data: { password: string }) =>
    api.post<T>('/delete-user', data, { baseUrl: 'auth' }),

  requestPasswordReset: <T = any>(data: { email: string; callbackURL: string }) =>
    api.post<T>('/request-password-reset', data, { baseUrl: 'auth', requireAuth: false }),

  resetPassword: <T = any>(data: { token: string; newPassword: string }) =>
    api.post<T>('/reset-password', data, { baseUrl: 'auth', requireAuth: false }),

  sendVerificationEmail: <T = any>(data: { email: string; callbackURL: string }) =>
    api.post<T>('/send-verification-email', data, { baseUrl: 'auth', requireAuth: false }),

  verifyEmail: <T = any>(data: { token: string }) =>
    api.get<T>(`/verify-email?token=${data.token}`, { baseUrl: 'auth', requireAuth: false }),

  listSessions: <T = any>() =>
    api.get<T>('/list-sessions', { baseUrl: 'auth' }),

  revokeSession: <T = any>(data: { token: string }) =>
    api.post<T>('/revoke-session', data, { baseUrl: 'auth' }),

  revokeAllSessions: <T = any>() =>
    api.post<T>('/revoke-sessions', {}, { baseUrl: 'auth' }),

  revokeOtherSessions: <T = any>() =>
    api.post<T>('/revoke-other-sessions', {}, { baseUrl: 'auth' }),

  isUsernameAvailable: <T = any>(data: { username: string }) =>
    api.post<T>('/is-username-available', data, { baseUrl: 'auth', requireAuth: false }),
};
