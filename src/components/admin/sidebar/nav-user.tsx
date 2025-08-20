"use client";

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Shield, User, Mail, CheckCircle, XCircle } from "lucide-react";
import { cn, getUserInitials } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { user: authUser, handleLogout } = useAuth();

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get role display info
  const getRoleInfo = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { label: "Administrator", color: "bg-red-500" };
      case "MODERATOR":
        return { label: "Moderator", color: "bg-orange-500" };
      case "USER":
        return { label: "User", color: "bg-blue-500" };
      default:
        return { label: role, color: "bg-gray-500" };
    }
  };

  const roleInfo = authUser?.role ? getRoleInfo(authUser.role) : null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-10 w-10 rounded-sm object-cover">
                <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                <AvatarFallback className="rounded-sm">{getUserInitials(user.name, user.email)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-sm object-cover">
                  <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                  <AvatarFallback className="rounded-lg">{getUserInitials(user.name, user.email)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sm">{user.name}</span>
                  {roleInfo && (
                    <Badge variant="secondary" className="mt-1 w-fit text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {roleInfo.label}
                    </Badge>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* User Details Section */}
            {authUser && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled className="opacity-70">
                    <User className="h-4 w-4 mr-2" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">Username</span>
                      <span className="text-xs text-muted-foreground">{authUser.username}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="opacity-70">
                    <Mail className="h-4 w-4 mr-2" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">Email</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{authUser.email}</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogoutClick} 
              className={cn(
                "cursor-pointer text-red-500 hover:text-red-700 focus:text-red-700 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-700"
              )}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
