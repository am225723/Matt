import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '@/AdminDashboard';
import DashboardOverview from '@/components/admin/DashboardOverview';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import SettingsSection from '@/components/admin/SettingsSection';
import NotificationsSection from '@/components/admin/NotificationsSection';

// Mock the components that are used in AdminDashboard
jest.mock('@/components/admin/DashboardOverview', () => {
  return function MockDashboardOverview() {
    return <div data-testid="dashboard-overview">Dashboard Overview Content</div>;
  };
});

jest.mock('@/components/admin/AnalyticsSection', () => {
  return function MockAnalyticsSection() {
    return <div data-testid="analytics-section">Analytics Section Content</div>;
  };
});

jest.mock('@/components/admin/UserManagementSection', () => {
  return function MockUserManagementSection() {
    return <div data-testid="user-management-section">User Management Section Content</div>;
  };
});

jest.mock('@/components/admin/SettingsSection', () => {
  return function MockSettingsSection() {
    return <div data-testid="settings-section">Settings Section Content</div>;
  };
});

jest.mock('@/components/admin/NotificationsSection', () => {
  return function MockNotificationsSection() {
    return <div data-testid="notifications-section">Notifications Section Content</div>;
  };
});

// Mock the Helmet component
jest.mock('react-helmet', () => ({
  Helmet: () => null
}));

// Mock the Toaster component
jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => null
}));

describe('AdminDashboard', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockOnBack.mockReset();
  });

  test('renders the dashboard overview by default', () => {
    render(<AdminDashboard onBack={mockOnBack} />);
    
    // Check if the dashboard overview is rendered
    expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
    
    // Check if the sidebar navigation items are rendered
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('navigates to different sections when sidebar items are clicked', () => {
    render(<AdminDashboard onBack={mockOnBack} />);
    
    // Click on Analytics in the sidebar
    fireEvent.click(screen.getByText('Analytics'));
    expect(screen.getByTestId('analytics-section')).toBeInTheDocument();
    
    // Click on User Management in the sidebar
    fireEvent.click(screen.getByText('User Management'));
    expect(screen.getByTestId('user-management-section')).toBeInTheDocument();
    
    // Click on Settings in the sidebar
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByTestId('settings-section')).toBeInTheDocument();
    
    // Click on Notifications in the sidebar
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByTestId('notifications-section')).toBeInTheDocument();
    
    // Click back to Dashboard Overview
    fireEvent.click(screen.getByText('Dashboard Overview'));
    expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(<AdminDashboard onBack={mockOnBack} />);
    
    // Find and click the back button
    const backButton = screen.getByText('Back to Main Dashboard');
    fireEvent.click(backButton);
    
    // Check if onBack was called
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});