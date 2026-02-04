import { z } from 'zod';

/**
 * Zod schema for validating iframe URLs
 * - Must be a valid URL
 * - Must use HTTPS protocol (for security)
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
  }, 'URL must use HTTPS protocol');

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
