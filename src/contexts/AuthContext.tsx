/**
 * Authentication Context for Swing Boudoir Showcase
 *
 * This context provides:
 * - Global authentication state management via React Query
 * - Manual email/password and Username authentication
 * - User session management
 * - Protected route handling
 *
 * @author Swing Boudoir Development Team
 * @version 2.0.0
 */

import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { getFullCallbackUrl } from "@/lib/config";

import { DEFAULT_AFTER_LOGIN_REDIRECT, DEFAULT_AFTER_LOGOUT_REDIRECT } from "@/routes";
import {
  GetSessionResponse,
  Session,
  SignInWithEmailRequest,
  SignInWithEmailResponse,
  SignInWithUsernameRequest,
  SignUpWithEmailRequest,
  SocialSignInResponse,
  User,
  User_Type,
} from "@/types/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React, { createContext, useContext, useCallback, useMemo } from "react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Authentication methods
  handleRegister: (data: SignUpWithEmailRequest) => Promise<void>;
  handleRegisterAsVoter: (data: {
    name: string;
    email: string;
    password: string;
    username: string;
    rememberMe?: boolean;
    callbackURL?: string;
  }) => Promise<{ token: string; user: User; username: string }>;
  handleLoginWithEmail: (data: SignInWithEmailRequest) => Promise<void>;
  handleLoginWithUsername: (data: SignInWithUsernameRequest) => Promise<void>;
  handleLoginWithGoogle: (callbackURL?: string, type?: User_Type) => Promise<void>;
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
  revalidateSession: () => Promise<GetSessionResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- Session Query ---
  // We treat the token existence in localStorage + successful API call as the source of truth.
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    isFetching: isSessionFetching,
    error: sessionQueryError,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        return null;
      }
      const response = await authApi.getSession<GetSessionResponse>();
      if (!response.success) {
        // If the token is invalid, clear it
        localStorage.removeItem(AUTH_TOKEN_KEY);
        // We throw here so useQuery marks it as error/failure, or we could return null.
        // Returning null is often cleaner for "not logged in" state than an error state.
        // However, if the token was present but invalid, it's technically a failed auth attempt.
        // Let's return null to gracefully handle "expired session" as "logged out".
        return null;
      }
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Re-validate when window gets focus for security
  });

  // Derived State
  const user = sessionData?.user ?? null;
  const session = sessionData?.session ?? null;
  const isAuthenticated = !!user;

  // --- Mutations ---

  // Helper to handle navigation after login
  const navigateAfterLogin = useCallback(
    (callbackURL?: string | null) => {
      const redirectTo = callbackURL || DEFAULT_AFTER_LOGIN_REDIRECT;
      const currentPath = window.location.pathname;

      // Invalidate and refetch session to ensure fresh state
      queryClient.refetchQueries({ queryKey: ["session"] }).then(() => {
        // Only navigate if we're not already on the target path
        if (currentPath !== redirectTo) {
          router.navigate({ to: redirectTo, replace: true });
        }
      });
    },
    [queryClient, router]
  );

  const handleError = (error: unknown, title: string) => {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error(title, {
      description: message,
    });
    return message;
  };

  const registerMutation = useMutation({
    mutationFn: async (data: SignUpWithEmailRequest) => {
      const response = await authApi.register<{ token: string; user: User }>({
        ...data,
        type: data.type || "MODEL",
        callbackURL: data.callbackURL ? getFullCallbackUrl(data.callbackURL) : undefined,
      });
      if (!response.success) throw new Error(response.error || "Registration failed");
      return response.data;
    },
    onSuccess: (data, variables) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      navigateAfterLogin(variables.callbackURL);
    },
    onError: (err) => handleError(err, "Registration Failed"),
  });

  const registerVoterMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; username: string; rememberMe?: boolean; callbackURL?: string }) => {
      const response = await authApi.register<{ token: string; user: User; session: Session }>({
        ...data,
        type: "VOTER",
        callbackURL: data.callbackURL ? getFullCallbackUrl(data.callbackURL) : undefined,
      });
      if (!response.success) throw new Error(response.error || "Voter registration failed");
      return response.data;
    },
    onSuccess: (data, variables) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      navigateAfterLogin(variables.callbackURL);
    },
    onError: (err) => handleError(err, "Voter Registration Failed"),
  });

  const loginEmailMutation = useMutation({
    mutationFn: async (data: SignInWithEmailRequest) => {
      const response = await authApi.login<SignInWithEmailResponse>({
        ...data,
        callbackURL: data.callbackURL ? getFullCallbackUrl(data.callbackURL) : undefined,
      });
      if (!response.success) throw new Error(response.error || "Login failed");
      return response.data;
    },
    onSuccess: (data, variables) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      navigateAfterLogin(variables.callbackURL);
    },
    onError: (err) => handleError(err, "Login Failed"),
  });

  const loginUsernameMutation = useMutation({
    mutationFn: async (data: SignInWithUsernameRequest) => {
      const response = await authApi.loginWithUsername<SignInWithEmailResponse>({
        ...data,
        callbackURL: getFullCallbackUrl(data.callbackURL || "/login"),
      });
      if (!response.success) throw new Error(response.error || "Login failed");
      return response.data;
    },
    onSuccess: (data, variables) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      navigateAfterLogin(variables.callbackURL);
    },
    onError: (err) => handleError(err, "Login Failed"),
  });

  const loginGoogleMutation = useMutation({
    mutationFn: async ({ callbackURL, type }: { callbackURL?: string; type?: User_Type }) => {
      const finalRedirectUrl = callbackURL ?? DEFAULT_AFTER_LOGIN_REDIRECT;
      const baseCallback = getFullCallbackUrl("/auth/callback");
      const searchParams = new URLSearchParams();
      if (finalRedirectUrl) searchParams.set("redirectTo", finalRedirectUrl);
      if (type) searchParams.set("userType", type);
      const oauthCallbackUrl = `${baseCallback}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

      const response = await authApi.loginWithGoogle<SocialSignInResponse>({
        provider: "google",
        callbackURL: oauthCallbackUrl,
        type: type || "MODEL",
      });

      if (!response.success) throw new Error(response.error || "Google login failed");
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.redirect && data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => handleError(err, "Google Login Failed"),
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        await authApi.logout<{ success: boolean }>();
      }
    },
    onSettled: () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.clear();
      router.navigate({ to: DEFAULT_AFTER_LOGOUT_REDIRECT, replace: true });
    },
  });

  // --- Other Methods (Keeping as simple async functions or wrapped in validation) ---

  const updateUser = useCallback(
    async (data: { name?: string; image?: string }) => {
      const response = await authApi.updateUser(data);
      if (!response.success) throw new Error(response.error || "Update failed");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    [queryClient]
  );

  const changePassword = useCallback(async (current: string, newPass: string) => {
    const response = await authApi.changePassword({ currentPassword: current, newPassword: newPass });
    if (!response.success) throw new Error(response.error || "Password change failed");
  }, []);

  const deleteUser = useCallback(
    async (password: string) => {
      const response = await authApi.deleteUser({ password });
      if (!response.success) throw new Error(response.error || "Account deletion failed");

      localStorage.removeItem(AUTH_TOKEN_KEY);
      queryClient.removeQueries();
      router.navigate({ to: "/" });
    },
    [queryClient, router]
  );

  // Public methods (no auth required usually, or just utility)
  const requestPasswordReset = useCallback(async (email: string) => {
    const response = await authApi.requestPasswordReset({ email, callbackURL: getFullCallbackUrl("/reset-password") });
    if (!response.success) throw new Error(response.error || "Request failed");
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    const response = await authApi.resetPassword({ token, newPassword });
    if (!response.success) throw new Error(response.error || "Reset failed");
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
    const response = await authApi.sendVerificationEmail({ email, callbackURL: getFullCallbackUrl("/verify-email") });
    if (!response.success) throw new Error(response.error || "Send failed");
  }, []);

  const verifyEmail = useCallback(
    async (token: string) => {
      const response = await authApi.verifyEmail({ token });
      if (!response.success) throw new Error(response.error || "Verification failed");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    [queryClient]
  );

  // Session Management
  const listSessions = useCallback(async () => {
    const response = await authApi.listSessions<Session[]>();
    if (!response.success) throw new Error(response.error || "Failed to list sessions");
    return response.data;
  }, []);

  const revokeSession = useCallback(
    async (token: string) => {
      const response = await authApi.revokeSession({ token });
      if (!response.success) throw new Error(response.error || "Failed to revoke session");
      queryClient.invalidateQueries({ queryKey: ["session"] }); // potentially we revoked other session, but safe to sync
    },
    [queryClient]
  );

  const revokeAllSessions = useCallback(async () => {
    const response = await authApi.revokeAllSessions();
    if (!response.success) throw new Error(response.error || "Failed");
    logoutMutation.mutate();
  }, [logoutMutation]);

  const revokeOtherSessions = useCallback(async () => {
    const response = await authApi.revokeOtherSessions();
    if (!response.success) throw new Error(response.error || "Failed");
  }, []);

  const checkUserNeedsOnboarding = useCallback((): boolean => {
    if (!isAuthenticated || !user || !session) return false;
    return !user.profileId || !session.profileId;
  }, [isAuthenticated, user, session]);

  const revalidateSession = useCallback(async () => {
    const response = await authApi.getOAuthSession<GetSessionResponse>();
    if (!response.success) throw new Error("Revalidation failed");
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.session.token);
    queryClient.setQueryData(["session"], response.data);
    return response.data;
  }, [queryClient]);

  // Aggregate loading and error states
  // We can consider 'loading' if session is initial loading OR if any mutation is pending
  const generalLoading =
    isSessionLoading ||
    (isSessionFetching && !isAuthenticated) ||
    registerMutation.isPending ||
    registerVoterMutation.isPending ||
    loginEmailMutation.isPending ||
    loginUsernameMutation.isPending ||
    loginGoogleMutation.isPending;

  const generalError = (sessionQueryError as Error)?.message || registerMutation.error?.message || loginEmailMutation.error?.message || null;

  // Memoize value to avoid context churn
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      isAuthenticated,
      isLoading: generalLoading,
      error: generalError,

      handleRegister: async (d) => {
        await registerMutation.mutateAsync(d);
      },
      handleRegisterAsVoter: async (d) => {
        const res = await registerVoterMutation.mutateAsync(d);
        return { token: res.token, user: res.user, username: res.user.username };
      },
      handleLoginWithEmail: async (d) => {
        await loginEmailMutation.mutateAsync(d);
      },
      handleLoginWithUsername: async (d) => {
        await loginUsernameMutation.mutateAsync(d);
      },
      handleLoginWithGoogle: async (cb, t) => {
        await loginGoogleMutation.mutateAsync({ callbackURL: cb, type: t });
      },
      handleLogout: async () => {
        await logoutMutation.mutateAsync();
      },

      checkUserNeedsOnboarding,
      getSession: async () => {
        const res = await refetchSession();
        if (res.data) return res.data;
        throw new Error("No session");
      },
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
      revalidateSession,
    }),
    [
      user,
      session,
      isAuthenticated,
      generalLoading,
      generalError,
      registerMutation,
      registerVoterMutation,
      loginEmailMutation,
      loginUsernameMutation,
      loginGoogleMutation,
      logoutMutation,
      checkUserNeedsOnboarding,
      refetchSession,
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
      revalidateSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
