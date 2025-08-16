import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CompetitionDetailsHeaderProps {
  onSidebarToggle?: () => void;
}

const CompetitionDetailsHeader = ({ onSidebarToggle }: CompetitionDetailsHeaderProps) => {
  const { user, isAuthenticated, handleLogout } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationsClick = () => {
    window.location.href = "/dashboard/notifications";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Left side */}
        <div className="flex items-center">
          <div className="flex flex-col items-start">
            <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
            <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
          </div>
        </div>

        {/* Right side - Mobile sidebar toggle and profile menu */}
        <div className="flex items-center space-x-6">
          {/* Mobile Sidebar Toggle */}
          <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>

          {/* Profile Menu - Show when authenticated */}
          {isAuthenticated && user && (
            <>
              {/* Notifications Icon */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNotificationsClick}
                className="relative h-8 w-8 rounded-full p-0"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <Link to="/dashboard">
                        <Button variant="ghost" className="w-full justify-start text-sm">
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start text-sm">
                          Settings
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm text-destructive hover:text-destructive"
                        onClick={handleLogoutClick}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}

          {/* Login/Register buttons when not authenticated */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CompetitionDetailsHeader;
