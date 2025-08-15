import { PageLoader } from "@/components/PageLoader";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { QueryClient } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NotificationProvider } from "@/contexts/NotificationContext";


function AppShell() {
  const { isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // Always render the app - authentication is handled by individual components
  return (
    <div className="App">
      <Outlet />
      <Toaster />
      <SonnerToaster />
    </div>
  );
}
interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRoute<MyRouterContext>({
  component: () => (
    <AuthProvider>
      <OnboardingProvider>
        <NotificationProvider>
        <AppShell />
        </NotificationProvider>
      </OnboardingProvider>
    </AuthProvider>
  ),
});
