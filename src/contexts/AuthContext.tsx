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

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUrl, getCallbackUrl } from "../lib/config";
import { authApi } from "@/lib/api";
import { GetSessionResponse, Session, SignInWithEmailRequest, SignInWithEmailResponse, SignUpWithEmailRequest, User } from "@/types/auth.types";
import { authPages, DEFAULT_AFTER_LOGIN_REDIRECT, DEFAULT_AFTER_LOGOUT_REDIRECT } from "@/routes";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageLoader } from "@/components/PageLoader";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Authentication methods
  handleRegister: (data: SignUpWithEmailRequest) => Promise<void>;
  handleLoginWithEmail: (data: SignInWithEmailRequest) => Promise<void>;
  handleLogout: () => Promise<void>;
  checkUserNeedsOnboarding: () => boolean;

  // Session management
  getSession: () => Promise<GetSessionResponse>;
  updateUser: (data: { name?: string; image?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteUser: (password: string) => Promise<void>;

  // Password reset
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;

  // Email verification
  sendVerificationEmail: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;

  // Session management
  listSessions: () => Promise<Session[]>;
  revokeSession: (token: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  revokeOtherSessions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: sessionUserData,
    isLoading: isSessionLoading,
    error: sessionError,
    refetch: refetchSession,
    isSuccess,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        throw new Error("No authentication token");
      }
      const response = await authApi.getSession<GetSessionResponse>();
      if (!response.success) throw new Error("Session fetch failed");
      return response.data;
    },
    enabled: !!localStorage.getItem(AUTH_TOKEN_KEY), // Only run query if token exists
    retry: false,
    refetchOnWindowFocus: false, // Changed to false to prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // Increased to 5 minutes
  });

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      // No token means no session - immediately set auth state
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // If we have a token but no session data yet, keep loading
    if (!sessionUserData) {
      return;
    }

    // We have both token and session data
    if (isSuccess && sessionUserData) {
      setSession(sessionUserData.session);
      setUser(sessionUserData.user);
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [isSuccess, sessionUserData]);

  // Handle initial loading state
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      // No token means no auth needed - set loading to false immediately
      setIsLoading(false);
      return;
    }

    // We have a token, so we need to fetch the session
    setIsLoading(true);
    refetchSession().finally(() => {
      setIsLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register user
  const handleRegister = async (data: SignUpWithEmailRequest) => {
    const { name, email, password, username } = data;
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register({
        name,
        email,
        password,
        username,
      });

      if (!response.success) {
        console.error("Register error response:", response.error);
        // Don't store any data on error - throw immediately
        throw new Error(response.error || "Registration failed");
      }

      if (!response.data?.user) {
        throw new Error("Invalid response from server");
      }

      // For new registrations, always go to onboarding
      navigate(authPages.login);
    } catch (error: unknown) {
      console.error("Register error:", error);
      if (error instanceof Error) {
        setError(error.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
      // Ensure no data is stored on error
      setUser(null);
      throw error; // Re-throw to be handled by component
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email
  const handleLoginWithEmail = async (data: SignInWithEmailRequest) => {
    const { email, password } = data;
    setIsLoading(true);
    setError(null);
    console.log(email, password);
    try {
      const response = await authApi.login<SignInWithEmailResponse>({
        email,
        password,
      });

      if (!response.success) {
        console.error("Login error response:", response.error);
        throw new Error(response.error || "Login failed");
      }

      if (!response.data?.user || !response.data?.token) {
        throw new Error("Invalid response from server");
      }

      // Store token first
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);

      // Invalidate and refetch session data
      queryClient.invalidateQueries({ queryKey: ["session"] });

      // For login, always go to dashboard
      navigate(DEFAULT_AFTER_LOGIN_REDIRECT);
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setError(error.message || "Login failed");
        toast({
          title: "Login Failed",
          description: error.message || "Login failed",
          variant: "destructive",
        });
      } else {
        setError("Login failed");
        toast({
          title: "Login Failed",
          description: "Login failed",
          variant: "destructive",
        });
      }
      throw error; // Re-throw to be handled by component
    } finally {
      setIsLoading(false);
    }
  };

  const getSession = async () => {
    const response = await refetchSession();
    return response.data as GetSessionResponse;
  };

  // Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        await authApi.logout<{ success: boolean }>();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state first
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setError(null);

      // Remove token from localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);

      // Clear all session-related queries from React Query cache
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.clear();

      // Navigate to logout redirect
      navigate(DEFAULT_AFTER_LOGOUT_REDIRECT, { replace: true });
    }
  };

  // Check if user needs onboarding
  const checkUserNeedsOnboarding = (): boolean => {
    // Only check onboarding if user is authenticated
    if (!isAuthenticated || !user || !session) return false;

    // Check if user has a profile
    if (!user.profileId || !session.profileId) return true;
    return false;
  };

  // Update user
  const updateUser = async (data: { name?: string; image?: string }) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw new Error("No authentication token");

      const response = await fetch(getAuthUrl("/update-user"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      setError(error instanceof Error ? error.message : "Update failed");
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw new Error("No authentication token");

      const response = await fetch(getAuthUrl("/change-password"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password change failed");
      }
    } catch (error) {
      console.error("Change password error:", error);
      setError(error instanceof Error ? error.message : "Password change failed");
      throw error;
    }
  };

  // Delete user
  const deleteUser = async (password: string) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw new Error("No authentication token");

      const response = await fetch(getAuthUrl("/delete-user"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Account deletion failed");
      }

      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Delete user error:", error);
      setError(error instanceof Error ? error.message : "Account deletion failed");
      throw error;
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(getAuthUrl("/request-password-reset"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          callbackURL: getCallbackUrl("/reset-password"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password reset request failed");
      }
    } catch (error) {
      console.error("Request password reset error:", error);
      setError(error instanceof Error ? error.message : "Password reset request failed");
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(getAuthUrl("/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error instanceof Error ? error.message : "Password reset failed");
      throw error;
    }
  };

  // Send verification email
  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch(getAuthUrl("/send-verification-email"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          callbackURL: getCallbackUrl("/verify-email"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification email send failed");
      }
    } catch (error) {
      console.error("Send verification email error:", error);
      setError(error instanceof Error ? error.message : "Verification email send failed");
      throw error;
    }
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(getAuthUrl(`/verify-email?token=${token}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Email verification failed");
      }

      // Update user's email verification status
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
    } catch (error) {
      console.error("Verify email error:", error);
      setError(error instanceof Error ? error.message : "Email verification failed");
      throw error;
    }
  };

  // List sessions
  const listSessions = async (): Promise<Session[]> => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw new Error("No authentication token");

      const response = await fetch(getAuthUrl("/list-sessions"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to list sessions");
      }

      return await response.json();
    } catch (error) {
      console.error("List sessions error:", error);
      setError(error instanceof Error ? error.message : "Failed to list sessions");
      throw error;
    }
  };

  // Revoke session
  const revokeSession = async (token: string) => {
    try {
      const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!authToken) throw new Error("No authentication token");

      const response = await fetch(getAuthUrl("/revoke-session"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revoke session");
      }
    } catch (error) {
      console.error("Revoke session error:", error);
      setError(error instanceof Error ? error.message : "Failed to revoke session");
      throw error;
    }
  };

  // Revoke all sessions
  const revokeAllSessions = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw new Error("No authentication token");

      const response = await fetch(getAuthUrl("/revoke-sessions"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revoke all sessions");
      }

      // Logout current session
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Revoke all sessions error:", error);
      setError(error instanceof Error ? error.message : "Failed to revoke all sessions");
      throw error;
    }
  };

  // Revoke other sessions
  const revokeOtherSessions = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw new Error("No authentication token");

      const response = await fetch(getAuthUrl("/revoke-other-sessions"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revoke other sessions");
      }
    } catch (error) {
      console.error("Revoke other sessions error:", error);
      setError(error instanceof Error ? error.message : "Failed to revoke other sessions");
      throw error;
    }
  };

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
    listSessions,
    revokeSession,
    revokeAllSessions,
    revokeOtherSessions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Handle redirect when not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(authPages.login, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking auth state
  if (isLoading) {
    return <PageLoader />;
  }

  // Don't render children if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
};
