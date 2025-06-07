import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api/authService';

interface User {
  id: number;
  email: string;
  name: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user state from localStorage
    const authData = authService.getStoredAuthData();
    return authData?.user || null;
  });

  // Check authentication status and refresh token periodically
  useEffect(() => {
    const checkAuth = () => {
      const authData = authService.getStoredAuthData();
      if (authData) {
        setUser(authData.user);
        // Refresh token to extend session
        authService.refreshToken();
      } else if (user) { // Only set to null if we had a user before
        setUser(null);
      }
    };

    // Set up periodic checks (every minute)
    const interval = setInterval(checkAuth, 60000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [user]);

  // Set up event listener for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authData') {
        if (e.newValue) {
          const authData = JSON.parse(e.newValue);
          setUser(authData.user);
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    await authService.register(data);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 