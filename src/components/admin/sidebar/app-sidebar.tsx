import * as React from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Bot, Command, Frame, LifeBuoy, Map, PieChart, Send, Settings2, SquareTerminal, User } from "lucide-react";

import { NavMain } from "@/components/admin/sidebar/nav-main";
import { NavProjects } from "@/components/admin/sidebar/nav-projects";
import { NavSecondary } from "@/components/admin/sidebar/nav-secondary";
import { NavUser } from "@/components/admin/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin",
    email: "admin@swingboudior.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: PieChart,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
        },
      ],
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
      icon: Bot,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
      ],
    },
    {
      title: "Profiles",
      url: "/admin/profiles",
      icon: User,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Swing Boudior</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
