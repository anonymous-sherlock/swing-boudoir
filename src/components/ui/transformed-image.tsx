/**
 * TransformedImage Component
 * 
 * A React component that automatically handles image transformation,
 * loading states, error handling, and responsive images.
 */

import React, { forwardRef, useMemo } from 'react';
import { useImageTransform, useResponsiveImage } from '@/hooks/useImageTransform';
import { ImageHelper } from '@/lib/image-helper';
import type { ImageSize, ImageTransformOptions } from '@/types/image.types';
import { cn } from '@/lib/utils';

interface TransformedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Original image URL */
  src: string | null | undefined;
  /** Image size variant */
  size?: ImageSize;
  /** Custom transformation options */
  transformOptions?: ImageTransformOptions;
  /** Enable responsive images */
  responsive?: boolean;
  /** Responsive breakpoints */
  breakpoints?: Array<{ size: ImageSize; density: number }>;
  /** Fallback image URL */
  fallbackSrc?: string;
  /** Show loading placeholder */
  showLoading?: boolean;
  /** Loading placeholder component */
  loadingComponent?: React.ReactNode;
  /** Show error placeholder */
  showError?: boolean;
  /** Error placeholder component */
  errorComponent?: React.ReactNode;
  /** Enable preloading */
  preload?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Image loading strategy */
  loading?: 'lazy' | 'eager';
  /** Alt text for accessibility */
  alt: string;
}

const defaultBreakpoints: Array<{ size: ImageSize; density: number }> = [
  { size: 'small', density: 1 },
  { size: 'medium', density: 2 },
  { size: 'large', density: 3 }
];

const defaultLoadingComponent = (
  <div className="flex items-center justify-center bg-gray-100 animate-pulse">
    <div className="w-8 h-8 bg-gray-300 rounded"></div>
  </div>
);

const defaultErrorComponent = (
  <div className="flex items-center justify-center bg-gray-100 text-gray-500">
    <div className="text-center">
      <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded flex items-center justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-xs">Image unavailable</p>
    </div>
  </div>
);

export const TransformedImage = forwardRef<HTMLImageElement, TransformedImageProps>(
  ({
    src,
    size = 'medium',
    transformOptions = {},
    responsive = false,
    breakpoints = defaultBreakpoints,
    fallbackSrc,
    showLoading = true,
    loadingComponent = defaultLoadingComponent,
    showError = true,
    errorComponent = defaultErrorComponent,
    preload = false,
    className,
    loading = 'lazy',
    alt,
    ...props
  }, ref) => {
    // Get transformed image URL
    const imageTransform = useImageTransform(src, transformOptions, {
      preload,
      retryAttempts: 3,
      retryDelay: 1000
    });

    // Get responsive srcset if enabled
    const responsiveData = useResponsiveImage(
      src,
      breakpoints,
      transformOptions,
      { preload: false }
    );

    // Determine which URL to use
    const imageUrl = useMemo(() => {
      if (imageTransform.error && fallbackSrc) {
        return ImageHelper.thumbnail(fallbackSrc);
      }
      return imageTransform.url;
    }, [imageTransform.error, imageTransform.url, fallbackSrc]);

    // Determine if we should show loading state
    const isLoading = imageTransform.loading && showLoading;

    // Determine if we should show error state
    const hasError = imageTransform.error && showError;

    // Handle image load
    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      imageTransform.retry(); // Reset any previous errors
      props.onLoad?.(e);
    };

    // Handle image error
    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      props.onError?.(e);
    };

    // Render loading state
    if (isLoading) {
      return (
        <div className={cn("flex items-center justify-center", className)} {...props}>
          {loadingComponent}
        </div>
      );
    }

    // Render error state
    if (hasError) {
      return (
        <div className={cn("flex items-center justify-center", className)} {...props}>
          {errorComponent}
        </div>
      );
    }

    // Render image
    return (
      <img
        ref={ref}
        src={imageUrl}
        srcSet={responsive ? responsiveData.srcset : undefined}
        alt={alt}
        loading={loading}
        className={cn("object-cover", className)}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  }
);

TransformedImage.displayName = 'TransformedImage';

// Convenience components for common use cases
export const AvatarImage = forwardRef<HTMLImageElement, Omit<TransformedImageProps, 'size'>>(
  (props, ref) => (
    <TransformedImage
      ref={ref}
      size="medium"
      className="rounded-full"
      {...props}
    />
  )
);

AvatarImage.displayName = 'AvatarImage';

export const CoverImage = forwardRef<HTMLImageElement, Omit<TransformedImageProps, 'size'>>(
  (props, ref) => (
    <TransformedImage
      ref={ref}
      size="large"
      responsive
      className="w-full h-full object-cover"
      {...props}
    />
  )
);

CoverImage.displayName = 'CoverImage';

export const ThumbnailImage = forwardRef<HTMLImageElement, Omit<TransformedImageProps, 'size'>>(
  (props, ref) => (
    <TransformedImage
      ref={ref}
      size="thumbnail"
      className="rounded-lg"
      {...props}
    />
  )
);

ThumbnailImage.displayName = 'ThumbnailImage';

export const GalleryImage = forwardRef<HTMLImageElement, Omit<TransformedImageProps, 'size'>>(
  (props, ref) => (
    <TransformedImage
      ref={ref}
      size="medium"
      responsive
      className="w-full h-full object-cover rounded-lg"
      {...props}
    />
  )
);

GalleryImage.displayName = 'GalleryImage';

export const HeroImage = forwardRef<HTMLImageElement, Omit<TransformedImageProps, 'size'>>(
  (props, ref) => (
    <TransformedImage
      ref={ref}
      size="full"
      responsive
      className="w-full h-full object-cover"
      loading="eager"
      {...props}
    />
  )
);

HeroImage.displayName = 'HeroImage';
