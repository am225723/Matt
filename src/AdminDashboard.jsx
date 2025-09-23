import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Bell, 
  BarChart2, 
  ChevronRight, 
  Menu,
  X
} from 'lucide-react';

// Import admin dashboard components
import DashboardOverview from '@/components/admin/DashboardOverview';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import SettingsSection from '@/components/admin/SettingsSection';
import NotificationsSection from '@/components/admin/NotificationsSection';

// Admin Dashboard Component
const AdminDashboard = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items for the sidebar
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Render the appropriate section based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'users':
        return <UserManagementSection />;
      case 'settings':
        return <SettingsSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Advanced admin dashboard for managing application settings and users" />
      </Helmet>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm">&larr; Back</Button>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-6 py-3 text-left ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="w-full"
          >
            Back to Main Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-6">
          {renderSection()}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default AdminDashboard;