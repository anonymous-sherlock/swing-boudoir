import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { AdminUser } from '../types/adminTypes';

interface UseAdminAuthReturn {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

interface AdminSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'moderator';
  isAuthenticated: boolean;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = async (): Promise<boolean> => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      
      if (!adminSession) {
        setIsAuthenticated(false);
        setAdmin(null);
        return false;
      }

      const session: AdminSession = JSON.parse(adminSession);
      
      if (session.isAuthenticated) {
        // Convert session to AdminUser format
        const adminUser: AdminUser = {
          id: session.id,
          email: session.email,
          firstName: session.firstName,
          lastName: session.lastName,
          role: session.role,
          createdAt: new Date().toISOString() // We don't store this in session, so use current time
        };
        
        setAdmin(adminUser);
        setIsAuthenticated(true);
        return true;
      } else {
        localStorage.removeItem('adminSession');
        setAdmin(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminSession');
      setAdmin(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get stored admin data from localStorage
      const storedAdmins = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      
      // Find admin with matching credentials
      const admin = storedAdmins.find((admin: { email: string; password: string }) => 
        admin.email === email && admin.password === password
      );

      if (admin) {
        // Store admin session in localStorage
        const sessionData: AdminSession = {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          isAuthenticated: true
        };
        
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        // Convert to AdminUser format
        const adminUser: AdminUser = {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          createdAt: admin.createdAt || new Date().toISOString()
        };
        
        setAdmin(adminUser);
        setIsAuthenticated(true);
        
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Log admin logout action (optional for localStorage-based auth)
      console.log('Admin logout:', new Date().toISOString());
    } catch (error) {
      console.error('Logout action logging failed:', error);
    } finally {
      localStorage.removeItem('adminSession');
      setAdmin(null);
      setIsAuthenticated(false);
              router.navigate({ to: '/admin/login' });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const isAuth = await checkAuth();
      
      if (!isAuth) {
        // Redirect to admin login if not authenticated
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin') && currentPath !== '/admin/login' && currentPath !== '/admin/register') {
          router.navigate({ to: '/admin/login' });
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [navigate]);

  return {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
}; 