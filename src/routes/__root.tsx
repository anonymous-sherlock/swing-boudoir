import FloatingChatButton from "@/components/layout/floating-chat-btn";
import { PageLoader } from "@/components/PageLoader";
import { CompetitionsTour } from "@/components/product-flow/competions-tour";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useProductTour } from "@/hooks/useProductTour";
import ModalProvider from "@/providers/modal-provider";
import { authRoutes, isPublicRoute } from "@/routes";
import { QueryClient } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ContestBrowserLeaveBlocker } from "../components/encouragement/ContestBrowserLeaveBlocker";
import { OnboardingLeaveBlocker } from "../components/encouragement/OnboardingLeaveBlocker";

function AppShell() {
  const { isLoading } = useAuth();
  const isAdminPage = location.pathname.startsWith("/admin");
  const { shouldShowTour, markTourCompleted } = useProductTour();

  // Show loading spinner while checking authentication
  if (isLoading && !isPublicRoute(location.pathname) && !authRoutes.includes(location.pathname)) {
    return <PageLoader />;
  }

  // Always render the app - authentication is handled by individual components
  return (
    <div className="App" vaul-drawer-wrapper="">
      <Outlet />
      <Toaster />
      <SonnerToaster />
      {!isAdminPage && <FloatingChatButton />}

      {/* Global Product Tour */}
      <CompetitionsTour isOpen={shouldShowTour} onClose={markTourCompleted} onComplete={markTourCompleted} />
      
      {/* Onboarding Leave Blocker - for users who haven't completed profile */}
      <OnboardingLeaveBlocker 
        enabled={!location.pathname.includes('/auth/')} 
        showOnMouseLeave={true}
      />
      
      {/* Contest Leave Blocker - for users with completed profiles */}
      <ContestBrowserLeaveBlocker 
        enabled={!location.pathname.includes('/auth/')} 
        showOnMouseLeave={true}
        title="You have not joined the competition. Check out these active ones below!"
        message="You're about to miss out on this amazing competition. Don't leave without securing your spot!"
      />
      
    </div>
  );
}
export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRoute<MyRouterContext>({
  component: () => (
    <AuthProvider>
      <NuqsAdapter>
        <ModalProvider>
          <NotificationProvider>
            <AppShell />
          </NotificationProvider>
        </ModalProvider>
      </NuqsAdapter>
    </AuthProvider>
  ),
});
