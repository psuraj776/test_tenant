// Validation utilities for user details form

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Name validation
export const validateName = (name: string): ValidationResult => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  // Allow letters, spaces, apostrophes, and hyphens
  if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, apostrophes, and hyphens' };
  }
  
  return { isValid: true };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!trimmedEmail) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (trimmedEmail.length > 100) {
    return { isValid: false, error: 'Email must be less than 100 characters' };
  }
  
  return { isValid: true };
};

// City validation
export const validateCity = (city: string): ValidationResult => {
  const trimmedCity = city.trim();
  
  if (!trimmedCity) {
    return { isValid: false, error: 'City is required' };
  }
  
  if (trimmedCity.length < 2) {
    return { isValid: false, error: 'City must be at least 2 characters' };
  }
  
  if (trimmedCity.length > 50) {
    return { isValid: false, error: 'City must be less than 50 characters' };
  }
  
  // Allow letters, spaces, apostrophes, hyphens, and parentheses
  if (!/^[a-zA-Z\s'()-]+$/.test(trimmedCity)) {
    return { isValid: false, error: 'City can only contain letters, spaces, and common punctuation' };
  }
  
  return { isValid: true };
};

// Future extensible validation functions
export const validatePhoneNumber = (phone: string): ValidationResult => {
  // This could be used for additional phone validation in the future
  return { isValid: true };
};

export const validateAge = (age: string): ValidationResult => {
  // Future age validation
  const numAge = parseInt(age);
  if (isNaN(numAge) || numAge < 18 || numAge > 100) {
    return { isValid: false, error: 'Please enter a valid age between 18 and 100' };
  }
  return { isValid: true };
};

// Utility function to format name (capitalize first letters)
export const formatName = (name: string): string => {
  return name
    .trim()
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

// Utility function to format city name
export const formatCity = (city: string): string => {
  return city
    .trim()
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

// Comprehensive form validation
export interface UserFormData {
  name: string;
  email: string;
  city: string;
  // Future fields can be added here
  // age?: string;
  // profession?: string;
  // bio?: string;
}

export interface UserFormErrors {
  name?: string | undefined;
  email?: string | undefined;
  city?: string | undefined;
  // Future error fields
  // age?: string | undefined;
  // profession?: string | undefined;
  // bio?: string | undefined;
}

export const validateUserForm = (formData: UserFormData): {
  isValid: boolean;
  errors: UserFormErrors;
} => {
  const errors: UserFormErrors = {};
  
  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid && nameValidation.error) {
    errors.name = nameValidation.error;
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.email = emailValidation.error;
  }
  
  // Validate city
  const cityValidation = validateCity(formData.city);
  if (!cityValidation.isValid && cityValidation.error) {
    errors.city = cityValidation.error;
  }
  
  // Future validations can be added here
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};