// Configuration for user details form - easily extensible for future fields

export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'multiline';
  placeholder: string;
  required: boolean;
  maxLength?: number;
  validation?: 'name' | 'email' | 'phone' | 'city' | 'age' | 'custom';
  helperText?: string;
  options?: string[]; // For select type
  multiline?: boolean;
  numberOfLines?: number;
}

// Current basic fields configuration
export const BASIC_USER_FIELDS: FormFieldConfig[] = [
  {
    key: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
    maxLength: 50,
    validation: 'name',
    helperText: 'This will be displayed on your profile'
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'your.email@example.com',
    required: true,
    maxLength: 100,
    validation: 'email',
    helperText: 'We\'ll use this for important notifications'
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'Enter your city',
    required: true,
    maxLength: 50,
    validation: 'city',
    helperText: 'This helps us show relevant listings'
  }
];

// Future extensible fields (commented out for now, but ready to be enabled)
export const EXTENDED_USER_FIELDS: FormFieldConfig[] = [
  ...BASIC_USER_FIELDS,
  
  // Profile Information
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
    required: false,
    validation: 'age',
    helperText: 'Optional - helps with flatmate matching'
  },
  {
    key: 'profession',
    label: 'Profession',
    type: 'text',
    placeholder: 'e.g., Software Engineer, Student',
    required: false,
    maxLength: 100,
    helperText: 'What do you do for work or study?'
  },
  {
    key: 'bio',
    label: 'About Me',
    type: 'multiline',
    placeholder: 'Tell us a bit about yourself...',
    required: false,
    maxLength: 500,
    numberOfLines: 4,
    helperText: 'This will help others get to know you better'
  },
  
  // Preferences
  {
    key: 'lookingFor',
    label: 'Looking For',
    type: 'select',
    placeholder: 'Select what you\'re looking for',
    required: false,
    options: ['Rental Property', 'Flatmate', 'Buying Property', 'Just Browsing'],
    helperText: 'This helps us personalize your experience'
  },
  {
    key: 'budget',
    label: 'Budget Range',
    type: 'select',
    placeholder: 'Select your budget range',
    required: false,
    options: [
      'Under ₹10,000',
      '₹10,000 - ₹20,000',
      '₹20,000 - ₹30,000',
      '₹30,000 - ₹50,000',
      '₹50,000+',
      'Prefer not to say'
    ],
    helperText: 'This helps us show relevant properties'
  },
  
  // Contact Information
  {
    key: 'alternatePhone',
    label: 'Alternate Phone',
    type: 'phone',
    placeholder: '+91 9876543210',
    required: false,
    validation: 'phone',
    helperText: 'Optional backup contact number'
  },
  {
    key: 'whatsappNumber',
    label: 'WhatsApp Number',
    type: 'phone',
    placeholder: '+91 9876543210',
    required: false,
    validation: 'phone',
    helperText: 'For quick communication (optional)'
  },
  
  // Location Preferences
  {
    key: 'preferredAreas',
    label: 'Preferred Areas',
    type: 'text',
    placeholder: 'e.g., Koramangala, Indiranagar',
    required: false,
    maxLength: 200,
    helperText: 'Comma-separated list of preferred areas'
  },
  
  // Lifestyle Information
  {
    key: 'lifestyle',
    label: 'Lifestyle',
    type: 'select',
    placeholder: 'Select your lifestyle',
    required: false,
    options: ['Vegetarian', 'Non-Vegetarian', 'Jain Vegetarian', 'Vegan', 'No Preference'],
    helperText: 'This helps with flatmate compatibility'
  },
  {
    key: 'petPreference',
    label: 'Pet Preference',
    type: 'select',
    placeholder: 'Select your pet preference',
    required: false,
    options: ['Love Pets', 'Have Pets', 'No Pets', 'Allergic to Pets', 'No Preference'],
    helperText: 'Important for shared living arrangements'
  }
];

// Form sections for better organization (future enhancement)
export interface FormSection {
  title: string;
  description?: string;
  fields: string[]; // Field keys
  required?: boolean; // If any field in section is required
}

export const USER_FORM_SECTIONS: FormSection[] = [
  {
    title: 'Basic Information',
    description: 'Essential details for your profile',
    fields: ['name', 'email', 'city'],
    required: true
  },
  {
    title: 'Profile Details',
    description: 'Help others get to know you better',
    fields: ['age', 'profession', 'bio'],
    required: false
  },
  {
    title: 'Preferences',
    description: 'What are you looking for?',
    fields: ['lookingFor', 'budget', 'preferredAreas'],
    required: false
  },
  {
    title: 'Contact Information',
    description: 'Additional ways to reach you',
    fields: ['alternatePhone', 'whatsappNumber'],
    required: false
  },
  {
    title: 'Lifestyle',
    description: 'Important for flatmate matching',
    fields: ['lifestyle', 'petPreference'],
    required: false
  }
];

// Feature flags for gradual rollout of new fields
export const FEATURE_FLAGS = {
  EXTENDED_PROFILE: false, // Set to true to enable extended fields
  SECTIONED_FORM: false,   // Set to true to show form in sections
  OPTIONAL_FIELDS: true,   // Allow skipping optional fields
  PROGRESSIVE_DISCLOSURE: false, // Show fields progressively
};

// Get current form configuration based on feature flags
export const getCurrentFormConfig = (): FormFieldConfig[] => {
  if (FEATURE_FLAGS.EXTENDED_PROFILE) {
    return EXTENDED_USER_FIELDS;
  }
  return BASIC_USER_FIELDS;
};

// Helper function to get required fields
export const getRequiredFields = (config: FormFieldConfig[] = getCurrentFormConfig()): string[] => {
  return config.filter(field => field.required).map(field => field.key);
};

// Helper function to check if form is valid for submission
export const isFormValidForSubmission = (
  formData: Record<string, any>, 
  config: FormFieldConfig[] = getCurrentFormConfig()
): boolean => {
  const requiredFields = getRequiredFields(config);
  return requiredFields.every(field => formData[field] && formData[field].trim());
};