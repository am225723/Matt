import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, BarChart3, Heart, Brain, Clock, Zap, Users, Home } from 'lucide-react';

const EnhancedAnxietyVisualizations = ({ entries }) => {
  const [timeRange, setTimeRange] = useState('30');
  const [activeView, setActiveView] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('frequency');
  const [hoveredData, setHoveredData] = useState(null);

  // Enhanced data processing with memoization
  const processedData = useMemo(() => {
    if (!entries || entries.length === 0) return null;

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000);
    
    const filteredEntries = entries.filter(entry => 
      new Date(entry.timestamp) >= cutoffDate
    );

    // Advanced analytics
    const analytics = {
      totalEntries: filteredEntries.length,
      dailyAverage: filteredEntries.length / Math.min(parseInt(timeRange), filteredEntries.length || 1),
      
      // Time-based patterns
      timePatterns: analyzeTimePatterns(filteredEntries),
      
      // Body part analysis
      bodyPartAnalysis: analyzeBodyParts(filteredEntries),
      
      // Sensation trends
      sensationTrends: analyzeSensationTrends(filteredEntries),
      
      // Activity correlations
      activityInsights: analyzeActivityInsights(filteredEntries),
      
      // Relief effectiveness
      reliefEffectiveness: analyzeReliefMethods(filteredEntries),
      
      // Weekly patterns
      weeklyPatterns: analyzeWeeklyPatterns(filteredEntries),
      
      // Severity scoring (based on number of symptoms)
      severityTrends: analyzeSeverityTrends(filteredEntries)
    };

    return analytics;
  }, [entries, timeRange]);

  // Advanced analysis functions
  const analyzeTimePatterns = (entries) => {
    const hours = Array(24).fill(0);
    const days = Array(7).fill(0);
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      hours[date.getHours()] += 1;
      days[date.getDay()] += 1;
    });

    const peakHours = hours.map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const peakDays = days.map((count, day) => ({ 
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day], 
      count 
    })).sort((a, b) => b.count - a.count);

    return { hours, peakHours, peakDays };
  };

  const analyzeBodyParts = (entries) => {
    const partCounts = {};
    const partSensationMap = {};
    
    entries.forEach(entry => {
      entry.bodyParts.forEach(part => {
        partCounts[part] = (partCounts[part] || 0) + 1;
        
        if (!partSensationMap[part]) {
          partSensationMap[part] = {};
        }
        
        entry.sensations.forEach(sensation => {
          partSensationMap[part][sensation] = (partSensationMap[part][sensation] || 0) + 1;
        });
      });
    });

    const topParts = Object.entries(partCounts)
      .map(([part, count]) => ({ part, count, percentage: (count / entries.length * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count);

    return { partCounts, topParts, partSensationMap };
  };

  const analyzeSensationTrends = (entries) => {
    const sensationCounts = {};
    const sensationIntensity = {};
    
    entries.forEach(entry => {
      entry.sensations.forEach(sensation => {
        sensationCounts[sensation] = (sensationCounts[sensation] || 0) + 1;
        sensationIntensity[sensation] = (sensationIntensity[sensation] || 0) + entry.sensations.length;
      });
    });

    return Object.entries(sensationCounts)
      .map(([sensation, count]) => ({
        sensation,
        count,
        intensity: (sensationIntensity[sensation] / count).toFixed(1),
        frequency: (count / entries.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const analyzeActivityInsights = (entries) => {
    const activityData = {};
    
    entries.forEach(entry => {
      entry.activities.forEach(activity => {
        if (!activityData[activity]) {
          activityData[activity] = {
            count: 0,
            bodyParts: {},
            sensations: {},
            reliefMethods: {}
          };
        }
        
        activityData[activity].count += 1;
        
        entry.bodyParts.forEach(part => {
          activityData[activity].bodyParts[part] = (activityData[activity].bodyParts[part] || 0) + 1;
        });
        
        entry.sensations.forEach(sensation => {
          activityData[activity].sensations[sensation] = (activityData[activity].sensations[sensation] || 0) + 1;
        });
        
        entry.reliefMethods.forEach(method => {
          activityData[activity].reliefMethods[method] = (activityData[activity].reliefMethods[method] || 0) + 1;
        });
      });
    });

    return Object.entries(activityData)
      .map(([activity, data]) => ({
        activity,
        ...data,
        topBodyPart: Object.entries(data.bodyParts).sort((a, b) => b[1] - a[1])[0]?.[0],
        topSensation: Object.entries(data.sensations).sort((a, b) => b[1] - a[1])[0]?.[0],
        topRelief: Object.entries(data.reliefMethods).sort((a, b) => b[1] - a[1])[0]?.[0]
      }))
      .sort((a, b) => b.count - a.count);
  };

  const analyzeReliefMethods = (entries) => {
    const reliefCounts = {};
    
    entries.forEach(entry => {
      entry.reliefMethods.forEach(method => {
        reliefCounts[method] = (reliefCounts[method] || 0) + 1;
      });
    });

    return Object.entries(reliefCounts)
      .map(([method, count]) => ({
        method,
        count,
        effectiveness: (count / entries.filter(e => e.reliefMethods.length > 0).length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const analyzeWeeklyPatterns = (entries) => {
    const weeklyData = {};
    const now = new Date();
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const weekDiff = Math.floor((now - date) / (7 * 24 * 60 * 60 * 1000));
      
      if (!weeklyData[weekDiff]) {
        weeklyData[weekDiff] = { count: 0, bodyParts: {}, sensations: {} };
      }
      
      weeklyData[weekDiff].count += 1;
      
      entry.bodyParts.forEach(part => {
        weeklyData[weekDiff].bodyParts[part] = (weeklyData[weekDiff].bodyParts[part] || 0) + 1;
      });
      
      entry.sensations.forEach(sensation => {
        weeklyData[weekDiff].sensations[sensation] = (weeklyData[weekDiff].sensations[sensation] || 0) + 1;
      });
    });

    return Object.entries(weeklyData)
      .map(([week, data]) => ({
        week: parseInt(week),
        label: week === '0' ? 'This Week' : `${week} weeks ago`,
        ...data
      }))
      .sort((a, b) => a.week - b.week);
  };

  const analyzeSeverityTrends = (entries) => {
    return entries.map((entry, index) => ({
      date: new Date(entry.timestamp),
      severity: entry.sensations.length + entry.bodyParts.length,
      bodyPartCount: entry.bodyParts.length,
      sensationCount: entry.sensations.length
    }));
  };

  // Enhanced UI Components
  const OverviewMetrics = () => {
    if (!processedData) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<BarChart3 className="w-5 h-5" />}
          title="Total Entries"
          value={processedData.totalEntries}
          trend={processedData.dailyAverage.toFixed(1) + "/day"}
          color="blue"
        />
        <MetricCard
          icon={<Heart className="w-5 h-5" />}
          title="Most Affected"
          value={processedData.bodyPartAnalysis.topParts[0]?.part || "N/A"}
          trend={processedData.bodyPartAnalysis.topParts[0]?.count + " times"}
          color="red"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          title="Peak Time"
          value={processedData.timePatterns.peakHours[0]?.hour + ":00" || "N/A"}
          trend={processedData.timePatterns.peakHours[0]?.count + " entries"}
          color="green"
        />
        <MetricCard
          icon={<Zap className="w-5 h-5" />}
          title="Top Activity"
          value={processedData.activityInsights[0]?.activity || "N/A"}
          trend={processedData.activityInsights[0]?.count + " times"}
          color="purple"
        />
      </div>
    );
  };

  const MetricCard = ({ icon, title, value, trend, color }) => (
    <Card className={`p-4 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{trend}</p>
      </div>
    </Card>
  );

  const BodyPartHeatmap = () => {
    if (!processedData) return null;

    const maxCount = Math.max(...Object.values(processedData.bodyPartAnalysis.partCounts));
    
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Body Part Heatmap</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {processedData.bodyPartAnalysis.topParts.slice(0, 6).map(({ part, count, percentage }) => (
            <div key={part} className="relative">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium">{part}</span>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
              <div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const TimePatternChart = () => {
    if (!processedData) return null;

    const { hours, peakHours } = processedData.timePatterns;

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Patterns</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Hourly Distribution</h4>
            <div className="flex space-x-1 h-20 items-end">
              {hours.map((count, hour) => (
                <div key={hour} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(count / Math.max(...hours)) * 100}%` }}
                    title={`${hour}:00 - ${count} entries`}
                  />
                  <span className="text-xs text-gray-600 mt-1">{hour}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Peak Hours</h4>
            <div className="flex space-x-2">
              {peakHours.map(({ hour, count }) => (
                <Badge key={hour} variant="secondary">
                  {hour}:00 ({count})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const ActivityInsights = () => {
    if (!processedData) return null;

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Insights</h3>
        <div className="space-y-3">
          {processedData.activityInsights.slice(0, 5).map((activity, index) => (
            <div key={activity.activity} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{activity.activity}</span>
                </div>
                <Badge variant="outline">{activity.count} times</Badge>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <div>Top body part: {activity.topBodyPart || 'N/A'}</div>
                <div>Main sensation: {activity.topSensation || 'N/A'}</div>
                <div>Best relief: {activity.topRelief || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const WeeklyTrendChart = () => {
    if (!processedData) return null;

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Trends</h3>
        <div className="space-y-4">
          {processedData.weeklyPatterns.slice(-4).map((week) => (
            <div key={week.week} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium">{week.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((week.count / 5) * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-medium">{week.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const ReliefMethods = () => {
    if (!processedData) return null;

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Most Effective Relief Methods</h3>
        <div className="space-y-3">
          {processedData.reliefEffectiveness.slice(0, 5).map(({ method, count, effectiveness }) => (
            <div key={method} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{method}</div>
                <div className="text-sm text-gray-600">Used {count} times</div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {effectiveness}% effective
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const InsightsPanel = () => {
    if (!processedData) return null;

    const insights = [
      {
        icon: <Clock className="w-4 h-4" />,
        title: "Timing Patterns",
        description: `You tend to experience anxiety most during ${processedData.timePatterns.peakHours[0]?.hour}:00 hours.`
      },
      {
        icon: <Users className="w-4 h-4" />,
        title: "Activity Trigger",
        description: `${processedData.activityInsights[0]?.activity} is your most common anxiety trigger.`
      },
      {
        icon: <Heart className="w-4 h-4" />,
        title: "Body Focus",
        description: `${processedData.bodyPartAnalysis.topParts[0]?.part} is your most affected area.`
      }
    ];

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                {insight.icon}
              </div>
              <div>
                <div className="font-medium">{insight.title}</div>
                <div className="text-sm text-gray-600">{insight.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  if (!processedData) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-gray-600">
            Start tracking your anxiety to see personalized insights and visualizations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Anxiety Analytics</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview metrics */}
      <OverviewMetrics />

      {/* Main visualization grid */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="relief">Relief</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BodyPartHeatmap />
            <InsightsPanel />
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <TimePatternChart />
          <WeeklyTrendChart />
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <ActivityInsights />
        </TabsContent>

        <TabsContent value="relief" className="space-y-6">
          <ReliefMethods />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnxietyVisualizations;