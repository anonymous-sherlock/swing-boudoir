import { Button } from "@/components/ui/button";
import { Home, Trophy, TrendingUp, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useRef, useEffect, useState } from "react";

interface VoterOnlyMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoterOnlyMenu: React.FC<VoterOnlyMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
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

  // Don't render if user is not a VOTER
  if (!user || user.type !== "VOTER") {
    return null;
  }

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      onClick: () => {
        navigate({ to: "/" });
        onClose();
      },
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
      id: "leaderboard",
      label: "Leaderboard",
      icon: TrendingUp,
      onClick: () => {
        navigate({ to: "/leaderboard" });
        onClose();
      },
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      onClick: async () => {
        try {
          await handleLogout();
          onClose();
        } catch (error) {
          console.error("Logout failed:", error);
        }
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
            <h2 className="text-xl font-bold text-foreground">Swing Boudoir</h2>
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
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
