// Analytics overview page - Fixed version with interactive chart
import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, Clock } from 'lucide-react';
import { useAnalyticsDashboard, useAnalyticsInsights } from '../hooks/useAnalytics';
import { useUrlFilters } from '../hooks/useNavigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { LineChart, AreaChart } from '../components/charts';
import HeatMap from '../components/charts/HeatMap';

// Fixed device traffic data with consistent structure
const deviceTrafficData = [
  { x: 'Q1 2023', y: 32000, sessions: 32000, users: 28500, desktop: 32000, mobile: 28000, tablet: 8500 },
  { x: 'Q2 2023', y: 34500, sessions: 34500, users: 31200, desktop: 34500, mobile: 32000, tablet: 9200 },
  { x: 'Q3 2023', y: 36000, sessions: 36000, users: 33800, desktop: 36000, mobile: 35500, tablet: 9800 },
  { x: 'Q4 2023', y: 38000, sessions: 38000, users: 36200, desktop: 38000, mobile: 39000, tablet: 10500 },
  { x: 'Q1 2024', y: 39500, sessions: 39500, users: 38100, desktop: 39500, mobile: 42500, tablet: 11200 },
  { x: 'Q2 2024', y: 41000, sessions: 41000, users: 39800, desktop: 41000, mobile: 46000, tablet: 12000 },
  { x: 'Q3 2024', y: 42500, sessions: 42500, users: 41200, desktop: 42500, mobile: 49500, tablet: 12800 },
  { x: 'Q4 2024', y: 44000, sessions: 44000, users: 42900, desktop: 44000, mobile: 53000, tablet: 13500 },
];

// Series configurations for different chart types
const sessionsDeviceSeries = [
  { key: 'mobile', name: 'Mobile Sessions', color: '#10b981', strokeWidth: 3 },
  { key: 'desktop', name: 'Desktop Sessions', color: '#3b82f6', strokeWidth: 3 },
  { key: 'tablet', name: 'Tablet Sessions', color: '#f59e0b', strokeWidth: 2 },
];

const usersDeviceSeries = [
  { key: 'users', name: 'Total Users', color: '#8b5cf6', strokeWidth: 3 },
];

// Static heatmap data for user activity (Hour vs Day of Week)
const heatmapData = [
  // Monday
  { x: 0, y: 'Monday', value: 12 }, { x: 1, y: 'Monday', value: 8 }, { x: 2, y: 'Monday', value: 5 }, { x: 3, y: 'Monday', value: 3 },
  { x: 4, y: 'Monday', value: 5 }, { x: 5, y: 'Monday', value: 15 }, { x: 6, y: 'Monday', value: 25 }, { x: 7, y: 'Monday', value: 45 },
  { x: 8, y: 'Monday', value: 65 }, { x: 9, y: 'Monday', value: 85 }, { x: 10, y: 'Monday', value: 92 }, { x: 11, y: 'Monday', value: 88 },
  { x: 12, y: 'Monday', value: 95 }, { x: 13, y: 'Monday', value: 98 }, { x: 14, y: 'Monday', value: 90 }, { x: 15, y: 'Monday', value: 85 },
  { x: 16, y: 'Monday', value: 80 }, { x: 17, y: 'Monday', value: 75 }, { x: 18, y: 'Monday', value: 60 }, { x: 19, y: 'Monday', value: 70 },
  { x: 20, y: 'Monday', value: 65 }, { x: 21, y: 'Monday', value: 45 }, { x: 22, y: 'Monday', value: 25 }, { x: 23, y: 'Monday', value: 15 },
  
  // Tuesday
  { x: 0, y: 'Tuesday', value: 10 }, { x: 1, y: 'Tuesday', value: 7 }, { x: 2, y: 'Tuesday', value: 4 }, { x: 3, y: 'Tuesday', value: 3 },
  { x: 4, y: 'Tuesday', value: 6 }, { x: 5, y: 'Tuesday', value: 18 }, { x: 6, y: 'Tuesday', value: 28 }, { x: 7, y: 'Tuesday', value: 48 },
  { x: 8, y: 'Tuesday', value: 68 }, { x: 9, y: 'Tuesday', value: 88 }, { x: 10, y: 'Tuesday', value: 95 }, { x: 11, y: 'Tuesday', value: 90 },
  { x: 12, y: 'Tuesday', value: 98 }, { x: 13, y: 'Tuesday', value: 100 }, { x: 14, y: 'Tuesday', value: 93 }, { x: 15, y: 'Tuesday', value: 88 },
  { x: 16, y: 'Tuesday', value: 83 }, { x: 17, y: 'Tuesday', value: 78 }, { x: 18, y: 'Tuesday', value: 62 }, { x: 19, y: 'Tuesday', value: 72 },
  { x: 20, y: 'Tuesday', value: 68 }, { x: 21, y: 'Tuesday', value: 48 }, { x: 22, y: 'Tuesday', value: 28 }, { x: 23, y: 'Tuesday', value: 18 },
  
  // Wednesday
  { x: 0, y: 'Wednesday', value: 11 }, { x: 1, y: 'Wednesday', value: 6 }, { x: 2, y: 'Wednesday', value: 4 }, { x: 3, y: 'Wednesday', value: 2 },
  { x: 4, y: 'Wednesday', value: 5 }, { x: 5, y: 'Wednesday', value: 16 }, { x: 6, y: 'Wednesday', value: 26 }, { x: 7, y: 'Wednesday', value: 46 },
  { x: 8, y: 'Wednesday', value: 66 }, { x: 9, y: 'Wednesday', value: 86 }, { x: 10, y: 'Wednesday', value: 93 }, { x: 11, y: 'Wednesday', value: 89 },
  { x: 12, y: 'Wednesday', value: 96 }, { x: 13, y: 'Wednesday', value: 99 }, { x: 14, y: 'Wednesday', value: 91 }, { x: 15, y: 'Wednesday', value: 86 },
  { x: 16, y: 'Wednesday', value: 81 }, { x: 17, y: 'Wednesday', value: 76 }, { x: 18, y: 'Wednesday', value: 61 }, { x: 19, y: 'Wednesday', value: 71 },
  { x: 20, y: 'Wednesday', value: 66 }, { x: 21, y: 'Wednesday', value: 46 }, { x: 22, y: 'Wednesday', value: 26 }, { x: 23, y: 'Wednesday', value: 16 },
  
  // Thursday
  { x: 0, y: 'Thursday', value: 9 }, { x: 1, y: 'Thursday', value: 5 }, { x: 2, y: 'Thursday', value: 3 }, { x: 3, y: 'Thursday', value: 2 },
  { x: 4, y: 'Thursday', value: 4 }, { x: 5, y: 'Thursday', value: 14 }, { x: 6, y: 'Thursday', value: 24 }, { x: 7, y: 'Thursday', value: 44 },
  { x: 8, y: 'Thursday', value: 64 }, { x: 9, y: 'Thursday', value: 84 }, { x: 10, y: 'Thursday', value: 91 }, { x: 11, y: 'Thursday', value: 87 },
  { x: 12, y: 'Thursday', value: 94 }, { x: 13, y: 'Thursday', value: 97 }, { x: 14, y: 'Thursday', value: 89 }, { x: 15, y: 'Thursday', value: 84 },
  { x: 16, y: 'Thursday', value: 79 }, { x: 17, y: 'Thursday', value: 74 }, { x: 18, y: 'Thursday', value: 59 }, { x: 19, y: 'Thursday', value: 69 },
  { x: 20, y: 'Thursday', value: 64 }, { x: 21, y: 'Thursday', value: 44 }, { x: 22, y: 'Thursday', value: 24 }, { x: 23, y: 'Thursday', value: 14 },
  
  // Friday
  { x: 0, y: 'Friday', value: 8 }, { x: 1, y: 'Friday', value: 4 }, { x: 2, y: 'Friday', value: 2 }, { x: 3, y: 'Friday', value: 1 },
  { x: 4, y: 'Friday', value: 3 }, { x: 5, y: 'Friday', value: 13 }, { x: 6, y: 'Friday', value: 23 }, { x: 7, y: 'Friday', value: 43 },
  { x: 8, y: 'Friday', value: 63 }, { x: 9, y: 'Friday', value: 83 }, { x: 10, y: 'Friday', value: 90 }, { x: 11, y: 'Friday', value: 86 },
  { x: 12, y: 'Friday', value: 93 }, { x: 13, y: 'Friday', value: 96 }, { x: 14, y: 'Friday', value: 88 }, { x: 15, y: 'Friday', value: 83 },
  { x: 16, y: 'Friday', value: 78 }, { x: 17, y: 'Friday', value: 73 }, { x: 18, y: 'Friday', value: 58 }, { x: 19, y: 'Friday', value: 75 },
  { x: 20, y: 'Friday', value: 80 }, { x: 21, y: 'Friday', value: 65 }, { x: 22, y: 'Friday', value: 45 }, { x: 23, y: 'Friday', value: 25 },
  
  // Saturday
  { x: 0, y: 'Saturday', value: 15 }, { x: 1, y: 'Saturday', value: 12 }, { x: 2, y: 'Saturday', value: 8 }, { x: 3, y: 'Saturday', value: 5 },
  { x: 4, y: 'Saturday', value: 7 }, { x: 5, y: 'Saturday', value: 10 }, { x: 6, y: 'Saturday', value: 15 }, { x: 7, y: 'Saturday', value: 20 },
  { x: 8, y: 'Saturday', value: 25 }, { x: 9, y: 'Saturday', value: 35 }, { x: 10, y: 'Saturday', value: 45 }, { x: 11, y: 'Saturday', value: 55 },
  { x: 12, y: 'Saturday', value: 65 }, { x: 13, y: 'Saturday', value: 70 }, { x: 14, y: 'Saturday', value: 68 }, { x: 15, y: 'Saturday', value: 65 },
  { x: 16, y: 'Saturday', value: 60 }, { x: 17, y: 'Saturday', value: 55 }, { x: 18, y: 'Saturday', value: 50 }, { x: 19, y: 'Saturday', value: 60 },
  { x: 20, y: 'Saturday', value: 70 }, { x: 21, y: 'Saturday', value: 65 }, { x: 22, y: 'Saturday', value: 50 }, { x: 23, y: 'Saturday', value: 35 },
  
  // Sunday
  { x: 0, y: 'Sunday', value: 20 }, { x: 1, y: 'Sunday', value: 18 }, { x: 2, y: 'Sunday', value: 15 }, { x: 3, y: 'Sunday', value: 12 },
  { x: 4, y: 'Sunday', value: 10 }, { x: 5, y: 'Sunday', value: 8 }, { x: 6, y: 'Sunday', value: 12 }, { x: 7, y: 'Sunday', value: 18 },
  { x: 8, y: 'Sunday', value: 22 }, { x: 9, y: 'Sunday', value: 30 }, { x: 10, y: 'Sunday', value: 40 }, { x: 11, y: 'Sunday', value: 50 },
  { x: 12, y: 'Sunday', value: 60 }, { x: 13, y: 'Sunday', value: 65 }, { x: 14, y: 'Sunday', value: 63 }, { x: 15, y: 'Sunday', value: 60 },
  { x: 16, y: 'Sunday', value: 55 }, { x: 17, y: 'Sunday', value: 50 }, { x: 18, y: 'Sunday', value: 45 }, { x: 19, y: 'Sunday', value: 55 },
  { x: 20, y: 'Sunday', value: 65 }, { x: 21, y: 'Sunday', value: 60 }, { x: 22, y: 'Sunday', value: 45 }, { x: 23, y: 'Sunday', value: 30 }
];

// Daily view data (aggregated by day over the past month)
const dailyHeatmapData = [
  // Week 1
  { x: 'Mon', y: 'Week 1', value: 85 }, { x: 'Tue', y: 'Week 1', value: 90 }, { x: 'Wed', y: 'Week 1', value: 88 }, 
  { x: 'Thu', y: 'Week 1', value: 92 }, { x: 'Fri', y: 'Week 1', value: 87 }, { x: 'Sat', y: 'Week 1', value: 65 }, { x: 'Sun', y: 'Week 1', value: 55 },
  
  // Week 2
  { x: 'Mon', y: 'Week 2', value: 88 }, { x: 'Tue', y: 'Week 2', value: 93 }, { x: 'Wed', y: 'Week 2', value: 90 }, 
  { x: 'Thu', y: 'Week 2', value: 95 }, { x: 'Fri', y: 'Week 2', value: 89 }, { x: 'Sat', y: 'Week 2', value: 68 }, { x: 'Sun', y: 'Week 2', value: 58 },
  
  // Week 3
  { x: 'Mon', y: 'Week 3', value: 82 }, { x: 'Tue', y: 'Week 3', value: 87 }, { x: 'Wed', y: 'Week 3', value: 85 }, 
  { x: 'Thu', y: 'Week 3', value: 90 }, { x: 'Fri', y: 'Week 3', value: 84 }, { x: 'Sat', y: 'Week 3', value: 62 }, { x: 'Sun', y: 'Week 3', value: 52 },
  
  // Week 4
  { x: 'Mon', y: 'Week 4', value: 90 }, { x: 'Tue', y: 'Week 4', value: 95 }, { x: 'Wed', y: 'Week 4', value: 92 }, 
  { x: 'Thu', y: 'Week 4', value: 97 }, { x: 'Fri', y: 'Week 4', value: 91 }, { x: 'Sat', y: 'Week 4', value: 70 }, { x: 'Sun', y: 'Week 4', value: 60 }
];

const OverviewPage = () => {
  const { filters } = useUrlFilters();
  const [activeChart, setActiveChart] = useState('sessions'); // State for chart toggle
  const [heatmapView, setHeatmapView] = useState('hourly'); // State for heatmap view
  
  // Get current heatmap data based on view
  const currentHeatmapData = heatmapView === 'hourly' ? heatmapData : dailyHeatmapData;
  const currentHeatmapConfig = heatmapView === 'hourly' 
    ? { title: 'Activity by Hour and Day', width: 800, height: 350 }
    : { title: 'Activity by Day and Week', width: 600, height: 300 };
  
  const {
    overview,
    traffic,
    funnel,
    behavior,
    pages,
    isLoading,
    isError
  } = useAnalyticsDashboard(filters.timeframe, filters);

  const insights = useAnalyticsInsights(filters.timeframe);

  if (isLoading) {
    return <LoadingSpinner text="Loading analytics overview..." />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Sessions',
      value: overview.data?.totalSessions.toLocaleString() || '0',
      change: '+18.2%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Page Views',
      value: overview.data?.pageViews.toLocaleString() || '0',
      change: '+12.8%',
      trend: 'up',
      icon: Eye
    },
    {
      title: 'Bounce Rate',
      value: `${overview.data?.bounceRate || 0}%`,
      change: '-3.2%',
      trend: 'down', // Lower bounce rate is good
      icon: MousePointer
    },
    {
      title: 'Avg Session Duration',
      value: overview.data?.avgSessionDuration || '0m 0s',
      change: '+8.5%',
      trend: 'up',
      icon: Clock
    }
  ];

  // Get chart data and config based on active chart
  const currentChartData = deviceTrafficData;
  const currentSeries = activeChart === 'sessions' ? sessionsDeviceSeries : usersDeviceSeries;
  const currentTitle = activeChart === 'sessions' ? 'Device-Based Session Trends' : 'User Traffic Trends';
  const currentYAxisLabel = activeChart === 'sessions' ? 'Sessions' : 'Users';

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white rounded-lg">
                <metric.icon className="w-5 h-5 text-indigo-600" />
              </div>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            <div className="text-sm text-gray-600 mb-1">{metric.title}</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
            
            <div className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 
              metric.title === 'Bounce Rate' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change} vs previous period
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Trends with Toggle */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Trends</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveChart('sessions')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  activeChart === 'sessions' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Sessions
              </button>
              <button 
                onClick={() => setActiveChart('users')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  activeChart === 'users' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Users
              </button>
            </div>
          </div>
          
          {traffic.isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="h-80">
              <LineChart 
                data={currentChartData}
                series={currentSeries}
                title={currentTitle}
                xKey="x"
                xAxisLabel="Quarter"
                yAxisLabel={currentYAxisLabel}
                width="100%"
                height={320}
                showGrid={true}
                showLegend={true}
                showDots={true}
                responsive={true}
              />
            </div>
          )}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700">Optimize →</button>
          </div>
          
          {funnel.isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="space-y-4">
              {funnel.data?.funnel?.slice(0, 4).map((step, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{step.step}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {step.visitors.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )) || []}
            </div>
          )}
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Landing Pages */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Landing Pages</h3>
          
          {pages.isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 pb-2 border-b border-gray-200">
                <div>Page</div>
                <div>Sessions</div>
                <div>Bounce Rate</div>
                <div>Conversions</div>
              </div>
              
              {pages.data?.slice(0, 5).map((page, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-3 text-sm">
                  <div className="font-medium text-gray-900 truncate">{page.title}</div>
                  <div className="text-gray-600">{page.sessions.toLocaleString()}</div>
                  <div className="text-gray-600">{page.bounceRate}%</div>
                  <div className="text-gray-900 font-medium">{page.conversions}</div>
                </div>
              )) || []}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">🧠 AI-Powered Insights</h3>
          
          {insights.isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="space-y-4">
              {insights.data?.slice(0, 3).map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )) || []}
            </div>
          )}
        </div>
      </div>

      {/* User Behavior Heatmap */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">User Activity Heatmap</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setHeatmapView('hourly')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                heatmapView === 'hourly' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hourly
            </button>
            <button 
              onClick={() => setHeatmapView('daily')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                heatmapView === 'daily' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Daily
            </button>
          </div>
        </div>
        
        {behavior.isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <HeatMap 
              data={currentHeatmapData}
              width={currentHeatmapConfig.width}
              height={currentHeatmapConfig.height}
              title={currentHeatmapConfig.title}
              margin={{ top: 50, right: 140, bottom: 80, left: 120 }}
            />
          </div>
        )}
      </div>

      {/* Device Breakdown */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
        
        {behavior.isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {behavior.data?.deviceBreakdown?.map((device, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  device.device === 'Desktop' ? 'bg-blue-100 text-blue-600' :
                  device.device === 'Mobile' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <div className="text-2xl">
                    {device.device === 'Desktop' ? '🖥️' : 
                     device.device === 'Mobile' ? '📱' : '📱'}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {device.percentage}%
                </div>
                <div className="text-sm text-gray-600 mb-1">{device.device}</div>
                <div className="text-xs text-gray-500">
                  {device.sessions.toLocaleString()} sessions
                </div>
              </div>
            )) || []}
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">📊 Analytics Summary</h3>
            <p className="text-indigo-100 mb-4">
              Your analytics show strong performance with room for optimization
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-indigo-200">Sessions</div>
                <div className="text-lg font-bold">
                  {overview.data?.totalSessions.toLocaleString() || '0'}
                </div>
              </div>
              <div>
                <div className="text-sm text-indigo-200">Page Views</div>
                <div className="text-lg font-bold">
                  {overview.data?.pageViews.toLocaleString() || '0'}
                </div>
              </div>
              <div>
                <div className="text-sm text-indigo-200">Bounce Rate</div>
                <div className="text-lg font-bold">
                  {overview.data?.bounceRate || 0}%
                </div>
              </div>
              <div>
                <div className="text-sm text-indigo-200">Avg Duration</div>
                <div className="text-lg font-bold">
                  {overview.data?.avgSessionDuration || '0m 0s'}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <button className="px-6 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors font-medium">
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;