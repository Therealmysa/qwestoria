
import DOMPurify from 'dompurify';

// Sanitize HTML content for rich text fields
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code'],
    ALLOWED_ATTR: ['class'],
  });
};

// Sanitize plain text input
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

// Validate and sanitize mission form data
export const validateMissionData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }
  
  if (!data.reward_coins || data.reward_coins < 1 || data.reward_coins > 10000) {
    errors.push('La récompense doit être entre 1 et 10000 BradCoins');
  }
  
  if (data.external_link && !isValidUrl(data.external_link)) {
    errors.push('Le lien externe doit être une URL valide');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      title: sanitizeText(data.title),
      description: sanitizeText(data.description),
      reward_coins: Math.max(1, Math.min(10000, parseInt(data.reward_coins) || 0)),
      is_vip_only: Boolean(data.is_vip_only),
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      external_link: data.external_link && isValidUrl(data.external_link) ? data.external_link : null
    }
  };
};

// Validate and sanitize blog post data
export const validateBlogPostData = (data: any) => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 5) {
    errors.push('Le titre doit contenir au moins 5 caractères');
  }
  
  if (!data.content || data.content.trim().length < 50) {
    errors.push('Le contenu doit contenir au moins 50 caractères');
  }
  
  if (data.summary && data.summary.length > 500) {
    errors.push('Le résumé ne peut pas dépasser 500 caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      title: sanitizeText(data.title),
      content: sanitizeHtml(data.content),
      summary: data.summary ? sanitizeText(data.summary) : null,
      category: sanitizeText(data.category),
      published: Boolean(data.published),
      image_url: data.image_url && isValidUrl(data.image_url) ? data.image_url : null
    }
  };
};
