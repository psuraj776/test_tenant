// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'  // Development
    : 'https://your-production-api.com/api', // Production
  
  WS_URL: __DEV__ 
    ? 'ws://localhost:3000'  // Development WebSocket
    : 'wss://your-production-api.com', // Production WebSocket
  
  TIMEOUT: 10000, // 10 seconds
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Tenant Community',
  VERSION: '1.0.0',
  DEBUG: __DEV__,
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: 28.6139, // Delhi coordinates as default
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  
  // Pin color configuration for VIBGYOR system
  PIN_COLORS: {
    VIOLET: '#8B00FF',   // ≤ 1 day
    INDIGO: '#4B0082',   // ≤ 3 days
    BLUE: '#0000FF',     // ≤ 7 days
    GREEN: '#00FF00',    // ≤ 14 days
    YELLOW: '#FFFF00',   // ≤ 30 days
    ORANGE: '#FFA500',   // ≤ 60 days
    RED: '#FF0000',      // > 60 days
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};