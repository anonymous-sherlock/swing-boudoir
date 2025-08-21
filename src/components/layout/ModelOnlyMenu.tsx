import { Button } from "@/components/ui/button";
import { Bell, Trophy, User, Vote, Gift, HelpCircle, FileText, Lock, TrendingUp, SettingsIcon, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface ModelOnlyMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ModelOnlyMenu: React.FC<ModelOnlyMenuProps> = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && e.target instanceof Node && !menuContainerRef.current?.contains(e.target)) {
        onClose();
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Don't render if user is not a MODEL
  if (!user || user.type !== "MODEL") {
    return null;
  }

  const menuItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      onClick: () => {
        navigate({ to: "/dashboard/$section", params: { section: "notifications" } });
        onClose();
      },
      showBadge: true,
    },
    {
      id: "competitions",
      label: "Competitions",
      icon: Trophy,
      onClick: () => {
        navigate({ to: "/competitions" });
        onClose();
      },
    },
    {
      id: "public-profile",
      label: "Public Profile",
      icon: User,
      onClick: () => {
        navigate({ to: "/dashboard/$section", params: { section: "profile" } });
        onClose();
      },
    },
    {
      id: "votes",
      label: "Votes",
      icon: Vote,
      onClick: () => {
        navigate({ to: "/dashboard/$section", params: { section: "votes" } });
        onClose();
      },
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: TrendingUp,
      onClick: () => {
        navigate({ to: "/leaderboard" });
        onClose();
      },
    },
    {
      id: "support",
      label: "Support",
      icon: HelpCircle,
      onClick: () => {
        navigate({ to: "/dashboard/$section", params: { section: "support" } });
        onClose();
      },
    },
    {
      id: "official-rules",
      label: "Official Rules",
      icon: FileText,
      onClick: () => {
        navigate({ to: "/rules" });
        onClose();
      },
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: Lock,
      onClick: () => {
        navigate({ to: "/dashboard/$section", params: { section: "privacy" } });
        onClose();
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      onClick: () => {
        navigate({ to: "/dashboard/$section", params: { section: "settings" } });
        onClose();
      },
    },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
      <div ref={menuContainerRef} className="fixed left-0 top-0 h-full min-h-screen w-80 bg-white border-r border-border shadow-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Model Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button key={item.id} variant="ghost" className="w-full justify-start h-12" onClick={item.onClick}>
                <Icon className="mr-3 h-5 w-5" />
                <span className="text-base">{item.label}</span>
                {item.showBadge && unreadCount > 0 && (
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
                onLogout();
                onClose();
              }}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="text-base">Log out</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};
