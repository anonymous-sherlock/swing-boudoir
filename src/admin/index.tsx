import React, { useState } from 'react';
import { AdminProvider } from './contexts/AdminContext';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { CompetitionManagement } from './pages/CompetitionManagement';
import { AdminInviteManager } from './components/AdminInviteManager';
import { AdminSection } from './types/adminTypes';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'competitions':
        return <CompetitionManagement />;
      case 'settings':
        return <AdminInviteManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <AdminSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            pendingReports={3}
            pendingModeration={5}
          />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminPanel; 