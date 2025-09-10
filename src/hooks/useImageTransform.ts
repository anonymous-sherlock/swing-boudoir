/**
 * React Hook for Image Transformation
 * 
 * Provides a convenient way to use image transformations in React components
 * with loading states, error handling, and caching.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  transformImageUrl, 
  getImageUrl, 
  getMultipleImageUrls,
  preloadImage,
  transformImageWithErrorHandling,
  type ImageSize,
  type ImageTransformOptions,
  type ImageTransformError,
  type ImageTransformResponse,
  type ImageErrorType
} from '@/lib/image-helper';

interface UseImageTransformOptions {
  /** Enable preloading of the transformed image */
  preload?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Retry attempts on failure */
  retryAttempts?: number;
  /** Retry delay in milliseconds */
  retryDelay?: number;
}

interface UseImageTransformReturn {
  /** Transformed image URL */
  url: string;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Error type */
  errorType: ImageErrorType | null;
  /** Retry function */
  retry: () => void;
  /** Check if image is loaded */
  isLoaded: boolean;
}

/**
 * Hook for transforming a single image
 */
export function useImageTransform(
  originalUrl: string | null | undefined,
  options: ImageTransformOptions = {},
  hookOptions: UseImageTransformOptions = {}
): UseImageTransformReturn {
  const {
    preload = false,
    errorMessage = 'Failed to load image',
    retryAttempts = 3,
    retryDelay = 1000
  } = hookOptions;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ImageErrorType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const transformedUrl = useMemo(() => {
    if (!originalUrl) return '';
    try {
      return transformImageUrl(originalUrl, options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid image URL');
      setErrorType('transform');
      return '';
    }
  }, [originalUrl, options]);

  const loadImage = useCallback(async () => {
    if (!transformedUrl || !preload) {
      setIsLoaded(true);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorType(null);

    try {
      await preloadImage(originalUrl!, options);
      setIsLoaded(true);
      setRetryCount(0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : errorMessage;
      setError(errorMsg);
      setErrorType('network');
      
      // Retry logic
      if (retryCount < retryAttempts) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [transformedUrl, originalUrl, options, preload, errorMessage, retryCount, retryAttempts, retryDelay]);

  const retry = useCallback(() => {
    setRetryCount(0);
    setError(null);
    setErrorType(null);
    setIsLoaded(false);
  }, []);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return {
    url: transformedUrl,
    loading,
    error,
    errorType,
    retry,
    isLoaded
  };
}

/**
 * Hook for getting image URL by size
 */
export function useImageUrl(
  originalUrl: string | null | undefined,
  size: ImageSize = 'medium',
  customOptions: Partial<ImageTransformOptions> = {},
  hookOptions: UseImageTransformOptions = {}
): UseImageTransformReturn {
  const options = useMemo(() => ({
    ...customOptions
  }), [customOptions]);

  return useImageTransform(originalUrl, options, hookOptions);
}

/**
 * Hook for multiple image sizes
 */
export function useMultipleImageUrls(
  originalUrl: string | null | undefined,
  sizes: ImageSize[],
  customOptions: Partial<ImageTransformOptions> = {},
  hookOptions: UseImageTransformOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urls, setUrls] = useState<Record<ImageSize, string>>({} as Record<ImageSize, string>);

  useEffect(() => {
    if (!originalUrl) {
      setUrls({} as Record<ImageSize, string>);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transformedUrls = getMultipleImageUrls(originalUrl, sizes, customOptions);
      setUrls(transformedUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transform images');
    } finally {
      setLoading(false);
    }
  }, [originalUrl, sizes, customOptions]);

  return {
    urls,
    loading,
    error
  };
}

/**
 * Hook for responsive images with srcset
 */
export function useResponsiveImage(
  originalUrl: string | null | undefined,
  breakpoints: Array<{ size: ImageSize; density: number }>,
  customOptions: Partial<ImageTransformOptions> = {},
  hookOptions: UseImageTransformOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [srcset, setSrcset] = useState('');

  useEffect(() => {
    if (!originalUrl) {
      setSrcset('');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const responsiveSrcset = breakpoints
        .map(({ size, density }) => {
          const url = getImageUrl(originalUrl, size, customOptions);
          return `${url} ${density}x`;
        })
        .join(', ');
      
      setSrcset(responsiveSrcset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create responsive image');
    } finally {
      setLoading(false);
    }
  }, [originalUrl, breakpoints, customOptions]);

  return {
    srcset,
    loading,
    error
  };
}

/**
 * Hook for image with fallback
 */
export function useImageWithFallback(
  originalUrl: string | null | undefined,
  fallbackUrl: string,
  options: ImageTransformOptions = {},
  hookOptions: UseImageTransformOptions = {}
) {
  const primaryImage = useImageTransform(originalUrl, options, hookOptions);
  const fallbackImage = useImageTransform(fallbackUrl, options, hookOptions);

  const shouldUseFallback = useMemo(() => {
    return !originalUrl || (primaryImage.error && !primaryImage.loading);
  }, [originalUrl, primaryImage.error, primaryImage.loading]);

  return {
    url: shouldUseFallback ? fallbackImage.url : primaryImage.url,
    loading: shouldUseFallback ? fallbackImage.loading : primaryImage.loading,
    error: shouldUseFallback ? fallbackImage.error : primaryImage.error,
    errorType: shouldUseFallback ? fallbackImage.errorType : primaryImage.errorType,
    retry: shouldUseFallback ? fallbackImage.retry : primaryImage.retry,
    isLoaded: shouldUseFallback ? fallbackImage.isLoaded : primaryImage.isLoaded,
    isUsingFallback: shouldUseFallback
  };
}

/**
 * Hook for image transformation with detailed error handling
 */
export function useImageTransformWithErrorHandling(
  originalUrl: string | null | undefined,
  options: ImageTransformOptions = {},
  hookOptions: UseImageTransformOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ImageTransformError | null>(null);
  const [response, setResponse] = useState<ImageTransformResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const {
    preload = false,
    retryAttempts = 3,
    retryDelay = 1000
  } = hookOptions;

  const transformImage = useCallback(async () => {
    if (!originalUrl) {
      setResponse(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await transformImageWithErrorHandling(originalUrl, options);
      setResponse(result);
      
      if (!result.success) {
        setError(result.error);
        
        // Retry logic
        if (retryCount < retryAttempts) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, retryDelay);
        }
      } else {
        setRetryCount(0);
      }
    } catch (err) {
      const error: ImageTransformError = {
        error: 'Network error',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        code: 'NETWORK_ERROR'
      };
      setError(error);
      setResponse({ success: false, error });
    } finally {
      setLoading(false);
    }
  }, [originalUrl, options, retryCount, retryAttempts, retryDelay]);

  const retry = useCallback(() => {
    setRetryCount(0);
    setError(null);
    setResponse(null);
  }, []);

  useEffect(() => {
    if (preload) {
      transformImage();
    }
  }, [transformImage, preload]);

  return {
    response,
    loading,
    error,
    retry,
    isLoaded: response?.success || false,
    url: response?.success ? response.url : '',
    data: response?.success ? response.data : undefined
  };
}
