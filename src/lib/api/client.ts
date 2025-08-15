/**
 * Modern API Client with TanStack Query Best Practices
 * 
 * This module provides:
 * - Type-safe API client with automatic error handling
 * - Request/response interceptors
 * - Authentication handling
 * - Retry logic and caching strategies
 * - Environment-aware configuration
 */

import { API_CONFIG, getApiUrl, getAuthUrl } from '../config';
import { AUTH_TOKEN_KEY } from '../auth';

// Base API response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  errors?: Record<string, string[]>;
  data?: unknown;
  status?: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// API Error class for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request configuration interface
export interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown;
  requireAuth?: boolean;
  baseUrl?: 'api' | 'auth';
  timeout?: number;
}

// Utility functions for response handling
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

export const isApiError = <T>(response: ApiResponse<T>): response is ApiErrorResponse => {
  return response.success === false;
};

/**
 * Enhanced API client with modern best practices
 */
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 30000;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || API_CONFIG.API_BASE_HOST;
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Build request headers with authentication and content type
   */
  private buildHeaders(config: RequestConfig): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...config.headers,
    };

    // Add Content-Type for non-FormData requests
    if (!(config.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Add authentication if required
    if (config.requireAuth !== false) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Build full URL based on endpoint and base URL type
   */
  private buildUrl(endpoint: string, baseUrl: 'api' | 'auth' = 'api'): string {
    if (baseUrl === 'auth') {
      return getAuthUrl(endpoint);
    }
    return getApiUrl(endpoint);
  }

  /**
   * Process request body based on content type
   */
  private processBody(body: any): BodyInit | undefined {
    if (!body) return undefined;
    
    if (body instanceof FormData) {
      return body;
    }
    
    if (typeof body === 'object') {
      return JSON.stringify(body);
    }
    
    return body;
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  /**
   * Handle API errors with proper error types
   */
  private handleError(response: Response, data: any): never {
    let errorMessage = 'Request failed';
    let errors: Record<string, string[]> | undefined;

    if (typeof data === 'object' && data !== null) {
      errorMessage = data.message || data.error || data.statusText || errorMessage;
      errors = data.errors;
    } else if (typeof data === 'string') {
      errorMessage = data;
    }

    // Add status code context
    if (response.status >= 400) {
      errorMessage = `${errorMessage} (${response.status})`;
    }

    throw new ApiError(errorMessage, response.status, errors, data);
  }

  /**
   * Core request method with timeout and error handling
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      body,
      requireAuth = true,
      baseUrl = 'api',
      timeout = this.defaultTimeout,
      ...fetchOptions
    } = config;

    const url = this.buildUrl(endpoint, baseUrl);
    const headers = this.buildHeaders(config);
    const processedBody = this.processBody(body);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: processedBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await this.parseResponse(response);

      // Log for development
      if (API_CONFIG.IS_DEVELOPMENT) {
        console.log(`API ${fetchOptions.method || 'GET'} ${url}:`, {
          status: response.status,
          data: data,
        });
      }

      if (!response.ok) {
        this.handleError(response, data);
      }

      // Return data directly for successful responses
      return data?.data ?? data;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors, timeouts, etc.
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408);
        }
        throw new ApiError(error.message, 0);
      }

      throw new ApiError('Unknown error occurred', 0);
    }
  }

  // HTTP method shortcuts
  async get<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };
