import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@tanstack/react-router";
import { PageLoader } from "./PageLoader";
import { useEffect } from "react";
import { toast } from "sonner";

interface ModelOnlyProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ModelOnlyProtected: React.FC<ModelOnlyProtectedProps> = ({ children, fallback = <PageLoader /> }) => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.type === "VOTER") {
      // Redirect VOTER users to home
      router.navigate({
        to: "/",
        replace: true,
      });
    }
  }, [isLoading, isAuthenticated, user?.type, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return fallback;
  }

  // Show loading while redirecting VOTER users
  if (isAuthenticated && user?.type === "VOTER") {
    return fallback;
  }

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return fallback;
  }

  // User is authenticated and is a MODEL, render the protected content
  return <>{children}</>;
};
