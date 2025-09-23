import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Activity, 
  Clock, 
  BarChart2,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Layers,
  Zap,
  Eye,
  MousePointer,
  Map,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

// Mock data for analytics
const mockAnalytics = {
  userGrowth: [
    { date: '2025-09-01', value: 1150 },
    { date: '2025-09-08', value: 1184 },
    { date: '2025-09-15', value: 1210 },
    { date: '2025-09-22', value: 1284 }
  ],
  activeUsers: {
    daily: 432,
    weekly: 1876,
    monthly: 5340,
    trend: '+8.2%'
  },
  engagement: {
    avgSessionDuration: '4m 32s',
    pagesPerSession: 5.2,
    bounceRate: '32%',
    trend: '+12.5%'
  },
  retention: {
    day1: 76,
    day7: 54,
    day30: 38,
    trend: '-2.1%'
  },
  devices: [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 32 },
    { name: 'Tablet', value: 10 }
  ],
  locations: [
    { name: 'United States', value: 42 },
    { name: 'United Kingdom', value: 15 },
    { name: 'Germany', value: 12 },
    { name: 'Canada', value: 8 },
    { name: 'Australia', value: 6 },
    { name: 'Others', value: 17 }
  ],
  trafficSources: [
    { name: 'Direct', value: 35 },
    { name: 'Organic Search', value: 25 },
    { name: 'Social Media', value: 20 },
    { name: 'Referral', value: 15 },
    { name: 'Email', value: 5 }
  ]
};

const AnalyticsSectionRedesign = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('line');
  
  // Function to simulate data refresh
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor key metrics and performance indicators</p>
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
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Custom Range</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      {/* Analytics Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Layers className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'engagement'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Activity className="h-4 w-4 mr-2" />
            Engagement
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'retention'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Retention
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'traffic'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Globe className="h-4 w-4 mr-2" />
            Traffic
          </button>
        </nav>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AnalyticsCard 
          title="Total Users" 
          value={mockAnalytics.userGrowth[mockAnalytics.userGrowth.length - 1].value.toLocaleString()} 
          change="+12%" 
          trend="up" 
          icon={<Users className="h-5 w-5" />}
          color="blue"
        />
        <AnalyticsCard 
          title="Active Users" 
          value={mockAnalytics.activeUsers.daily.toLocaleString()} 
          change={mockAnalytics.activeUsers.trend} 
          trend="up" 
          icon={<Eye className="h-5 w-5" />}
          color="green"
        />
        <AnalyticsCard 
          title="Avg. Session Duration" 
          value={mockAnalytics.engagement.avgSessionDuration} 
          change={mockAnalytics.engagement.trend} 
          trend="up" 
          icon={<Clock className="h-5 w-5" />}
          color="purple"
        />
        <AnalyticsCard 
          title="Retention Rate" 
          value={`${mockAnalytics.retention.day7}%`} 
          change={mockAnalytics.retention.trend} 
          trend="down" 
          icon={<Zap className="h-5 w-5" />}
          color="amber"
        />
      </div>
      
      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                <Button 
                  variant={chartType === 'line' ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setChartType('line')}
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </div>
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
                  {mockAnalytics.userGrowth.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className={`w-12 ${
                          chartType === 'line' 
                            ? 'bg-transparent border-t-4 border-blue-500 dark:border-blue-400' 
                            : 'bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-400 rounded-t-md'
                        }`}
                        style={{ 
                          height: chartType === 'line' ? '1px' : `${(item.value / 1500) * 100}%`,
                          marginTop: chartType === 'line' ? `${100 - (item.value / 1500) * 100}%` : '0'
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                  {chartType === 'line' && (
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-blue-500/20"></div>
                    </div>
                  )}
                </div>
                <div className="absolute left-0 right-0 bottom-8 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">This Period</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Previous Period</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* User Demographics */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">User Demographics</CardTitle>
              <CardDescription>Breakdown by location</CardDescription>
            </div>
            <Button variant="ghost" size="icon" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="space-y-4">
                {mockAnalytics.locations.map((location, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{location.name}</div>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${location.value}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-10 text-right text-sm font-medium">{location.value}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 text-center">
              <Button variant="ghost" size="sm" className="w-full">
                View Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Device Distribution</CardTitle>
              <CardDescription>User device breakdown</CardDescription>
            </div>
            <Button variant="ghost" size="icon" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              {/* Donut chart visualization */}
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Desktop segment */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#3b82f6" 
                    strokeWidth="20" 
                    strokeDasharray={`${mockAnalytics.devices[0].value * 2.51} ${251.2 - mockAnalytics.devices[0].value * 2.51}`} 
                    strokeDashoffset="0" 
                  />
                  {/* Mobile segment */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth="20" 
                    strokeDasharray={`${mockAnalytics.devices[1].value * 2.51} ${251.2 - mockAnalytics.devices[1].value * 2.51}`} 
                    strokeDashoffset={`${-mockAnalytics.devices[0].value * 2.51}`} 
                  />
                  {/* Tablet segment */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#a855f7" 
                    strokeWidth="20" 
                    strokeDasharray={`${mockAnalytics.devices[2].value * 2.51} ${251.2 - mockAnalytics.devices[2].value * 2.51}`} 
                    strokeDashoffset={`${-(mockAnalytics.devices[0].value + mockAnalytics.devices[1].value) * 2.51}`} 
                  />
                  <circle cx="50" cy="50" r="30" fill="white" className="dark:fill-gray-800" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {mockAnalytics.devices.map((device, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="flex items-center mb-1">
                    {index === 0 && <Monitor className="h-4 w-4 text-blue-500 mr-1" />}
                    {index === 1 && <Smartphone className="h-4 w-4 text-green-500 mr-1" />}
                    {index === 2 && <Tablet className="h-4 w-4 text-purple-500 mr-1" />}
                    <span className="text-sm font-medium">{device.name}</span>
                  </div>
                  <span className="text-lg font-bold">{device.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Traffic Sources */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
              <CardDescription>Where users come from</CardDescription>
            </div>
            <Button variant="ghost" size="icon" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockAnalytics.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{source.name}</div>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${source.value}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm font-medium">{source.value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Analytics Card Component
const AnalyticsCard = ({ title, value, change, trend, icon, color }) => {
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
            <div className="flex items-center justify-between">
              <span>Last {dateRange === '7d' ? '7' : dateRange === '30d' ? '30' : '90'} days</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSectionRedesign;