/**
 * API Utilities and Fetch Wrapper
 * 
 * This module provides:
 * - Centralized fetch wrapper with proper error handling
 * - Automatic authentication headers
 * - Proper base URL handling
 * - Request/response interceptors
 */

import { API_CONFIG, getApiUrl, getAuthUrl } from './config';

// Response interface for consistent API responses
export interface ApiResponse<T = any> {
  json(): unknown;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Request options interface
export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  requireAuth?: boolean;
  baseUrl?: 'api' | 'auth';
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
    const token = localStorage.getItem('token');
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
    console.log(`API Request: ${fetchOptions.method || 'GET'} ${url}`, {
      headers: { ...headers, Authorization: headers['Authorization'] ? '[HIDDEN]' : undefined },
      body: body instanceof FormData ? '[FormData]' : body
    });

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
      errorMessage = responseData.message || responseData.error || errorMessage;
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
 * Authentication-specific API calls
 */
export const authApi = {
  register: (userData: { name: string; email: string; password: string; username: string }) =>
    api.post('/sign-up/email', userData, { baseUrl: 'auth', requireAuth: false }),

  login: (credentials: { email: string; password: string }) =>
    api.post('/sign-in/email', credentials, { baseUrl: 'auth', requireAuth: false }),

  logout: () =>
    api.post('/sign-out', {}, { baseUrl: 'auth' }),

  getSession: () =>
    api.get('/get-session', { baseUrl: 'auth' }),

  refreshToken: () =>
    api.post('/refresh', {}, { baseUrl: 'auth' }),
};

/**
 * Competition-specific API calls
 */
export const competitionApi = {
  getAll: () =>
    api.get('/contests'),

  getById: (id: string) =>
    api.get(`/contests/${id}`),

  create: (competitionData: any) =>
    api.post('/contests', competitionData),

  update: (id: string, competitionData: any) =>
    api.put(`/contests/${id}`, competitionData),

  delete: (id: string) =>
    api.delete(`/contests/${id}`),

  register: (contestId: string) =>
    api.post(`/contests/${contestId}/register`),

  unregister: (contestId: string) =>
    api.delete(`/contests/${contestId}/register`),
};

/**
 * User profile API calls
 */
export const profileApi = {
  get: (userId?: string) =>
    api.get(userId ? `/users/${userId}/profile` : '/profile'),

  update: (profileData: any) =>
    api.put('/profile', profileData),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/profile-image', formData);
  },
};
