import { Button } from "@/components/ui/button";
import { Menu, Trophy, User, Bell, LogOut, Settings, SettingsIcon, Users, Vote, Gift, HelpCircle, FileText, Lock, TrendingUp } from "lucide-react";
import { useLocation, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect, useState } from "react";
import { getUserInitials } from "@/lib/utils";

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  const location = useLocation();
  const mobileMenuContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, handleLogout } = useAuth();
  const { unreadCount } = useNotifications();
  const isDashboardPage = location.pathname.startsWith("/dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileMenuOpen && e.target instanceof Node && !mobileMenuContainerRef.current?.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate({ to: "/auth/$id", params: { id: "sign-in" } });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Mobile menu items for dashboard pages
  const mobileMenuItems = [
    { id: "notifications", label: "Notifications", icon: Bell, onClick: () => navigate({ to: "/dashboard/$section", params: { section: "notifications" } }) },
    { id: "competitions", label: "Competitions", icon: Trophy, onClick: () => navigate({ to: "/competitions" }) },
    { id: "public-profile", label: "Public Profile", icon: Users, onClick: () => navigate({ to: "/dashboard/$section", params: { section: "profile" } }) },
    { id: "votes", label: "Votes", icon: Vote, onClick: () => navigate({ to: "/dashboard/$section", params: { section: "votes" } }) },
    // { id: "prize-history", label: "Prize History", icon: Gift, onClick: () => navigate({ to: "/dashboard/$section", params: { section: "prize-history" } }) },
    { id: "leaderboard", label: "Leaderboard", icon: TrendingUp, onClick: () => navigate({ to: "/leaderboard" }) },
    { id: "support", label: "Support", icon: HelpCircle, onClick: () => navigate({ to: "/dashboard/$section", params: { section: "support" } }) },
    { id: "official-rules", label: "Official Rules", icon: FileText, onClick: () => navigate({ to: "/rules" }) },
    { id: "privacy", label: "Privacy Policy", icon: Lock, onClick: () => navigate({ to: "/dashboard/$section", params: { section: "privacy" } }) },
    { id: "settings", label: "Settings", icon: SettingsIcon, onClick: () => navigate({ to: "/dashboard/$section", params: { section: "settings" } }) },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Layout: Hamburger | Logo | Profile */}
        <div className="flex md:hidden w-full items-center justify-between">
          {/* Hamburger Menu - Top Left */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (isDashboardPage && onSidebarToggle) {
                onSidebarToggle();
              } else {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }
            }}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo - Center */}
          <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex flex-col items-center">
              <div className="text-xl font-display font-bold text-primary tracking-tight">SWING</div>
              <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
            </Link>
          </div>

          {/* Profile/Auth - Top Right */}
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8 object-cover hover:ring-2 hover:ring-accent transition-all duration-300">
                      <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">{getUserInitials(user.name, user.username)}</AvatarFallback>
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
                    <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate({ to: "/dashboard" })}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate({ to: "/dashboard/$section", params: { section: "settings" } })}>
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
            ) : (
              <Link to="/auth/$id" params={{ id: "sign-in" }}>
                <Button variant="ghost" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Layout: Logo | Navigation | Profile */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col items-start">
              <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
              <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
            </Link>
          </div>

          {/* Right side - Profile menu and actions */}
          <div className="flex items-center space-x-4">
            {/* Dashboard Sidebar Toggle - Only show on dashboard pages */}
            {isDashboardPage && (
              <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="hidden lg:flex">
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Profile Menu - Show when authenticated */}
            {isAuthenticated && user && (
              <>
                {/* Notifications Icon - Desktop Only */}
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full p-0 hidden lg:flex">
                  <Link to="/dashboard/$section" params={{ section: "notifications" }} className="relative w-full h-full flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 object-cover hover:ring-2 hover:ring-accent transition-all duration-300">
                        <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">{getUserInitials(user.name, user.username)}</AvatarFallback>
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
                      <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate({ to: "/dashboard" })}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate({ to: "/dashboard/$section", params: { section: "settings" } })}>
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
              </>
            )}

            {/* Auth Buttons - Show when not authenticated */}
            {!isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link to="/auth/$id" params={{ id: "sign-in" }}>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/$id" params={{ id: "sign-up" }}>
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Show for all pages on mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div ref={mobileMenuContainerRef} className="fixed left-0 top-0 h-full min-h-screen w-80 bg-white border-r border-border shadow-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                  ×
                </Button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {/* Show additional items when authenticated */}
              {isAuthenticated && (
                <>
                  {mobileMenuItems
                    .filter((item) => !["competitions", "leaderboard"].includes(item.id))
                    .map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start h-12"
                          onClick={() => {
                            item.onClick();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Icon className="mr-3 h-5 w-5" />
                          <span className="text-base">{item.label}</span>
                          {item.id === "notifications" && unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}

                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        handleLogoutClick();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="text-base">Log out</span>
                    </Button>
                  </div>
                </>
              )}

              {/* Show auth options when not authenticated */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-border space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12"
                    onClick={() => {
                      navigate({ to: "/auth/$id", params: { id: "sign-in" } });
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="mr-3 h-5 w-5" />
                    <span className="text-base">Sign In</span>
                  </Button>
                  <Button
                    className="w-full justify-start h-12"
                    onClick={() => {
                      navigate({ to: "/auth/$id", params: { id: "sign-up" } });
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="mr-3 h-5 w-5" />
                    <span className="text-base">Sign Up</span>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
