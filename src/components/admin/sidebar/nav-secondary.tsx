import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { BrushCleaning } from "lucide-react";
import { toast } from "sonner";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation();
  const currentPath = location.pathname;

  const clearCache = async () => {
    toast.promise(api.get("/cache/clear"), {
      loading: "Clearing cache...",
      success: "Cache cleared successfully!",
      error: "Failed to clear cache",
    });
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <Button onClick={clearCache} variant="ghost" className="text-left justify-start">
                <BrushCleaning />
                <span>Clear Cache</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = currentPath === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm">
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
