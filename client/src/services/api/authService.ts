import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface StoredAuthData {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
  expiresAt: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.178.56:3000';
const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize auth header from stored data
const storedAuthData = localStorage.getItem('authData');
if (storedAuthData) {
  try {
    const { token, expiresAt } = JSON.parse(storedAuthData);
    if (Date.now() < expiresAt) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error parsing stored auth data:', error);
  }
}

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const authDataStr = localStorage.getItem('authData');
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (Date.now() < authData.expiresAt) {
          config.headers.Authorization = `Bearer ${authData.token}`;
        } else {
          // Token has expired, remove it
          localStorage.removeItem('authData');
          delete config.headers.Authorization;
        }
      } catch (error) {
        console.error('Error parsing auth data in interceptor:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = response.data;
    
    const authData: StoredAuthData = {
      token,
      user,
      expiresAt: Date.now() + TOKEN_EXPIRATION_TIME
    };
    
    // Store the auth data in localStorage
    localStorage.setItem('authData', JSON.stringify(authData));
    
    return response.data;
  }

  async register(data: RegisterData): Promise<void> {
    await api.post('/auth/register', data);
  }

  logout(): void {
    localStorage.removeItem('authData');
    delete api.defaults.headers.common['Authorization'];
  }

  getCurrentUser() {
    const authData = this.getStoredAuthData();
    if (authData) {
      return authData.user;
    }
    return null;
  }

  getStoredAuthData(): StoredAuthData | null {
    const authDataStr = localStorage.getItem('authData');
    if (!authDataStr) return null;

    try {
      const authData: StoredAuthData = JSON.parse(authDataStr);
      
      // Check if the token has expired
      if (Date.now() > authData.expiresAt) {
        this.logout(); // Clear expired token
        return null;
      }
      
      return authData;
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      this.logout(); // Clear invalid data
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getStoredAuthData();
  }

  refreshToken(): void {
    const authData = this.getStoredAuthData();
    if (authData) {
      // Update expiration time
      const updatedAuthData: StoredAuthData = {
        ...authData,
        expiresAt: Date.now() + TOKEN_EXPIRATION_TIME
      };
      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
    }
  }
}

export const authService = new AuthService();
export { api }; 