import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as abbreviated USD (e.g., $950, $1.2K, $3.4M, $2.0B)
 */
export function formatUsdAbbrev(amount?: number, options?: { decimals?: number }): string {
  const decimals = options?.decimals ?? 1;
  const value = typeof amount === 'number' && isFinite(amount) ? amount : 0;

  const sign = value < 0 ? '-' : '';
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000_000) {
    return `${sign}$${(absolute / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (absolute >= 1_000_000) {
    return `${sign}$${(absolute / 1_000_000).toFixed(decimals)}M`;
  }
  if (absolute >= 1_000) {
    return `${sign}$${(absolute / 1_000).toFixed(decimals)}K`;
  }
  return `${sign}$${absolute.toLocaleString('en-US')}`;
}

/**
 * Get user initials from display name or username
 * @param displayName - The display name (can be undefined)
 * @param username - The username as fallback
 * @param maxLength - Maximum number of initials to return (default: 2)
 * @returns Formatted initials string
 */
export function getUserInitials(
  displayName?: string | null, 
  username?: string, 
  maxLength: number = 2
): string {
  // Try to use display name first
  const name = displayName?.trim() || username?.trim() || '';
  
  if (!name) return '?';
  
  // Split by spaces and get first letters
  const words = name.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) return '?';
  
  // Get initials from words
  const initials = words
    .slice(0, maxLength)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials || '?';
}