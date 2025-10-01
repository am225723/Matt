import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Activity, Heart, Bed, Weight, Brain, Salad, TrendingUp, TrendingDown, 
  Calendar, Clock, Zap, Shield, Target, Award, AlertCircle, Settings,
  RefreshCw, Download, Share2, Eye, EyeOff, ChevronLeft, ChevronRight,
  Phone, Watch, Thermometer, Droplets, Wind, Sun, Moon
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format, subDays, startOfDay, endOfDay, isToday, isYesterday } from 'date-fns';

const EnhancedHealthDashboard = ({ onBack }) => {
  // Enhanced state management
  const [healthData, setHealthData] = useLocalStorage('enhancedHealthData', []);
  const [currentData, setCurrentData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState('7d');
  const [widgetVisibility, setWidgetVisibility] = useLocalStorage('widgetVisibility', {
    overview: true,
    trends: true,
    insights: true,
    recommendations: true,
    comparisons: true,
    goals: true,
  });
  const [theme, setTheme] = useLocalStorage('healthTheme', 'light');
  const [isLoading, setIsLoading] = useState(false);

  // Sample health data generator for demo
  const generateSampleData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: date.toISOString(),
        steps: Math.floor(Math.random() * 5000) + 5000,
        sleep: Math.random() * 4 + 5, // 5-9 hours
        heartRate: Math.floor(Math.random() * 20) + 60, // 60-80 bpm
        weight: 150 + Math.random() * 10 - 5, // 145-155 lbs
        stressLevel: Math.floor(Math.random() * 8) + 2, // 2-10
        hydration: Math.floor(Math.random() * 50) + 50, // 50-100 oz
        calories: Math.floor(Math.random() * 1000) + 1500, // 1500-2500
        mood: Math.floor(Math.random() * 5) + 1, // 1-5
        exerciseMinutes: Math.floor(Math.random() * 60) + 30, // 30-90 mins
        sleepQuality: Math.floor(Math.random() * 5) + 1, // 1-5
        waterIntake: Math.floor(Math.random() * 50) + 50, // 50-100 oz
      });
    }
    return data;
  };

  // Initialize with sample data if empty
  useEffect(() => {
    if (healthData.length === 0) {
      setHealthData(generateSampleData());
    }
  }, []);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const days = parseInt(timeRange.replace('d', ''));
    const cutoffDate = subDays(selectedDate, days);
    return healthData.filter(d => new Date(d.date) >= cutoffDate);
  }, [healthData, selectedDate, timeRange]);

  // Calculate metrics and trends
  const metrics = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const latest = filteredData[filteredData.length - 1];
    const previous = filteredData[filteredData.length - 2] || latest;
    
    return {
      steps: {
        current: latest.steps,
        trend: latest.steps - previous.steps,
        average: filteredData.reduce((sum, d) => sum + d.steps, 0) / filteredData.length,
        goal: 10000,
      },
      sleep: {
        current: latest.sleep,
        trend: latest.sleep - previous.sleep,
        average: filteredData.reduce((sum, d) => sum + d.sleep, 0) / filteredData.length,
        goal: 8,
      },
      heartRate: {
        current: latest.heartRate,
        trend: latest.heartRate - previous.heartRate,
        average: filteredData.reduce((sum, d) => sum + d.heartRate, 0) / filteredData.length,
        goal: 65,
      },
      weight: {
        current: latest.weight,
        trend: latest.weight - previous.weight,
        average: filteredData.reduce((sum, d) => sum + d.weight, 0) / filteredData.length,
        goal: 150,
      },
      stressLevel: {
        current: latest.stressLevel,
        trend: latest.stressLevel - previous.stressLevel,
        average: filteredData.reduce((sum, d) => sum + d.stressLevel, 0) / filteredData.length,
        goal: 3,
      },
    };
  }, [filteredData]);

  // Generate insights
  const insights = useMemo(() => {
    if (!metrics || filteredData.length < 3) return [];
    
    const insights = [];
    
    // Trend analysis
    Object.entries(metrics).forEach(([key, metric]) => {
      if (Math.abs(metric.trend) > 5) {
        const direction = metric.trend > 0 ? 'increased' : 'decreased';
        insights.push({
          type: 'trend',
          metric: key,
          message: `${key.charAt(0).toUpperCase() + key.slice(1)} has ${direction} by ${Math.abs(metric.trend).toFixed(1)}`,
          severity: Math.abs(metric.trend) > 10 ? 'high' : 'medium',
        });
      }
    });
    
    // Goal achievement
    Object.entries(metrics).forEach(([key, metric]) => {
      const achievement = (metric.current / metric.goal) * 100;
      if (achievement >= 100) {
        insights.push({
          type: 'achievement',
          metric: key,
          message: `Great job! You've exceeded your ${key} goal`,
          severity: 'success',
        });
      }
    });
    
    return insights.slice(0, 5);
  }, [metrics, filteredData]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    if (!metrics) return [];
    
    const recommendations = [];
    
    if (metrics.steps.current < metrics.steps.goal * 0.8) {
      recommendations.push({
        title: 'Increase Daily Steps',
        description: 'Try adding a 15-minute walk to reach your step goal',
        icon: Activity,
        priority: 'high',
      });
    }
    
    if (metrics.sleep.current < metrics.sleep.goal * 0.9) {
      recommendations.push({
        title: 'Improve Sleep Quality',
        description: 'Consider a bedtime routine to improve sleep duration',
        icon: Bed,
        priority: 'high',
      });
    }
    
    if (metrics.stressLevel.current > 7) {
      recommendations.push({
        title: 'Stress Management',
        description: 'Practice deep breathing or meditation for 10 minutes daily',
        icon: Brain,
        priority: 'medium',
      });
    }
    
    return recommendations;
  }, [metrics]);

  // Calculate health score
  const healthScore = useMemo(() => {
    if (!metrics) return 0;
    
    let score = 0;
    const weights = {
      steps: 0.25,
      sleep: 0.25,
      heartRate: 0.2,
      weight: 0.15,
      stressLevel: 0.15,
    };
    
    Object.entries(metrics).forEach(([key, metric]) => {
      const normalized = Math.min(100, (metric.current / metric.goal) * 100);
      score += normalized * weights[key];
    });
    
    return Math.round(score);
  }, [metrics]);

  // Chart data preparation
  const chartData = useMemo(() => {
    return filteredData.map(d => ({
      date: format(new Date(d.date), 'MMM dd'),
      steps: d.steps,
      sleep: d.sleep,
      heartRate: d.heartRate,
      weight: d.weight,
      stressLevel: d.stressLevel,
    }));
  }, [filteredData]);

  // Custom hooks simulation
  const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    });
    
    useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    
    return [value, setValue];
  };

  // Widget components
  const OverviewCard = ({ title, value, unit, trend, icon: Icon, color, goal }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value?.toLocaleString()} <span className="text-lg font-normal text-gray-500">{unit}</span>
          </p>
          {goal && (
            <p className="text-xs text-gray-500 mt-1">Goal: {goal}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <TrendingUp className={`w-4 h-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`ml-1 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      )}
    </motion.div>
  );

  const ChartWidget = ({ title, data, dataKey, color }) => (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              fill={`url(#gradient-${dataKey})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const InsightsWidget = ({ insights }) => (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border-l-4 ${insight.severity === 'high' ? 'border-red-500 bg-red-50' : insight.severity === 'success' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}
            >
              <p className="text-sm font-medium">{insight.message}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const RecommendationsWidget = ({ recommendations }) => (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <rec.icon className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">{rec.title}</p>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const HealthScoreWidget = ({ score }) => (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Health Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{score}</div>
          <div className="text-sm opacity-90">out of 100</div>
          <Progress value={score} className="mt-4 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );

  const GoalsWidget = () => (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Health Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics && Object.entries(metrics).map(([key, metric]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{key}</span>
                <span>{metric.current} / {metric.goal}</span>
              </div>
              <Progress 
                value={(metric.current / metric.goal) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Main dashboard layout
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={onBack} variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="14d">14 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Health Score and Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <HealthScoreWidget score={healthScore} />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {metrics && (
                <>
                  <OverviewCard
                    title="Daily Steps"
                    value={metrics.steps.current}
                    unit="steps"
                    trend={((metrics.steps.current - metrics.steps.average) / metrics.steps.average) * 100}
                    icon={Activity}
                    color="bg-blue-500"
                    goal={metrics.steps.goal}
                  />
                  <OverviewCard
                    title="Sleep Hours"
                    value={metrics.sleep.current}
                    unit="hrs"
                    trend={((metrics.sleep.current - metrics.sleep.average) / metrics.sleep.average) * 100}
                    icon={Bed}
                    color="bg-purple-500"
                    goal={metrics.sleep.goal}
                  />
                  <OverviewCard
                    title="Heart Rate"
                    value={metrics.heartRate.current}
                    unit="bpm"
                    trend={((metrics.heartRate.current - metrics.heartRate.average) / metrics.heartRate.average) * 100}
                    icon={Heart}
                    color="bg-red-500"
                    goal={metrics.heartRate.goal}
                  />
                  <OverviewCard
                    title="Weight"
                    value={metrics.weight.current}
                    unit="lbs"
                    trend={((metrics.weight.current - metrics.weight.average) / metrics.weight.average) * 100}
                    icon={Weight}
                    color="bg-green-500"
                    goal={metrics.weight.goal}
                  />
                  <OverviewCard
                    title="Stress Level"
                    value={metrics.stressLevel.current}
                    unit="/10"
                    trend={((metrics.stressLevel.current - metrics.stressLevel.average) / metrics.stressLevel.average) * 100}
                    icon={Brain}
                    color="bg-orange-500"
                    goal={metrics.stressLevel.goal}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartWidget 
              title="Activity Trends" 
              data={chartData} 
              dataKey="steps" 
              color="#3B82F6" 
            />
          </div>
          <div>
            <InsightsWidget insights={insights} />
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <ChartWidget 
            title="Sleep Patterns" 
            data={chartData} 
            dataKey="sleep" 
            color="#8B5CF6" 
          />
          <ChartWidget 
            title="Heart Rate Variability" 
            data={chartData} 
            dataKey="heartRate" 
            color="#EF4444" 
          />
          <ChartWidget 
            title="Weight Fluctuation" 
            data={chartData} 
            dataKey="weight" 
            color="#10B981" 
          />
          <ChartWidget 
            title="Stress Levels" 
            data={chartData} 
            dataKey="stressLevel" 
            color="#F59E0B" 
          />
        </div>

        {/* Goals and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalsWidget />
          <RecommendationsWidget recommendations={recommendations} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={() => setHealthData(generateSampleData())} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </main>
    </div>
  );
};

export default EnhancedHealthDashboard;