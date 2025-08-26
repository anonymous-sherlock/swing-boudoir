import * as React from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Bot, Command, Frame, LifeBuoy, Map, PieChart, Send, Settings2, SquareTerminal, User, CreditCard, Zap, Trophy } from "lucide-react";

import { NavMain } from "@/components/admin/sidebar/nav-main";
import { NavProjects } from "@/components/admin/sidebar/nav-projects";
import { NavSecondary } from "@/components/admin/sidebar/nav-secondary";
import { NavUser } from "@/components/admin/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: PieChart,
    },
    {
      title: "Contests",
      url: "/admin/contests",
      icon: SquareTerminal,
      items: [
        {
          title: "All Contests",
          url: "/admin/contests",
        },
        {
          title: "Add Contest",
          url: "/admin/contests/create",
        },
        {
          title: "Manage Winners",
          url: "/admin/winners",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: User,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "All Profiles",
          url: "/admin/profiles",
          icon: User,
        },
      ],
    },

    {
      title: "Payments",
      url: "/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Votes Boost",
      url: "/admin/votes-boost",
      icon: Zap,
    },
    {
      title: "Leaderboard",
      url: "/admin/leaderboard",
      icon: Trophy,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" disabled>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Loading...</span>
                  <span className="truncate text-xs">Please wait</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    );
  }

  // If not authenticated, don't show the sidebar
  if (!isAuthenticated || !user) {
    return null;
  }

  // Prepare user data for NavUser component
  const userData = {
    name: user.name || "Admin User",
    email: user.email || "admin@swingBoudoir.com",
    avatar: user.image || "/avatars/admin.jpg",
  };

  return (
    <Sidebar variant="inset" {...props} className="pt-0 overflow-hidden">
      <SidebarHeader className="overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold">Swing Boudoir</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="overflow-hidden">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
