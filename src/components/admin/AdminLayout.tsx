import { Outlet, useLocation, Link } from '@tanstack/react-router'
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AdminLayout() {
  const location = useLocation()
  const currentPath = location.pathname
  
  // Get the current page title based on the path
  const getPageTitle = (path: string) => {
    const pathMap: Record<string, string> = {
      '/admin': 'Dashboard',
      '/admin/analytics': 'Analytics',
      '/admin/competitions': 'Competitions',
      '/admin/users': 'Users',
      '/admin/settings': 'Settings',
      '/admin/add-contest': 'Add Contest',
      '/admin/winners': 'Winners',
      '/admin/profiles': 'Profiles',
      '/admin/payments': 'Payments',
    }
    return pathMap[path] || 'Admin Panel'
  }
  
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/admin">
                        Admin Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbPage>{getPageTitle(currentPath)}</BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
