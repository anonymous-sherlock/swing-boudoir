import { PageLoader } from "@/components/PageLoader";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { QueryClient } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ModalProvider from "@/providers/modal-provider";
import { authRoutes, isPublicRoute } from "@/routes";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import FloatingChatButton from "@/components/layout/floating-chat-btn";

function AppShell() {
  const { isLoading } = useAuth();
  const isAdminPage = location.pathname.startsWith("/admin");

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
    </div>
  );
}
interface MyRouterContext {
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
