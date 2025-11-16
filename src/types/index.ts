// Core user types
export interface User {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  
  // Basic details (extensible)
  name?: string;
  email?: string;
  city?: string;
  
  // Future extensible fields
  additionalDetails?: Record<string, any>;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface OtpVerification {
  phoneNumber: string;
  otp: string;
  isVerifying: boolean;
  error: string | null;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  UserDetails: { user: Partial<User> };
};

export type MainTabParamList = {
  Map: undefined;
  Profile: undefined;
  Chat: undefined;
  Saved: undefined;
  Contribution: undefined;
  Flag: undefined;
  About: undefined;
};

// Backend service types
export interface IAuthService {
  sendOtp(phoneNumber: string): Promise<void>;
  verifyOtp(phoneNumber: string, otp: string): Promise<{ user: User; token: string }>;
  refreshToken(): Promise<string>;
  logout(): Promise<void>;
}

export interface IUserService {
  updateUser(user: Partial<User>): Promise<User>;
  getUser(id: string): Promise<User>;
}

// Map related types
export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  type: 'review' | 'flat' | 'flatmate' | 'sell';
  ageInDays: number;
  color: string; // VIBGYOR based on age
}

export interface PostType {
  id: string;
  type: 'review' | 'flat' | 'flatmate' | 'sell';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: number;
  userId: string;
}