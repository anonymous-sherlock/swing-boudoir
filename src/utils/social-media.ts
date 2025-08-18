/**
 * Social Media URL Helper Functions
 * Converts usernames to full social media URLs
 */

export interface SocialMediaUrls {
  instagram?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  website?: string | null;
}

/**
 * Converts a social media username to its full URL
 */
export const getSocialMediaUrl = (platform: keyof SocialMediaUrls, username: string | null | undefined): string | null => {
  if (!username || username.trim() === '') {
    return null;
  }

  const cleanUsername = username.trim().replace(/^@/, ''); // Remove @ if present

  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${cleanUsername}`;
    case 'twitter':
      return `https://twitter.com/${cleanUsername}`;
    case 'facebook':
      return `https://facebook.com/${cleanUsername}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanUsername}`;
    case 'youtube':
      return `https://youtube.com/@${cleanUsername}`;
    case 'linkedin':
      return `https://linkedin.com/in/${cleanUsername}`;
    case 'website':
      // For website, assume it's already a URL if it starts with http/https
      return cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`;
    default:
      return null;
  }
};

/**
 * Converts all social media usernames in a profile to full URLs
 */
export const getSocialMediaUrls = (profile: {
  instagram?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  website?: string | null;
}): SocialMediaUrls => {
  return {
    instagram: getSocialMediaUrl('instagram', profile.instagram),
    twitter: getSocialMediaUrl('twitter', profile.twitter),
    facebook: getSocialMediaUrl('facebook', profile.facebook),
    tiktok: getSocialMediaUrl('tiktok', profile.tiktok),
    youtube: getSocialMediaUrl('youtube', profile.youtube),
    linkedin: getSocialMediaUrl('linkedin', profile.linkedin),
    website: getSocialMediaUrl('website', profile.website),
  };
};

/**
 * Validates if a social media username is valid
 */
export const isValidSocialMediaUsername = (platform: keyof SocialMediaUrls, username: string): boolean => {
  if (!username || username.trim() === '') {
    return false;
  }

  const cleanUsername = username.trim().replace(/^@/, '');

  // Basic validation patterns for different platforms
  const patterns = {
    instagram: /^[a-zA-Z0-9._]{1,30}$/,
    twitter: /^[a-zA-Z0-9_]{1,15}$/,
    facebook: /^[a-zA-Z0-9.]{5,50}$/,
    tiktok: /^[a-zA-Z0-9._]{2,24}$/,
    youtube: /^[a-zA-Z0-9_-]{3,30}$/,
    linkedin: /^[a-zA-Z0-9-]{3,100}$/,
    website: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic domain validation
  };

  return patterns[platform]?.test(cleanUsername) ?? false;
};
