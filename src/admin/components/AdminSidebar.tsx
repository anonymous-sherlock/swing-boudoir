import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Shield, 
  BarChart3, 
  Gift, 
  Settings, 
  MessageSquare,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminSection } from '../types/adminTypes';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  pendingReports?: number;
  pendingModeration?: number;
}

const sidebarItems = [
  { 
    id: 'dashboard' as AdminSection, 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'Overview and statistics'
  },
  { 
    id: 'users' as AdminSection, 
    label: 'User Management', 
    icon: Users,
    description: 'Manage user accounts'
  },
  { 
    id: 'competitions' as AdminSection, 
    label: 'Competitions', 
    icon: Trophy,
    description: 'Manage competitions'
  },
  { 
    id: 'settings' as AdminSection, 
    label: 'System Settings', 
    icon: Settings,
    description: 'Platform configuration'
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  setActiveSection,
  pendingReports = 0,
  pendingModeration = 0
}) => {
  const { logout, admin } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getBadgeCount = (itemId: AdminSection) => {
    switch (itemId) {
      case 'moderation':
        return pendingModeration;
      default:
        return undefined;
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen p-4">
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Swing Boudoir</p>
          </div>
        </div>
        
        {admin && (
          <div className="text-sm text-muted-foreground">
            <p>Logged in as: {admin.name}</p>
            <p className="text-xs">{admin.email}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const badgeCount = getBadgeCount(item.id);
          
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start h-auto py-3 px-3"
              onClick={() => setActiveSection(item.id)}
            >
              <div className="flex items-center w-full">
                <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {badgeCount && badgeCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {badgeCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Quick Actions */}
 

      {/* Logout */}
      <div className="border-t border-border pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Log Out
        </Button>
      </div>

      {/* System Status */}
      <div className="mt-8 p-3 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium">System Online</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}; 