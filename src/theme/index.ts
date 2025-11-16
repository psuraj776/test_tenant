// Design tokens for the Tenant Community app
export const colors = {
  // Primary colors
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#64B5F6',
  
  // Secondary colors
  secondary: '#FF9800',
  secondaryDark: '#F57C00',
  secondaryLight: '#FFB74D',
  
  // VIBGYOR pin colors (by age)
  vibgyor: {
    violet: '#9C27B0', // ≤ 1 day
    indigo: '#3F51B5', // ≤ 3 days
    blue: '#2196F3',   // ≤ 7 days
    green: '#4CAF50',  // ≤ 14 days
    yellow: '#FFEB3B', // ≤ 30 days
    orange: '#FF9800', // ≤ 60 days
    red: '#F44336'     // > 60 days
  },
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#E0E0E0',
  
  // Text colors
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Border colors
  border: '#E0E0E0',
  divider: '#EEEEEE',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 48,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Utility function to get VIBGYOR color based on age
export const getVibgyorColor = (ageInDays: number): string => {
  if (ageInDays <= 1) return colors.vibgyor.violet;
  if (ageInDays <= 3) return colors.vibgyor.indigo;
  if (ageInDays <= 7) return colors.vibgyor.blue;
  if (ageInDays <= 14) return colors.vibgyor.green;
  if (ageInDays <= 30) return colors.vibgyor.yellow;
  if (ageInDays <= 60) return colors.vibgyor.orange;
  return colors.vibgyor.red;
};