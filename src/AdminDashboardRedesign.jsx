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
  Menu,
  X,
  Search,
  HelpCircle,
  User,
  LogOut,
  ChevronDown,
  Home,
  Inbox,
  Calendar,
  FileText,
  Bookmark,
  Star
} from 'lucide-react';

// Import admin dashboard components
import DashboardOverviewRedesign from '@/components/admin/redesign/DashboardOverviewRedesign';
import AnalyticsSectionRedesign from '@/components/admin/redesign/AnalyticsSectionRedesign';
import UserManagementSectionRedesign from '@/components/admin/redesign/UserManagementSectionRedesign';
import SettingsSectionRedesign from '@/components/admin/redesign/SettingsSectionRedesign';
import NotificationsSectionRedesign from '@/components/admin/redesign/NotificationsSectionRedesign';

// Admin Dashboard Component
const AdminDashboardRedesign = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Navigation items for the sidebar
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, badge: null },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" />, badge: null },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, badge: '12' },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadNotifications },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, badge: null },
  ];

  // Favorites (quick access items)
  const favoriteItems = [
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <Inbox className="w-5 h-5" /> },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode to the document
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Effect to apply dark mode on initial load
  useEffect(() => {
    // Check system preference or saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Render the appropriate section based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverviewRedesign />;
      case 'analytics':
        return <AnalyticsSectionRedesign />;
      case 'users':
        return <UserManagementSectionRedesign />;
      case 'settings':
        return <SettingsSectionRedesign darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'notifications':
        return <NotificationsSectionRedesign onNotificationsRead={() => setUnreadNotifications(0)} />;
      default:
        return <DashboardOverviewRedesign />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Advanced admin dashboard for managing application settings and users" />
      </Helmet>

      {/* Top Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-30 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-2 flex items-center justify-between transition-colors duration-200`}>
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Desktop sidebar toggle */}
          <button 
            onClick={toggleSidebar}
            className="hidden lg:block p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Logo */}
          <div className="ml-2 lg:ml-4 flex items-center">
            <Home className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="ml-2 text-lg font-semibold hidden md:block">Matthew's Admin</span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
              } border focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Help */}
          <button className={`p-2 rounded-full ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <HelpCircle className="w-5 h-5" />
          </button>
          
          {/* Notifications */}
          <button 
            onClick={() => setActiveSection('notifications')}
            className={`p-2 rounded-full relative ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            } ${activeSection === 'notifications' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadNotifications}
              </span>
            )}
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={toggleUserMenu}
              className={`flex items-center space-x-2 p-1 rounded-full ${
                darkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-blue-100'
              }`}>
                <User className={`w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs opacity-75">admin@example.com</p>
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </button>
            
            {userMenuOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <a href="#" className={`block px-4 py-2 text-sm ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}>Your Profile</a>
                <a href="#" className={`block px-4 py-2 text-sm ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}>Account Settings</a>
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-full text-left block px-4 py-2 text-sm ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                <a href="#" onClick={onBack} className={`block px-4 py-2 text-sm ${
                  darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                }`}>
                  <div className="flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } pt-16 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-colors duration-200 ${
                  activeSection === item.id
                    ? darkMode 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-blue-100 text-blue-700'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className={sidebarCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    item.id === 'notifications' && unreadNotifications > 0
                      ? 'bg-red-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          
          {/* Favorites Section */}
          {!sidebarCollapsed && (
            <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-2">
                Favorites
              </h3>
              <div className="space-y-1">
                {favoriteItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                      darkMode
                        ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                    darkMode
                      ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3"><Bookmark className="w-5 h-5" /></span>
                  <span>Add Favorite</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Back Button */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <Button 
              onClick={onBack} 
              variant={darkMode ? "outline" : "secondary"}
              className={`w-full ${sidebarCollapsed ? 'p-2 justify-center' : ''}`}
            >
              {sidebarCollapsed ? (
                <LogOut className="w-5 h-5" />
              ) : (
                <span>Back to Dashboard</span>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed 
          ? 'lg:pl-16' 
          : 'lg:pl-64'
      }`}>
        <div className="p-4 md:p-6">
          {renderSection()}
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default AdminDashboardRedesign;