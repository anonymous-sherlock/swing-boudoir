/**
 * Authentication Context for Swing Boudoir Showcase
 * 
 * This context provides:
 * - Global authentication state management
 * - Manual email/password authentication
 * - User session management
 * - Protected route handling
 * 
 * @author Swing Boudoir Development Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthUrl, getCallbackUrl } from '../lib/config';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  username: string;
  displayUsername?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  handleRegister: (email: string, password: string, name: string, username: string) => Promise<void>;
  handleLoginWithEmail: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  checkUserNeedsOnboarding: (userId: string) => Promise<boolean>;
  
  // Session management
  getSession: () => Promise<void>;
  updateUser: (data: { name?: string; image?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteUser: (password: string) => Promise<void>;
  
  // Password reset
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  
  // Email verification
  sendVerificationEmail: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  
  // Social authentication
  signInWithSocial: (provider: string, idToken?: string) => Promise<void>;
  linkSocialAccount: (provider: string) => Promise<void>;
  
  // Session management
  listSessions: () => Promise<Session[]>;
  revokeSession: (token: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  revokeOtherSessions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility to check if user has a profile
const checkUserProfile = async (userId: string, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/v1/users/${userId}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 200) return true;
    if (response.status === 401 || response.status === 404) return false;
    return false;
  } catch (err) {
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get current session
  const getSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(getAuthUrl('/get-session'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        localStorage.setItem('token', data.session.token);
      } else {
        // Session expired or invalid
        localStorage.removeItem('token');
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        }
      } catch (error) {
      console.error('Error getting session:', error);
      localStorage.removeItem('token');
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

  // Check if user needs onboarding
  const checkUserNeedsOnboarding = async (userId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return true;

      const response = await fetch(`/api/v1/users/${userId}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profile = await response.json();
        return !profile; // Return true if profile doesn't exist (needs onboarding)
      }
      return true; // If error, assume needs onboarding
    } catch (error) {
      console.error('Error checking user profile:', error);
      return true;
    }
  };

  // Register user
  const handleRegister = async (email: string, password: string, name: string, username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const requestBody = {
        email,
        password,
        name,
        username,
        image: null,
        callbackURL: getCallbackUrl('/onboarding')
      };
      
      console.log('Register request:', {
        url: getAuthUrl('/sign-up/email'),
        body: { ...requestBody, password: '[HIDDEN]' }
      });

      const response = await authApi.register({
        name,
        email,
        password,
        username
      });

      if (!response.success) {
        console.error('Register error response:', response.error);
        // Don't store any data on error - throw immediately
        throw new Error(response.error || 'Registration failed');
      }
      
      console.log('Register success data:', response.data);
      
      const user = response.data?.user;
      // const token = response.data?.token || response.data?.session?.token;
      
      if (!user) {
        throw new Error('Invalid response from server');
      }

      
      // For new registrations, always go to onboarding
      navigate('/auth?login');
    } catch (error: unknown) {
      console.error('Register error:', error);
      if (error instanceof Error) {
        setError(error.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
      // Ensure no data is stored on error
      setUser(null);
      throw error; // Re-throw to be handled by component
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email
  const handleLoginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const requestBody = {
        email,
        password,
        callbackURL: getCallbackUrl('/onboarding')
      };
      
      console.log('Login request:', {
        url: getAuthUrl('/sign-in/email'),
        body: { ...requestBody, password: '[HIDDEN]' }
      });

      const response = await authApi.login({
        email,
        password
      });
      
      console.log('Login response:', response);
      
      if (!response.success) {
        console.error('Login error response:', response.error);
        throw new Error(response.error || 'Login failed');
      }
      
      console.log('Login success data:', response.data);
      
      const user = response.data?.user;
      const token = response.data?.token || response.data?.session?.token;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }
      
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      
      // For login, always go to dashboard (existing users should have completed onboarding)
      navigate('/onboarding');
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message || 'Login failed');
      } else {
        setError('Login failed');
      }
      throw error; // Re-throw to be handled by component
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(getAuthUrl('/sign-out'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  // Update user
  const updateUser = async (data: { name?: string; image?: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/update-user'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      setError(error instanceof Error ? error.message : 'Update failed');
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/change-password'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError(error instanceof Error ? error.message : 'Password change failed');
      throw error;
    }
  };

  // Delete user
  const deleteUser = async (password: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/delete-user'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Account deletion failed');
      }

      localStorage.removeItem('token');
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Delete user error:', error);
      setError(error instanceof Error ? error.message : 'Account deletion failed');
      throw error;
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(getAuthUrl('/request-password-reset'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          callbackURL: getCallbackUrl('/reset-password')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset request failed');
      }
    } catch (error) {
      console.error('Request password reset error:', error);
      setError(error instanceof Error ? error.message : 'Password reset request failed');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(getAuthUrl('/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error instanceof Error ? error.message : 'Password reset failed');
      throw error;
    }
  };

  // Send verification email
  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch(getAuthUrl('/send-verification-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          callbackURL: getCallbackUrl('/verify-email')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification email send failed');
      }
    } catch (error) {
      console.error('Send verification email error:', error);
      setError(error instanceof Error ? error.message : 'Verification email send failed');
      throw error;
    }
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(getAuthUrl(`/verify-email?token=${token}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }

      // Update user's email verification status
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
    } catch (error) {
      console.error('Verify email error:', error);
      setError(error instanceof Error ? error.message : 'Email verification failed');
      throw error;
    }
  };

  // Sign in with social
  const signInWithSocial = async (provider: string, idToken?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch(getAuthUrl('/sign-in/social'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          idToken,
          callbackURL: getCallbackUrl('/dashboard')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Social login failed');
      }

      const data = await response.json();
      setUser(data.user);
      setSession(data.session);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.session.token);
      
      // Check if user needs onboarding
      const needsOnboarding = await checkUserNeedsOnboarding(data.user.id);
      if (needsOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Social login error:', error);
      setError(error instanceof Error ? error.message : 'Social login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Link social account
  const linkSocialAccount = async (provider: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/link-social'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          callbackURL: getCallbackUrl('/dashboard')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Social account linking failed');
      }
    } catch (error) {
      console.error('Link social account error:', error);
      setError(error instanceof Error ? error.message : 'Social account linking failed');
      throw error;
    }
  };

  // List sessions
  const listSessions = async (): Promise<Session[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/list-sessions'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to list sessions');
      }

      return await response.json();
    } catch (error) {
      console.error('List sessions error:', error);
      setError(error instanceof Error ? error.message : 'Failed to list sessions');
      throw error;
    }
  };

  // Revoke session
  const revokeSession = async (token: string) => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/revoke-session'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revoke session');
      }
    } catch (error) {
      console.error('Revoke session error:', error);
      setError(error instanceof Error ? error.message : 'Failed to revoke session');
      throw error;
    }
  };

  // Revoke all sessions
  const revokeAllSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/revoke-sessions'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revoke all sessions');
      }

      // Logout current session
      localStorage.removeItem('token');
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Revoke all sessions error:', error);
      setError(error instanceof Error ? error.message : 'Failed to revoke all sessions');
      throw error;
    }
  };

  // Revoke other sessions
  const revokeOtherSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(getAuthUrl('/revoke-other-sessions'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revoke other sessions');
      }
    } catch (error) {
      console.error('Revoke other sessions error:', error);
      setError(error instanceof Error ? error.message : 'Failed to revoke other sessions');
      throw error;
    }
  };

  // Initialize session on mount
  useEffect(() => {
    getSession();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    handleRegister,
    handleLoginWithEmail,
    handleLogout,
    checkUserNeedsOnboarding,
    getSession,
    updateUser,
    changePassword,
    deleteUser,
    requestPasswordReset,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
    signInWithSocial,
    linkSocialAccount,
    listSessions,
    revokeSession,
    revokeAllSessions,
    revokeOtherSessions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  return <>{children}</>;
}; 