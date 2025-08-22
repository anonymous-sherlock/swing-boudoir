import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { PageLoader } from "../PageLoader";

interface AdminOnlyProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminOnlyProtected: React.FC<AdminOnlyProtectedProps> = ({ children, fallback = <PageLoader /> }) => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== "ADMIN") {
      // Redirect ADMIN users to home
      router.navigate({
        to: "/",
        replace: true,
      });
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return fallback;
  }

  // Show loading while redirecting ADMIN users
  if (isAuthenticated && user?.role !== "ADMIN") {
    return fallback;
  }

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return fallback;
  }

  // User is authenticated and is a ADMIN, render the protected content
  return <>{children}</>;
};
