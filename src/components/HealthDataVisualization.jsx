import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Area, Pie, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, AreaElement, ArcElement, RadialLinearScale, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, Activity, Heart, Brain, Weight } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  AreaElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

const HealthDataVisualization = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('steps');
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('30d');

  // Process data for visualization
  const processedData = useMemo(() => {
    const days = parseInt(timeRange.replace('d', ''));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return data.filter(d => new Date(d.date) >= cutoffDate).map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      steps: d.steps,
      sleep: d.sleep,
      heartRate: d.heartRate,
      weight: d.weight,
      stressLevel: d.stressLevel,
      calories: d.calories,
      exerciseMinutes: d.exerciseMinutes,
    }));
  }, [data, timeRange]);

  // Chart configurations
  const chartConfigs = {
    steps: {
      label: 'Daily Steps',
      color: '#3B82F6',
      unit: 'steps',
      icon: Activity,
    },
    sleep: {
      label: 'Sleep Hours',
      color: '#8B5CF6',
      unit: 'hours',
      icon: Calendar,
    },
    heartRate: {
      label: 'Heart Rate',
      color: '#EF4444',
      unit: 'bpm',
      icon: Heart,
    },
    weight: {
      label: 'Weight',
      color: '#10B981',
      unit: 'lbs',
      icon: Weight,
    },
    stressLevel: {
      label: 'Stress Level',
      color: '#F59E0B',
      unit: '/10',
      icon: Brain,
    },
    calories: {
      label: 'Calories Burned',
      color: '#F97316',
      unit: 'kcal',
      icon: TrendingUp,
    },
  };

  // Generate chart data
  const generateChartData = (metric, type) => {
    const config = chartConfigs[metric];
    const values = processedData.map(d => d[metric]);
    const labels = processedData.map(d => d.date);

    switch (type) {
      case 'line':
        return {
          labels,
          datasets: [{
            label: config.label,
            data: values,
            borderColor: config.color,
            backgroundColor: config.color + '20',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: config.color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
          }]
        };
      
      case 'bar':
        return {
          labels,
          datasets: [{
            label: config.label,
            data: values,
            backgroundColor: config.color + '80',
            borderColor: config.color,
            borderWidth: 1,
            borderRadius: 4,
          }]
        };
      
      case 'area':
        return {
          labels,
          datasets: [{
            label: config.label,
            data: values,
            borderColor: config.color,
            backgroundColor: config.color + '40',
            fill: true,
            tension: 0.4,
          }]
        };
      
      default:
        return { labels, datasets: [{ label: config.label, data: values }] };
    }
  };

  // Generate comparison data
  const comparisonData = useMemo(() => {
    if (processedData.length < 7) return null;
    
    const latestWeek = processedData.slice(-7);
    const previousWeek = processedData.slice(-14, -7);
    
    const metrics = ['steps', 'sleep', 'heartRate', 'weight', 'stressLevel'];
    
    return metrics.map(metric => ({
      metric: chartConfigs[metric].label,
      current: latestWeek.reduce((sum, d) => sum + d[metric], 0) / latestWeek.length,
      previous: previousWeek.reduce((sum, d) => sum + d[metric], 0) / previousWeek.length,
      change: ((latestWeek.reduce((sum, d) => sum + d[metric], 0) / latestWeek.length - 
               previousWeek.reduce((sum, d) => sum + d[metric], 0) / previousWeek.length) / 
               (previousWeek.reduce((sum, d) => sum + d[metric], 0) / previousWeek.length)) * 100,
      color: chartConfigs[metric].color,
    }));
  }, [processedData]);

  // Generate correlation matrix
  const correlationMatrix = useMemo(() => {
    const metrics = ['steps', 'sleep', 'heartRate', 'weight', 'stressLevel', 'calories'];
    const matrix = [];
    
    for (let i = 0; i < metrics.length; i++) {
      const row = [];
      for (let j = 0; j < metrics.length; j++) {
        if (i === j) {
          row.push(1);
        } else {
          const values1 = processedData.map(d => d[metrics[i]]);
          const values2 = processedData.map(d => d[metrics[j]]);
          const correlation = calculateCorrelation(values1, values2);
          row.push(correlation);
        }
      }
      matrix.push(row);
    }
    
    return matrix;
  }, [processedData]);

  // Calculate correlation coefficient
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Generate health score
  const healthScore = useMemo(() => {
    if (!processedData.length) return 0;
    
    const latest = processedData[processedData.length - 1];
    let score = 0;
    
    // Weighted scoring based on health metrics
    score += Math.min(100, (latest.steps / 10000) * 100) * 0.25;
    score += Math.min(100, (latest.sleep / 8) * 100) * 0.2;
    score += Math.min(100, ((80 - Math.abs(latest.heartRate - 70)) / 30) * 100) * 0.15;
    score += Math.min(100, ((10 - latest.stressLevel) / 10) * 100) * 0.2;
    score += Math.min(100, (latest.exerciseMinutes / 60) * 100) * 0.2;
    
    return Math.round(score);
  }, [processedData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Radar chart data for health profile
  const radarData = useMemo(() => {
    const latest = processedData[processedData.length - 1] || {};
    return {
      labels: ['Steps', 'Sleep', 'Heart Rate', 'Weight', 'Stress', 'Exercise'],
      datasets: [{
        label: 'Your Health',
        data: [
          Math.min(100, (latest.steps / 10000) * 100),
          Math.min(100, (latest.sleep / 8) * 100),
          Math.min(100, ((80 - Math.abs(latest.heartRate - 70)) / 30) * 100),
          Math.min(100, ((160 - Math.abs(latest.weight - 150)) / 20) * 100),
          Math.min(100, ((10 - latest.stressLevel) / 10) * 100),
          Math.min(100, (latest.exerciseMinutes / 60) * 100),
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }],
    };
  }, [processedData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Health Data Visualization</h1>
          <div className="flex space-x-4">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(chartConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
              </SelectContent>
            </Select>
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
          </div>
        </div>

        {/* Main Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{chartConfigs[selectedMetric].label} Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <canvas
                ref={(canvas) => {
                  if (canvas && processedData.length > 0) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      const config = {
                        type: chartType,
                        data: generateChartData(selectedMetric, chartType),
                        options: chartOptions,
                      };
                      new ChartJS(ctx, config);
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Health Score and Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">{healthScore}</div>
                <div className="text-lg text-gray-600">out of 100</div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Profile Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <canvas
                  ref={(canvas) => {
                    if (canvas && processedData.length > 0) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        new ChartJS(ctx, {
                          type: 'radar',
                          data: radarData,
                          options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              r: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                  display: false,
                                },
                              },
                            },
                          },
                        });
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Week-over-Week Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisonData?.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{item.metric}</h4>
                    <div 
                      className={`w-4 h-4 rounded-full`}
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Current: {item.current.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Previous: {item.previous.toFixed(1)}</p>
                    <p className={`text-sm font-semibold ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Analytics */}
        <Tabs defaultValue="correlations" className="w-full">
          <TabsList>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>
          <TabsContent value="correlations">
            <Card>
              <CardHeader>
                <CardTitle>Health Metric Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Metric</th>
                        {Object.keys(chartConfigs).map(key => (
                          <th key={key} className="text-left p-2 text-xs">{chartConfigs[key].label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(chartConfigs).map((rowKey, rowIndex) => (
                        <tr key={rowKey}>
                          <td className="p-2 font-semibold text-sm">{chartConfigs[rowKey].label}</td>
                          {correlationMatrix[rowIndex]?.map((value, colIndex) => (
                            <td key={colIndex} className="p-2 text-center">
                              <div 
                                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${value > 0.7 ? 'bg-green-200' : value > 0.3 ? 'bg-yellow-200' : 'bg-red-200'}`}
                              >
                                {value.toFixed(2)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Long-term Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Best Days</h4>
                    <div className="space-y-2">
                      {processedData
                        .sort((a, b) => b.steps - a.steps)
                        .slice(0, 3)
                        .map((day, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{day.date}</span>
                            <span>{day.steps.toLocaleString()} steps</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Improvement Areas</h4>
                    <div className="space-y-2">
                      {Object.entries(chartConfigs).map(([key, config]) => {
                        const values = processedData.map(d => d[key]);
                        const avg = values.reduce((a, b) => a + b, 0) / values.length;
                        const trend = values.length > 1 ? (values[values.length - 1] - values[0]) / values[0] * 100 : 0;
                        return (
                          <div key={key} className="flex justify-between text-sm">
                            <span>{config.label}</span>
                            <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
                              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>Health Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500">
                  <p>Advanced AI predictions coming soon...</p>
                  <p className="text-sm mt-2">Based on your current trends, we'll predict your health metrics for the next week.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthDataVisualization;