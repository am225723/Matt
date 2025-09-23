import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Download, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Eye,
  ChevronDown,
  MoreHorizontal,
  Filter,
  Layers,
  PieChart,
  LineChart,
  Cpu,
  HardDrive,
  Database
} from 'lucide-react';

// Mock data for the dashboard
const mockMetrics = {
  totalUsers: {
    value: '1,284',
    change: '+12%',
    trend: 'up',
    color: 'blue'
  },
  activeSessions: {
    value: '432',
    change: '+5%',
    trend: 'up',
    color: 'green'
  },
  avgSessionDuration: {
    value: '4m 32s',
    change: '+18%',
    trend: 'up',
    color: 'purple'
  },
  conversionRate: {
    value: '24%',
    change: '-2%',
    trend: 'down',
    color: 'amber'
  }
};

const mockActivityData = [
  {
    id: 1,
    type: 'user_registration',
    description: 'New user registered',
    user: 'John Doe',
    time: '1 hour ago'
  },
  {
    id: 2,
    type: 'content_update',
    description: 'Content updated',
    user: 'Jane Smith',
    time: '2 hours ago'
  },
  {
    id: 3,
    type: 'system_alert',
    description: 'System backup completed',
    user: 'System',
    time: '3 hours ago'
  },
  {
    id: 4,
    type: 'user_login',
    description: 'User logged in',
    user: 'Bob Johnson',
    time: '4 hours ago'
  },
  {
    id: 5,
    type: 'error',
    description: 'API request failed',
    user: 'System',
    time: '5 hours ago'
  }
];

const mockPerformanceData = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 72 },
  { name: 'Wed', value: 68 },
  { name: 'Thu', value: 78 },
  { name: 'Fri', value: 82 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 40 }
];

const mockSystemStatus = {
  cpu: 32,
  memory: 64,
  storage: 48,
  uptime: '23d 4h 15m',
  lastRestart: '2025-08-30T10:15:00Z'
};

const DashboardOverviewRedesign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Function to simulate data refresh
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'content_update':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'system_alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'user_login':
        return <Eye className="h-5 w-5 text-purple-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin User</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm flex">
            <Button 
              variant={dateRange === '7d' ? 'default' : 'ghost'} 
              onClick={() => setDateRange('7d')}
              className="rounded-r-none"
              size="sm"
            >
              7D
            </Button>
            <Button 
              variant={dateRange === '30d' ? 'default' : 'ghost'} 
              onClick={() => setDateRange('30d')}
              className="rounded-none border-x border-gray-200 dark:border-gray-700"
              size="sm"
            >
              30D
            </Button>
            <Button 
              variant={dateRange === '90d' ? 'default' : 'ghost'} 
              onClick={() => setDateRange('90d')}
              className="rounded-l-none"
              size="sm"
            >
              90D
            </Button>
          </div>
          
          {/* Action Buttons */}
          <Button variant="outline" onClick={refreshData} disabled={isLoading} size="sm">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 inline-flex items-center border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Layers className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-1 inline-flex items-center border-b-2 ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Performance
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 inline-flex items-center border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-2 px-1 inline-flex items-center border-b-2 ${
              activeTab === 'system'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Cpu className="h-4 w-4 mr-2" />
            System
          </button>
        </nav>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCardRedesign 
          title="Total Users" 
          value={mockMetrics.totalUsers.value} 
          change={mockMetrics.totalUsers.change} 
          trend={mockMetrics.totalUsers.trend} 
          icon={<Users className="h-5 w-5" />}
          description="Total registered users"
          color={mockMetrics.totalUsers.color}
        />
        <MetricCardRedesign 
          title="Active Sessions" 
          value={mockMetrics.activeSessions.value} 
          change={mockMetrics.activeSessions.change} 
          trend={mockMetrics.activeSessions.trend} 
          icon={<Activity className="h-5 w-5" />}
          description="Current active sessions"
          color={mockMetrics.activeSessions.color}
        />
        <MetricCardRedesign 
          title="Avg. Session Duration" 
          value={mockMetrics.avgSessionDuration.value} 
          change={mockMetrics.avgSessionDuration.change} 
          trend={mockMetrics.avgSessionDuration.trend} 
          icon={<Clock className="h-5 w-5" />}
          description="Time spent per session"
          color={mockMetrics.avgSessionDuration.color}
        />
        <MetricCardRedesign 
          title="Conversion Rate" 
          value={mockMetrics.conversionRate.value} 
          change={mockMetrics.conversionRate.change} 
          trend={mockMetrics.conversionRate.trend} 
          icon={<TrendingUp className="h-5 w-5" />}
          description="User conversion rate"
          color={mockMetrics.conversionRate.color}
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
              <CardDescription>User engagement metrics for the past week</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <PieChart className="h-4 w-4 mr-1" />
                <span>Chart Type</span>
              </Button>
              <Button variant="ghost" size="icon" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="h-80 relative">
                {/* This would be replaced with an actual chart component */}
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  {mockPerformanceData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-400 rounded-t-md"
                        style={{ height: `${item.value * 0.7}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute left-0 right-0 bottom-8 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">This Week</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Last Week</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest actions and events</CardDescription>
            </div>
            <Button variant="ghost" size="icon" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockActivityData.map((activity) => (
                <div key={activity.id} className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="mr-4">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.description}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{activity.user}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 text-center">
              <Button variant="ghost" size="sm" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* System Status & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription>Current system performance metrics</CardDescription>
            </div>
            <Button variant="ghost" size="icon" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm font-medium">{mockSystemStatus.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${mockSystemStatus.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm font-medium">{mockSystemStatus.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-2.5 rounded-full" 
                    style={{ width: `${mockSystemStatus.memory}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <HardDrive className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium">Storage Usage</span>
                  </div>
                  <span className="text-sm font-medium">{mockSystemStatus.storage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${mockSystemStatus.storage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">System Uptime</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{mockSystemStatus.uptime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Restart</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(mockSystemStatus.lastRestart)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Frequently used admin functions</CardDescription>
            </div>
            <Button variant="ghost" size="icon" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-auto py-4 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                <span>Add New User</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <BarChart2 className="h-6 w-6 mb-2" />
                <span>Generate Report</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <Zap className="h-6 w-6 mb-2" />
                <span>System Settings</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <RefreshCw className="h-6 w-6 mb-2" />
                <span>Clear Cache</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Redesigned Metric Card Component
const MetricCardRedesign = ({ title, value, change, trend, icon, description, color }) => {
  // Get color classes based on the color prop
  const getColorClasses = (colorName) => {
    switch (colorName) {
      case 'blue':
        return {
          bgLight: 'bg-blue-50 dark:bg-blue-900/20',
          bgDark: 'bg-blue-500 dark:bg-blue-600',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800'
        };
      case 'green':
        return {
          bgLight: 'bg-green-50 dark:bg-green-900/20',
          bgDark: 'bg-green-500 dark:bg-green-600',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800'
        };
      case 'purple':
        return {
          bgLight: 'bg-purple-50 dark:bg-purple-900/20',
          bgDark: 'bg-purple-500 dark:bg-purple-600',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-200 dark:border-purple-800'
        };
      case 'amber':
        return {
          bgLight: 'bg-amber-50 dark:bg-amber-900/20',
          bgDark: 'bg-amber-500 dark:bg-amber-600',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800'
        };
      default:
        return {
          bgLight: 'bg-gray-50 dark:bg-gray-800',
          bgDark: 'bg-gray-500 dark:bg-gray-600',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700'
        };
    }
  };
  
  const colorClasses = getColorClasses(color);
  
  return (
    <Card className={`border ${colorClasses.border} overflow-hidden`}>
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className={`p-4 ${colorClasses.bgLight}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-md ${colorClasses.bgDark} text-white`}>
                {icon}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
              <p className={`text-2xl font-bold ${colorClasses.text}`}>{value}</p>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardOverviewRedesign;