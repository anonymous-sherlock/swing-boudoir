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

import { AUTH_TOKEN_KEY } from './auth';
import { API_CONFIG, getApiUrl, getAuthUrl } from './config';

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
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  username: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
  bio?: string;
  // Add more profile fields as needed
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  prize: string;
  endDate: string;
  participants: number;
  status: 'active' | 'inactive' | 'completed';
  coverImage?: string;
  category?: string;
}

/**
 * Enhanced fetch wrapper with proper error handling and authentication
 */
export const apiRequest = async <T = any>(
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
    // console.log(`API Request: ${fetchOptions.method || 'GET'} ${url}`, {
    //   headers: { ...headers, Authorization: headers['Authorization'] ? '[HIDDEN]' : undefined },
    //   body: body instanceof FormData ? '[FormData]' : body
    // });

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
  register: <T = any>(userData: RegisterCredentials) =>
    api.post<T>('/sign-up/email', userData, { baseUrl: 'auth', requireAuth: false }),

  login: <T = any>(credentials: LoginCredentials) =>
    api.post<T>('/sign-in/email', credentials, { baseUrl: 'auth', requireAuth: false }),

  logout: <T = any>() =>
    api.post<T>('/sign-out', {}, { baseUrl: 'auth' }),

  getSession: <T = any>() =>
    api.get<T>('/get-session', { baseUrl: 'auth', requireAuth: true }),

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
};

/**
 * Competition-specific API calls with generic response types
 */
export const competitionApi = {
  getAll: <T = any>() =>
    api.get<T>('/contests'),

  getById: <T = any>(id: string) =>
    api.get<T>(`/contests/${id}`),

  create: <T = any>(competitionData: any) =>
    api.post<T>('/contests', competitionData),

  update: <T = any>(id: string, competitionData: any) =>
    api.put<T>(`/contests/${id}`, competitionData),

  delete: <T = any>(id: string) =>
    api.delete<T>(`/contests/${id}`),

  register: <T = any>(contestId: string) =>
    api.post<T>(`/contests/${contestId}/register`),

  unregister: <T = any>(contestId: string) =>
    api.delete<T>(`/contests/${contestId}/register`),
};

/**
 * User profile API calls with generic response types
 */
export const profileApi = {
  get: <T = any>(userId?: string) =>
    api.get<T>(userId ? `/users/${userId}/profile` : '/profile'),

  update: <T = any>(profileData: any) =>
    api.put<T>('/profile', profileData),

  uploadImage: <T = any>(file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<T>('/upload/profile-image', formData);
  },
};
