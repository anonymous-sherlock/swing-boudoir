import { Outlet, useLocation, Link } from "@tanstack/react-router";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminOnlyProtected } from "./AdminProtected";

export function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Get the current page title based on the path
  const getPageTitle = (path: string) => {
    const pathMap: Record<string, string> = {
      "/admin": "Dashboard",
      "/admin/analytics": "Analytics",
      "/admin/competitions": "Competitions",
      "/admin/users": "Users",
      "/admin/settings": "Settings",
      "/admin/add-contest": "Add Contest",
      "/admin/winners": "Winners",
      "/admin/profiles": "Profiles",
      "/admin/payments": "Payments",
      "/admin/votes": "Votes",
      "/admin/votes-boost": "Votes Boost",
      "/admin/leaderboard": "Leaderboard",
      "/admin/notifications": "Notifications",
    };
    return pathMap[path] || "Admin Panel";
  };

  return (
    <ProtectedRoute>
      <AdminOnlyProtected>
        <div className="admin-layout ">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0 flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                <div className="flex items-center gap-2 px-4 min-w-0 flex-1">
                  <SidebarTrigger className="-ml-1 shrink-0" />
                  <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4 shrink-0" />
                  <Breadcrumb className="min-w-0 flex-1">
                    <BreadcrumbList className="min-w-0">
                      <BreadcrumbItem className="hidden md:block shrink-0">
                        <BreadcrumbLink asChild>
                          <Link to="/admin">Admin Dashboard</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block shrink-0" />
                      <BreadcrumbPage className="truncate">{getPageTitle(currentPath)}</BreadcrumbPage>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <div className="flex flex-col gap-4 p-4 pt-4 min-w-0 overflow-x-auto">
                <div className="min-w-0">
                  <Outlet />
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </AdminOnlyProtected>
    </ProtectedRoute>
  );
}
