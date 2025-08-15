import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@tanstack/react-router';
import { PageLoader } from './PageLoader';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <PageLoader /> 
}) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with current path as callback
      const currentPath = router.state.location.pathname;
      router.navigate({
        to: "/auth/$id",
        params: { id: "sign-in" },
        search: { callback: currentPath },
        replace: true
      });
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return fallback;
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return fallback;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};
