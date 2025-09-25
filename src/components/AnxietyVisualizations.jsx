import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import BodyMapSVG from './BodyMapSVG';

const AnxietyVisualizations = ({ entries }) => {
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'
  const [bodyPartFrequency, setBodyPartFrequency] = useState({});
  const [sensationFrequency, setSensationFrequency] = useState({});
  const [activityCorrelation, setActivityCorrelation] = useState({});
  const [calendarData, setCalendarData] = useState([]);
  const [insights, setInsights] = useState([]);

  // Calculate data for visualizations based on entries and time range
  useEffect(() => {
    if (!entries || entries.length === 0) return;

    // Filter entries based on time range
    const now = new Date();
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const diffDays = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));
      
      if (timeRange === 'week') return diffDays <= 7;
      if (timeRange === 'month') return diffDays <= 30;
      if (timeRange === 'year') return diffDays <= 365;
      return true;
    });

    // Calculate body part frequency
    const bodyParts = {};
    filteredEntries.forEach(entry => {
      entry.bodyParts.forEach(part => {
        bodyParts[part] = (bodyParts[part] || 0) + 1;
      });
    });
    setBodyPartFrequency(bodyParts);

    // Calculate sensation frequency
    const sensations = {};
    filteredEntries.forEach(entry => {
      entry.sensations.forEach(sensation => {
        sensations[sensation] = (sensations[sensation] || 0) + 1;
      });
    });
    setSensationFrequency(sensations);

    // Calculate activity correlation
    const activities = {};
    filteredEntries.forEach(entry => {
      entry.activities.forEach(activity => {
        if (!activities[activity]) {
          activities[activity] = {
            count: 0,
            sensations: {},
            bodyParts: {}
          };
        }
        
        activities[activity].count += 1;
        
        entry.sensations.forEach(sensation => {
          activities[activity].sensations[sensation] = (activities[activity].sensations[sensation] || 0) + 1;
        });
        
        entry.bodyParts.forEach(part => {
          activities[activity].bodyParts[part] = (activities[activity].bodyParts[part] || 0) + 1;
        });
      });
    });
    setActivityCorrelation(activities);

    // Prepare calendar data
    const calendar = [];
    const dateMap = {};
    
    filteredEntries.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!dateMap[date]) {
        dateMap[date] = {
          date,
          count: 0,
          bodyParts: new Set(),
          sensations: new Set()
        };
      }
      
      dateMap[date].count += 1;
      entry.bodyParts.forEach(part => dateMap[date].bodyParts.add(part));
      entry.sensations.forEach(sensation => dateMap[date].sensations.add(sensation));
    });
    
    Object.values(dateMap).forEach(day => {
      calendar.push({
        ...day,
        bodyParts: Array.from(day.bodyParts),
        sensations: Array.from(day.sensations)
      });
    });
    
    setCalendarData(calendar);

    // Generate insights
    const newInsights = [];
    
    // Most common body part
    const mostCommonBodyPart = Object.entries(bodyParts)
      .sort((a, b) => b[1] - a[1])
      .shift();
    
    if (mostCommonBodyPart) {
      newInsights.push(`You most frequently experience anxiety in your ${mostCommonBodyPart[0].toLowerCase()} (${mostCommonBodyPart[1]} times).`);
    }
    
    // Most common sensation
    const mostCommonSensation = Object.entries(sensations)
      .sort((a, b) => b[1] - a[1])
      .shift();
    
    if (mostCommonSensation) {
      newInsights.push(`Your most common anxiety sensation is ${mostCommonSensation[0].toLowerCase()} (${mostCommonSensation[1]} times).`);
    }
    
    // Activity correlation
    const activityEntries = Object.entries(activities);
    if (activityEntries.length > 0) {
      const mostTriggeringActivity = activityEntries
        .sort((a, b) => b[1].count - a[1].count)
        .shift();
      
      if (mostTriggeringActivity) {
        newInsights.push(`Anxiety occurs most often when you're ${mostTriggeringActivity[0].toLowerCase()} (${mostTriggeringActivity[1].count} times).`);
      }
    }
    
    // Time pattern
    const timePatterns = {};
    filteredEntries.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      const timeOfDay = 
        hour >= 5 && hour < 12 ? 'morning' :
        hour >= 12 && hour < 17 ? 'afternoon' :
        hour >= 17 && hour < 21 ? 'evening' : 'night';
      
      timePatterns[timeOfDay] = (timePatterns[timeOfDay] || 0) + 1;
    });
    
    const mostCommonTime = Object.entries(timePatterns)
      .sort((a, b) => b[1] - a[1])
      .shift();
    
    if (mostCommonTime) {
      newInsights.push(`You tend to experience anxiety most often in the ${mostCommonTime[0]} (${mostCommonTime[1]} times).`);
    }
    
    // Relief methods
    const reliefMethods = {};
    filteredEntries.forEach(entry => {
      if (entry.reliefMethods && entry.reliefMethods.length > 0) {
        entry.reliefMethods.forEach(method => {
          reliefMethods[method] = (reliefMethods[method] || 0) + 1;
        });
      }
    });
    
    const mostEffectiveRelief = Object.entries(reliefMethods)
      .sort((a, b) => b[1] - a[1])
      .shift();
    
    if (mostEffectiveRelief) {
      newInsights.push(`"${mostEffectiveRelief[0]}" seems to be your most used relief method (${mostEffectiveRelief[1]} times).`);
    }
    
    setInsights(newInsights);
    
  }, [entries, timeRange]);

  // Get the top body parts for heatmap
  const getTopBodyParts = () => {
    return Object.keys(bodyPartFrequency)
      .sort((a, b) => bodyPartFrequency[b] - bodyPartFrequency[a])
      .slice(0, 5);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Data Visualization & Insights</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === 'year' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Personal Heatmap */}
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-4">Personal Heatmap</h4>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2">
            <BodyMapSVG 
              selectedParts={getTopBodyParts()} 
              onPartClick={() => {}} // Read-only in this view
            />
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <h5 className="text-sm font-medium mb-2">Most Affected Areas:</h5>
            <ul className="space-y-2">
              {Object.entries(bodyPartFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([part, count]) => (
                  <li key={part} className="flex items-center justify-between">
                    <span>{part}</span>
                    <div className="flex items-center">
                      <div 
                        className="h-4 bg-blue-500 rounded"
                        style={{ 
                          width: `${Math.min(count * 20, 100)}px`,
                          opacity: 0.6 + (count / (Object.values(bodyPartFrequency).reduce((max, val) => Math.max(max, val), 0)) * 0.4)
                        }}
                      ></div>
                      <span className="ml-2 text-sm text-gray-500">{count} times</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Trend Graphs */}
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-4">Sensation & Activity Correlation</h4>
        <div className="space-y-6">
          {/* Top Sensations */}
          <div>
            <h5 className="text-sm font-medium mb-2">Top Sensations:</h5>
            <ul className="space-y-2">
              {Object.entries(sensationFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([sensation, count]) => (
                  <li key={sensation} className="flex items-center justify-between">
                    <span>{sensation}</span>
                    <div className="flex items-center">
                      <div 
                        className="h-4 bg-purple-500 rounded"
                        style={{ width: `${Math.min(count * 20, 100)}px` }}
                      ></div>
                      <span className="ml-2 text-sm text-gray-500">{count} times</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Activity Correlation */}
          <div>
            <h5 className="text-sm font-medium mb-2">Activity Correlation:</h5>
            <ul className="space-y-4">
              {Object.entries(activityCorrelation)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 3)
                .map(([activity, data]) => {
                  const topSensation = Object.entries(data.sensations)
                    .sort((a, b) => b[1] - a[1])
                    .shift();
                  
                  const topBodyPart = Object.entries(data.bodyParts)
                    .sort((a, b) => b[1] - a[1])
                    .shift();
                  
                  return (
                    <li key={activity} className="p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{activity} ({data.count} times)</div>
                      {topSensation && (
                        <div className="text-sm text-gray-600 mt-1">
                          Most common sensation: {topSensation[0]} ({topSensation[1]} times)
                        </div>
                      )}
                      {topBodyPart && (
                        <div className="text-sm text-gray-600">
                          Most affected area: {topBodyPart[0]} ({topBodyPart[1]} times)
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </Card>

      {/* Calendar View */}
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-4">Calendar View</h4>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Placeholder for calendar grid - would be dynamically generated in a full implementation */}
          {Array(35).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (35 - i));
            const dateStr = date.toLocaleDateString();
            const dayData = calendarData.find(d => d.date === dateStr);
            
            return (
              <div 
                key={i} 
                className={`aspect-square rounded-md flex items-center justify-center text-sm ${
                  dayData ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer' : 'bg-gray-50'
                }`}
                title={dayData ? `${dayData.count} entries on ${dateStr}` : ''}
              >
                {date.getDate()}
                {dayData && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI-Powered Insights */}
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-4">AI-Powered Insights</h4>
        {insights.length > 0 ? (
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            Add more entries to receive personalized insights about your anxiety patterns.
          </p>
        )}
      </Card>
    </div>
  );
};

export default AnxietyVisualizations;