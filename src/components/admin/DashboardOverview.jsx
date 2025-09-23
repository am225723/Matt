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
  Eye
} from 'lucide-react';

// Mock data for the dashboard
const mockMetrics = {
  totalUsers: {
    value: '1,284',
    change: '+12%',
    trend: 'up'
  },
  activeSessions: {
    value: '432',
    change: '+5%',
    trend: 'up'
  },
  avgSessionDuration: {
    value: '4m 32s',
    change: '+18%',
    trend: 'up'
  },
  conversionRate: {
    value: '24%',
    change: '-2%',
    trend: 'down'
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

const DashboardOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-500">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-md shadow flex">
            <Button 
              variant={dateRange === '7d' ? 'default' : 'ghost'} 
              onClick={() => setDateRange('7d')}
              className="rounded-r-none"
            >
              7D
            </Button>
            <Button 
              variant={dateRange === '30d' ? 'default' : 'ghost'} 
              onClick={() => setDateRange('30d')}
              className="rounded-none border-x border-gray-200"
            >
              30D
            </Button>
            <Button 
              variant={dateRange === '90d' ? 'default' : 'ghost'} 
              onClick={() => setDateRange('90d')}
              className="rounded-l-none"
            >
              90D
            </Button>
          </div>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Users" 
          value={mockMetrics.totalUsers.value} 
          change={mockMetrics.totalUsers.change} 
          trend={mockMetrics.totalUsers.trend} 
          icon={<Users className="h-5 w-5" />}
          description="Total registered users"
        />
        <MetricCard 
          title="Active Sessions" 
          value={mockMetrics.activeSessions.value} 
          change={mockMetrics.activeSessions.change} 
          trend={mockMetrics.activeSessions.trend} 
          icon={<Activity className="h-5 w-5" />}
          description="Current active sessions"
        />
        <MetricCard 
          title="Avg. Session Duration" 
          value={mockMetrics.avgSessionDuration.value} 
          change={mockMetrics.avgSessionDuration.change} 
          trend={mockMetrics.avgSessionDuration.trend} 
          icon={<Clock className="h-5 w-5" />}
          description="Time spent per session"
        />
        <MetricCard 
          title="Conversion Rate" 
          value={mockMetrics.conversionRate.value} 
          change={mockMetrics.conversionRate.change} 
          trend={mockMetrics.conversionRate.trend} 
          icon={<TrendingUp className="h-5 w-5" />}
          description="User conversion rate"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>User engagement metrics for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              {/* This would be replaced with an actual chart component */}
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {mockPerformanceData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-blue-500 rounded-t-md"
                      style={{ height: `${item.value * 0.7}%` }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 right-0 bottom-8 h-px bg-gray-200"></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivityData.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-4">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-center text-sm">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm font-medium">{mockSystemStatus.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${mockSystemStatus.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm font-medium">{mockSystemStatus.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${mockSystemStatus.memory}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm font-medium">{mockSystemStatus.storage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${mockSystemStatus.storage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">System Uptime</p>
                  <p className="text-sm text-gray-500">{mockSystemStatus.uptime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Restart</p>
                  <p className="text-sm text-gray-500">{formatDate(mockSystemStatus.lastRestart)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used admin functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="flex flex-col items-center justify-center h-24 text-center">
                <Users className="h-6 w-6 mb-2" />
                <span>Add New User</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-24 text-center">
                <BarChart2 className="h-6 w-6 mb-2" />
                <span>Generate Report</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-24 text-center">
                <Zap className="h-6 w-6 mb-2" />
                <span>System Settings</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-24 text-center">
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

// Metric Card Component
const MetricCard = ({ title, value, change, trend, icon, description }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gray-100 rounded-md">
            {icon}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
            trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;