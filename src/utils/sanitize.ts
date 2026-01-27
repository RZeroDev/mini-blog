import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'img', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Validate and sanitize image URL to prevent XSS
 */
export const sanitizeImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  // Remove any potential XSS vectors
  const sanitized = url.replace(/[<>"']/g, '');
  
  // Validate that it's a safe URL (http/https or relative path)
  try {
    // If it's a relative path, return it
    if (sanitized.startsWith('/') || sanitized.startsWith('uploads/')) {
      return sanitized;
    }
    
    // If it's an absolute URL, validate the protocol
    const urlObj = new URL(sanitized);
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return sanitized;
    }
    
    // Invalid protocol, return empty string
    return '';
  } catch (_e) {
    // If URL parsing fails, it might be a relative path
    if (sanitized.startsWith('/') || sanitized.startsWith('uploads/')) {
      return sanitized;
    }
    return '';
  }
};

/**
 * Sanitize category/post image URL with API base URL
 */
export const sanitizeApiImageUrl = (baseUrl: string, imagePath: string | undefined | null): string => {
  if (!imagePath) return '';
  
  const sanitizedPath = sanitizeImageUrl(imagePath);
  if (!sanitizedPath) return '';
  
  // Ensure base URL doesn't end with / and path doesn't start with /
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = sanitizedPath.startsWith('/') ? sanitizedPath : `/${sanitizedPath}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};
