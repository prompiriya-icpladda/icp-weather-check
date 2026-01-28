import { z } from 'zod';

// Allowlist of trusted domains for iframe embedding
// Add more domains as needed - only these domains can be embedded
const ALLOWED_DOMAINS = [
  'xn--42cah7d0cxcvbbb9x.com',  // Holiday site (วันหยุด)
  'oil-price.bangchak.co.th',    // Oil price site
  'docs.google.com',
  'www.google.com',
  'youtube.com',
  'www.youtube.com',
  'calendar.google.com',
  'maps.google.com',
  'weather.com',
  'tmd.go.th',
  'www.tmd.go.th',
];

/**
 * Check if a hostname matches an allowed domain
 * Supports exact match and subdomain match
 */
const isDomainAllowed = (hostname: string): boolean => {
  return ALLOWED_DOMAINS.some(domain => 
    hostname === domain || 
    hostname.endsWith('.' + domain)
  );
};

/**
 * Zod schema for validating iframe URLs
 * - Must be a valid URL
 * - Must use HTTPS protocol
 * - Must be from an approved domain
 */
export const iframeUrlSchema = z.string()
  .min(1, 'URL is required')
  .url('Must be a valid URL')
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      // Must use HTTPS for security
      return parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'URL must use HTTPS protocol')
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      return isDomainAllowed(parsedUrl.hostname);
    } catch {
      return false;
    }
  }, 'URL must be from an approved domain');

/**
 * Validate a URL and return validation result
 */
export const validateIframeUrl = (url: string): { valid: boolean; error?: string } => {
  const result = iframeUrlSchema.safeParse(url);
  if (result.success) {
    return { valid: true };
  }
  return { 
    valid: false, 
    error: result.error.errors[0]?.message || 'Invalid URL' 
  };
};

/**
 * List of allowed domains for display in UI
 */
export const getAllowedDomains = (): string[] => {
  return [...ALLOWED_DOMAINS];
};
