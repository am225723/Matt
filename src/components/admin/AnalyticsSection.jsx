import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw, TrendingUp, Users, Activity, Clock } from 'lucide-react';

// Mock data for charts
const generateMockData = (days = 30) => {
  const data = [];
  let currentValue = Math.floor(Math.random() * 100) + 50;
  
  for (let i = 0; i < days; i++) {
    // Add some randomness to the data
    const change = Math.floor(Math.random() * 20) - 10;
    currentValue = Math.max(10, currentValue + change);
    
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: currentValue
    });
  }
  
  return data;
};

// Mock data for different metrics
const mockData = {
  users: generateMockData(),
  sessions: generateMockData(),
  engagement: generateMockData(),
  retention: generateMockData()
};

const AnalyticsSection = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to simulate data refresh
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-500">Monitor key metrics and performance indicators</p>
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
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Users" 
          value="1,284" 
          change="+12%" 
          trend="up" 
          icon={<Users className="h-5 w-5" />}
          description="Total registered users"
        />
        <MetricCard 
          title="Active Sessions" 
          value="432" 
          change="+5%" 
          trend="up" 
          icon={<Activity className="h-5 w-5" />}
          description="Current active sessions"
        />
        <MetricCard 
          title="Avg. Session Duration" 
          value="4m 32s" 
          change="+18%" 
          trend="up" 
          icon={<Clock className="h-5 w-5" />}
          description="Time spent per session"
        />
        <MetricCard 
          title="Conversion Rate" 
          value="24%" 
          change="-2%" 
          trend="down" 
          icon={<TrendingUp className="h-5 w-5" />}
          description="User conversion rate"
        />
      </div>
      
      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-md flex items-center justify-center">
                {/* This would be replaced with an actual chart component */}
                <div className="text-center p-6">
                  <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-blue-50 rounded-md mb-4 relative overflow-hidden">
                    {/* Simple chart visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 border-t border-blue-500/50">
                      <div className="absolute bottom-0 left-1/4 w-1 h-12 bg-blue-500/50"></div>
                      <div className="absolute bottom-0 left-2/4 w-1 h-20 bg-blue-500/50"></div>
                      <div className="absolute bottom-0 left-3/4 w-1 h-16 bg-blue-500/50"></div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Chart visualization would be implemented with a library like Chart.js, Recharts, or D3.js
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Average time spent in app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 bg-gray-50 rounded-md flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-full h-32 bg-gradient-to-r from-green-100 to-green-50 rounded-md mb-4 relative overflow-hidden">
                      {/* Simple chart visualization */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-500/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 border-t border-green-500/50">
                        <div className="absolute bottom-0 left-1/4 w-1 h-10 bg-green-500/50"></div>
                        <div className="absolute bottom-0 left-2/4 w-1 h-16 bg-green-500/50"></div>
                        <div className="absolute bottom-0 left-3/4 w-1 h-12 bg-green-500/50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Retention Rate</CardTitle>
                <CardDescription>User retention over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 bg-gray-50 rounded-md flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-full h-32 bg-gradient-to-r from-purple-100 to-purple-50 rounded-md mb-4 relative overflow-hidden">
                      {/* Simple chart visualization */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 border-t border-purple-500/50">
                        <div className="absolute bottom-0 left-1/4 w-1 h-14 bg-purple-500/50"></div>
                        <div className="absolute bottom-0 left-2/4 w-1 h-10 bg-purple-500/50"></div>
                        <div className="absolute bottom-0 left-3/4 w-1 h-18 bg-purple-500/50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>Breakdown of user base by demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-md flex items-center justify-center">
                <p className="text-gray-500">User demographics chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>Most used features and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Feature usage chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Analysis</CardTitle>
              <CardDescription>User retention by cohort groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Cohort analysis chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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

export default AnalyticsSection;