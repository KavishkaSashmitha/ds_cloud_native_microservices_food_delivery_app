
import axios from 'axios';
import {
  LoginCredentials,
  RegisterUserData,
  LoginResponse,
  RegisterResponse, 
  GetUserResponse,
  LogoutResponse
} from './types';

// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
console.log('API URL being used:', API_URL);

// Create axios instance with improved options
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authApi = {
  // Register a new user
  register: async (userData: RegisterUserData): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Sending login request:', { email, password });
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      console.log('Login API raw response:', response);
      
      // Check if we have a valid response
      if (response.data && response.data.success && response.data.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<GetUserResponse> => {
    try {
      const response = await api.get<GetUserResponse>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async (): Promise<LogoutResponse> => {
    try {
      const response = await api.post<LogoutResponse>('/auth/logout');
      // Clear token regardless of API response
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should clear local storage
      localStorage.removeItem('token');
      throw error;
    }
  }
};

export default api;

