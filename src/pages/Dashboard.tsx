import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
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
import Header from "@/components/layout/Header";
import { ONBOARDING_REDIRECT } from "@/routes";
import { DashboardSection } from "@/routes/dashboard/$section";
import Leaderboard from "@/pages/Leaderboard";

function DashboardLayout({
  activeSection = "public-profile",
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
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const currentSection = pathname.startsWith("/dashboard/") ? (pathname.split("/")[2] as DashboardSection) : undefined;

  const { isAuthenticated, isLoading, checkUserNeedsOnboarding } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>(currentSection || "public-profile");

  // Auth and onboarding checks
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.navigate({ to: "/auth/$id", params: { id: "sign-in" }, replace: true });
    } else if (checkUserNeedsOnboarding()) {
      router.navigate({ to: ONBOARDING_REDIRECT, replace: true });
    }
    // eslint-disable-next-line
  }, [isAuthenticated, isLoading]);

  // Sync state with URL param (but do not redirect if section is missing)
  useEffect(() => {
    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
    // eslint-disable-next-line
  }, [currentSection]);

  // Update URL when section changes (only if user changes section)
  const handleSetActiveSection = (newSection: DashboardSection) => {
    setActiveSection(newSection);
    if (newSection !== currentSection) {
      router.navigate({ to: "/dashboard/$section", params: { section: newSection } });
    }
  };

  // No need to check loading here - it's handled globally

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || checkUserNeedsOnboarding()) {
    // Don't render dashboard if not authenticated or not onboarded
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "edit-profile":
        return <EditProfile />;
      case "notifications":
        return <DashboardNotifications />;
      case "public-profile":
        return <PublicProfile />;
      case "competitions":
        return <DashboardCompetitions />;
      case "votes":
        return <Votes />;
      case "prize-history":
        return <PrizeHistory />;
      case "leaderboard":
        return <Leaderboard />;
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
