import { API_CONFIG } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';

// API Service for handling HTTP requests
class ApiService {
  private readonly baseUrl = API_CONFIG.BASE_URL;

  // Generic request method with authentication
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear auth data
          await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
          throw new Error('Session expired. Please login again.');
        }
        
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const config: RequestInit = {
      method: 'POST',
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    return this.request<T>(endpoint, config);
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const config: RequestInit = {
      method: 'PUT',
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    return this.request<T>(endpoint, config);
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();