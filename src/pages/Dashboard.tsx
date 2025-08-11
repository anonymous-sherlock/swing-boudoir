import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { EditProfile } from "@/components/dashboard/EditProfile";
import { PublicProfile } from "@/components/dashboard/PublicProfile";
import { DashboardCompetitions } from "@/components/dashboard/DashboardCompetitions";
import { Votes } from "@/components/dashboard/Votes";
import { PrizeHistory } from "@/components/dashboard/PrizeHistory";
import { Settings } from "@/components/dashboard/Settings";
import { Support } from "@/components/dashboard/Support";
import { OfficialRules } from "@/components/dashboard/OfficialRules";
import { PrivacyPolicy } from "@/components/dashboard/PrivacyPolicy";
import Header from "@/components/Header";
import { ONBOARDING_REDIRECT, authPages } from "@/routes";

export type DashboardSection =
  | "notifications"
  | "edit-profile"
  | "public-profile"
  | "competitions"
  | "votes"
  | "prize-history"
  | "settings"
  | "support"
  | "official-rules"
  | "privacy";

function DashboardLayout({
  activeSection,
  setActiveSection,
  children,
}: {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={handleSidebarToggle} />
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </aside>

        {/* Mobile Sidebar */}
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isMobile={true} isOpen={isMobileSidebarOpen} onToggle={() => setIsMobileSidebarOpen(false)} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { section } = useParams<{ section?: DashboardSection }>();
  const navigate = useNavigate();
  const { isAuthenticated, checkUserNeedsOnboarding } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>((section as DashboardSection) || "notifications");

  // Auth and onboarding checks
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(authPages.login, { replace: true });
    } else if (checkUserNeedsOnboarding()) {
      navigate(ONBOARDING_REDIRECT, { replace: true });
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Sync state with URL param (but do not redirect if section is missing)
  useEffect(() => {
    if (section && section !== activeSection) {
      setActiveSection(section as DashboardSection);
    }
    // eslint-disable-next-line
  }, [section]);

  // Update URL when section changes (only if user changes section)
  const handleSetActiveSection = (newSection: DashboardSection) => {
    setActiveSection(newSection);
    if (newSection !== section) {
      navigate(`/dashboard/${newSection}`);
    }
  };

  // No need to check loading here - it's handled globally

  if (!isAuthenticated || checkUserNeedsOnboarding()) {
    // Don't render dashboard if not authenticated or not onboarded
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "notifications":
        return <DashboardNotifications />;
      case "edit-profile":
        return <EditProfile />;
      case "public-profile":
        return <PublicProfile />;
      case "competitions":
        return <DashboardCompetitions />;
      case "votes":
        return <Votes />;
      case "prize-history":
        return <PrizeHistory />;
      case "settings":
        return <Settings />;
      case "support":
        return <Support />;
      case "official-rules":
        return <OfficialRules />;
      case "privacy":
        return <PrivacyPolicy />;
      default:
        return <DashboardNotifications />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={handleSetActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
}
