import { User } from '../../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../config';
import apiService from '../../../services/apiService';

// Authentication service
class AuthService {
  private readonly TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
  private readonly USER_KEY = STORAGE_KEYS.USER_DATA;

  // Send OTP via backend API
  async sendOtp(phoneNumber: string): Promise<void> {
    if (!this.isValidPhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    await apiService.post('/auth/send-otp', { phoneNumber });
    console.log(`OTP sent to ${phoneNumber}`);
  }

  // Verify OTP via backend API
  async verifyOtp(phoneNumber: string, otp: string): Promise<{ user: User; token: string }> {
    const data = await apiService.post<{ user: User; token: string }>('/auth/verify-otp', { 
      phoneNumber, 
      otp 
    });

    await AsyncStorage.setItem(this.TOKEN_KEY, data.token);
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

    return data;
  }

  // Update user details via backend API
  async updateUser(userDetails: Partial<User>): Promise<User> {
    const updatedUser = await apiService.put<User>('/auth/profile', userDetails);
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
    await AsyncStorage.removeItem(this.USER_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getCurrentToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting current token:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getCurrentToken();
    const user = await this.getCurrentUser();
    return !!(token && user);
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{10,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }
}

export default new AuthService();