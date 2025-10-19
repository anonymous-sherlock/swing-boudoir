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
       <ContestBrowserLeaveBlocker 
         enabled={!location.pathname.includes('/auth/')} 
         showOnMouseLeave={true}
         title="Don't leave yet!"
         message="You're about to miss out on this amazing competition. Are you sure you want to leave?"
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
