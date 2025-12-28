export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  notEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  isAlphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(value);
  },

  isNumeric: (value: string): boolean => {
    return /^[0-9]+$/.test(value);
  },

  containsNoSpecialChars: (value: string): boolean => {
    return /^[a-zA-Z0-9\s]+$/.test(value);
  },

  sanitizeFileName: (fileName: string): string => {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  },

  validateContentTitle: (title: string): { valid: boolean; error?: string } => {
    if (!validation.notEmpty(title)) {
      return { valid: false, error: 'Title is required' };
    }

    if (!validation.maxLength(title, 200)) {
      return { valid: false, error: 'Title must be less than 200 characters' };
    }

    return { valid: true };
  },

  validateContentBody: (body: string): { valid: boolean; error?: string } => {
    if (!validation.notEmpty(body)) {
      return { valid: false, error: 'Content body is required' };
    }

    if (!validation.maxLength(body, 1000000)) {
      return { valid: false, error: 'Content body is too long (max 1MB)' };
    }

    return { valid: true };
  },

  validateTags: (tags: string[]): { valid: boolean; error?: string } => {
    if (tags.length > 20) {
      return { valid: false, error: 'Maximum 20 tags allowed' };
    }

    for (const tag of tags) {
      if (tag.length > 50) {
        return { valid: false, error: 'Each tag must be less than 50 characters' };
      }

      if (!validation.containsNoSpecialChars(tag)) {
        return { valid: false, error: 'Tags can only contain letters, numbers, and spaces' };
      }
    }

    return { valid: true };
  },
};
