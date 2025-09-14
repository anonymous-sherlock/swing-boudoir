/**
 * Image size variants for different use cases
 */
export type ImageSize = 'avatar' | 'thumbnail' | 'small' | 'medium' | 'large' | 'full' | 'original' | "banner" | "gallery";

/**
 * Image transformation options based on the actual API specification
 */
export interface ImageTransformOptions {
    /** Width in pixels */
    w?: number;
    /** Height in pixels */
    h?: number;
    /** Quality (1-100) */
    q?: number;
    /** Format (jpeg, png, webp, avif) */
    f?: 'jpeg' | 'png' | 'webp' | 'avif';
    /** Fit mode for resizing */
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    /** Position for cropping */
    position?: 'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top' | 'center';
    /** Background color for transparent images */
    bg?: string;
    /** Blur effect (0-1000) */
    blur?: number;
    /** Sharpen effect (0-1000) */
    sharpen?: number;
    /** Convert to grayscale */
    grayscale?: boolean;
    /** Negate colors */
    negate?: number;
    /** Normalize colors */
    normalize?: number;
    /** Threshold for black and white conversion */
    threshold?: number;
    /** Gamma correction */
    gamma?: number;
    /** Brightness adjustment (-100 to 100) */
    brightness?: number;
    /** Saturation adjustment (-100 to 100) */
    saturation?: number;
    /** Hue rotation (0-360) */
    hue?: number;
    /** Rotation angle (0-360) */
    rotate?: number;
    /** Flip vertically */
    flip?: boolean;
    /** Flop horizontally */
    flop?: boolean;
}

/**
 * Predefined image size configurations
 */
export interface ImageSizeConfig {
    w: number | undefined;
    h: number | undefined;
    q: number | undefined;
    f: 'webp' | 'jpeg';
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Image URL with transformation parameters
 */
export interface TransformedImageUrl {
    original: string;
    transformed: string;
    size: ImageSize;
    options: ImageTransformOptions;
}

/**
 * Error response from image transformation API
 */
export interface ImageTransformError {
    error: string;
    message: string;
    code?: string;
}


/**
 * Image transformation response types
 */
export type ImageTransformResponse =
    | { success: true; data: Uint8Array; url: string }
    | { success: false; error: ImageTransformError };

/**
 * Image loading states
 */
export type ImageLoadingState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Image error types
 */
export type ImageErrorType = 'network' | 'format' | 'size' | 'transform' | 'unknown';
