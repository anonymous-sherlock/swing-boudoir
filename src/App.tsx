import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, ProtectedRoute, useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { PageLoader } from "@/components/PageLoader";
import { isProtectedRoute } from "@/routes";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { CompetitionsPage } from "./pages/Competitions";
import Winners from "./pages/Winners";
import Rules from "./pages/Rules";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PublicProfilePage from "./pages/PublicProfilePage";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import AddContest from "./pages/AddContest";

// Admin Pages
import { AdminLogin } from "./admin/pages/AdminLogin";
import { AdminRegister } from "./admin/pages/AdminRegister";

// Global Loading Wrapper Component
// Uses centralized route configuration from routes.ts for better maintainability
const AppContent: React.FC = () => {
  const { isLoading } = useAuth();
  const location = useLocation();

  // Show global loader only for protected routes while auth state is being determined
  // Public routes (like /auth/:id) should render immediately for better UX
  if (isLoading && isProtectedRoute(location.pathname)) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/competitions" element={<CompetitionsPage />} />
      <Route path="/winners" element={<Winners />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/add-contest" element={<AddContest />} />
      <Route path="/profile/:id" element={<PublicProfilePage />} />

      {/* Onboarding Route */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard/:section?"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard/add-contest" element={<AddContest />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <OnboardingProvider>
          <div className="App">
            <AppContent />
            <Toaster />
          </div>
        </OnboardingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
