import { Button } from "@/components/ui/button";
import { Menu, Trophy, User, Bell, LogOut, Settings, SettingsIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, handleLogout } = useAuth();
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
          <Link to="/" className="flex flex-col items-start">
            <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
            <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
          </Link>
        </div>

        {/* Right side - Navigation links, mobile sidebar toggle, and profile menu */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links - Only show on non-dashboard pages */}
          {!isDashboardPage && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/competitions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Competitions
              </Link>
              <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Leaderboard
              </Link>
            </nav>
          )}

          {/* Mobile Sidebar Toggle - Only show on dashboard pages */}
          {isDashboardPage && (
            <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {/* Profile Menu - Show when authenticated */}
          {isAuthenticated && user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="p-2">
                  <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate("/dashboard/", { replace: true, flushSync: true })}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate("/dashboard/settings", { replace: true, flushSync: true })}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                  <div className="border-t my-2" />
                  <Button variant="ghost" className="w-full justify-start h-9 px-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogoutClick}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
