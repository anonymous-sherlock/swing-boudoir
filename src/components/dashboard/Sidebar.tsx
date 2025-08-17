import { 
  Bell, 
  User, 
  Users, 
  Trophy, 
  Vote, 
  Gift, 
  Settings as SettingsIcon, 
  HelpCircle, 
  FileText, 
  Shield, 
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { DashboardSection } from "@/pages/Dashboard";

import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardSection } from "@/routes/dashboard/$section";

interface SidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const sidebarItemsMain = [
  { id: "profile" as DashboardSection, label: "Profile", icon: Users },
  { id: "competitions" as DashboardSection, label: "Competitions", icon: Trophy },
  { id: "votes" as DashboardSection, label: "Votes", icon: Vote },
  // { id: "prize-history" as DashboardSection, label: "Prize History", icon: Gift },
  { id: "leaderboard" as DashboardSection, label: "Leaderboard", icon: TrendingUp },
  { id: "notifications" as DashboardSection, label: "Notifications", icon: Bell },
];

const sidebarItemsSecondary = [
  { id: "support" as DashboardSection, label: "Support", icon: HelpCircle },
  { id: "official-rules" as DashboardSection, label: "Official Rules", icon: FileText },
  { id: "privacy" as DashboardSection, label: "Privacy Policy", icon: Lock },
  { id: "settings" as DashboardSection, label: "Settings", icon: SettingsIcon },
];

export function Sidebar({ 
  activeSection, 
  setActiveSection, 
  isMobile = false,
  isOpen = false,
  onToggle 
}: SidebarProps) {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate({ to: "/auth/$id", params: { id: "sign-in" } });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Mobile sidebar
  if (isMobile) {
    return (
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle} // Close sidebar when clicking outside
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        
        {/* Sidebar content */}
        <div 
          className={`fixed left-0 top-0 h-full bg-white border-r border-border transition-transform duration-300 mobile-sidebar ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="w-64 h-full flex flex-col bg-white shadow-2xl mobile-sidebar" style={{ backgroundColor: '#ffffff' }}>
            <div className="p-4 border-b border-border bg-white mobile-sidebar" style={{ backgroundColor: '#ffffff' }}>
              <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 bg-white mobile-sidebar" style={{ backgroundColor: '#ffffff' }}>
              {sidebarItemsMain.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveSection(item.id);
                      onToggle?.();
                    }}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border bg-white mobile-sidebar" style={{ backgroundColor: '#ffffff' }}>
              <nav className="space-y-2 bg-white mobile-sidebar" style={{ backgroundColor: '#ffffff' }}>
                {sidebarItemsSecondary.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveSection(item.id);
                        onToggle?.();
                      }}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className={`bg-card border-r border-border h-screen flex flex-col sticky top-0 transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        {isExpanded ? (
          <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
        ) : (
          <>
          </>
          // <div className="w-8 h-8 bg-primary flex-shrink-0 rounded rounded-lg flex items-center justify-center">
          //   <span className="text-primary-foreground font-bold text-sm">S</span>
          // </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="p-1 h-8 w-8"
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {sidebarItemsMain.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full transition-all duration-200 ${
                isExpanded ? 'justify-start' : 'justify-center'
              }`}
              onClick={() => setActiveSection(item.id)}
              title={!isExpanded ? item.label : undefined}
            >
              <Icon className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
              {isExpanded && item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <nav className="space-y-1">
          {sidebarItemsSecondary.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full transition-all duration-200 ${
                  isExpanded ? 'justify-start' : 'justify-center'
                }`}
                onClick={() => setActiveSection(item.id)}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
                {isExpanded && item.label}
              </Button>
            );
          })}
          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              className={`w-full transition-all duration-200 text-destructive hover:text-destructive hover:bg-destructive/10 ${
                isExpanded ? 'justify-start' : 'justify-center'
              }`}
              onClick={handleLogoutClick}
              title={!isExpanded ? 'Log Out' : undefined}
            >
              <LogOut className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
              {isExpanded && 'Log Out'}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}