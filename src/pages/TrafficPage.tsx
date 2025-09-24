// Traffic analytics page
import { Globe, TrendingUp, Users, Eye } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTrafficAnalytics } from '../hooks/useAnalytics';
import { useUrlFilters } from '../hooks/useNavigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import MultiSeriesLineChart from '../components/charts/MultiSeriesLineChart';

const TrafficPage = () => {
  const { filters } = useUrlFilters();
  const { data, isLoading, isError } = useTrafficAnalytics(filters.timeframe, filters);
  const [activeTab, setActiveTab] = useState('sessions');
  const [chartWidth, setChartWidth] = useState(800);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Handle responsive chart width
  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        setChartWidth(Math.max(600, containerWidth - 40)); // 40px for padding
      }
    };

    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);
    return () => window.removeEventListener('resize', updateChartWidth);
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading traffic analytics..." />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load traffic data</p>
      </div>
    );
  }

  // Safely extract and validate traffic data
  const rawTrafficData = data?.traffic || [];
  const trafficData = Array.isArray(rawTrafficData) ? rawTrafficData : [];
  
  // Create mock data if no real data exists (for demo purposes)
  const mockData = [
    { day: '2024-01-01', sessions: 1250, users: 980, pageViews: 3200, bounceRate: 42.5 },
    { day: '2024-01-02', sessions: 1380, users: 1020, pageViews: 3450, bounceRate: 38.2 },
    { day: '2024-01-03', sessions: 1150, users: 890, pageViews: 2980, bounceRate: 44.1 },
    { day: '2024-01-04', sessions: 1420, users: 1100, pageViews: 3680, bounceRate: 35.8 },
    { day: '2024-01-05', sessions: 1320, users: 1050, pageViews: 3520, bounceRate: 40.3 },
    { day: '2024-01-06', sessions: 1180, users: 920, pageViews: 3100, bounceRate: 43.7 },
    { day: '2024-01-07', sessions: 1480, users: 1180, pageViews: 3850, bounceRate: 32.9 }
  ];
  
  // Use real data if available, otherwise use mock data
  const chartData = trafficData.length > 0 ? trafficData : mockData;
  
  // Safe calculations with fallbacks
  const totalSessions = chartData.reduce((sum, item) => sum + (item.sessions || 0), 0);
  const totalUsers = chartData.reduce((sum, item) => sum + (item.users || 0), 0);
  const avgBounceRate = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + (item.bounceRate || 0), 0) / chartData.length 
    : 0;

  // Prepare chart data based on active tab
  const getChartData = () => {
    try {
      // Transform data to match DataPoint interface
      const transformedData = chartData.map(item => ({
        ...item, // spread first to get all properties
        sessions: item.sessions || 0,
        users: item.users || 0,
        pageViews: item.pageViews || 0,
        bounceRate: item.bounceRate || 0
      }));

      switch (activeTab) {
        case 'sessions':
          return {
            data: transformedData,
            series: [{
              key: 'sessions',
              name: 'Sessions',
              color: '#3B82F6'
            }],
            yAxisLabel: 'Sessions'
          };
        case 'users':
          return {
            data: transformedData,
            series: [{
              key: 'users',
              name: 'Users',
              color: '#10B981'
            }],
            yAxisLabel: 'Users'
          };
        case 'pageviews':
          return {
            data: transformedData,
            series: [{
              key: 'pageViews',
              name: 'Page Views',
              color: '#8B5CF6'
            }],
            yAxisLabel: 'Page Views'
          };
        default:
          return {
            data: transformedData,
            series: [
              { key: 'sessions', name: 'Sessions', color: '#3B82F6' },
              { key: 'users', name: 'Users', color: '#10B981' },
              { key: 'pageViews', name: 'Page Views', color: '#8B5CF6' }
            ],
            yAxisLabel: 'Count'
          };
      }
    } catch (error) {
      console.error('Error in getChartData:', error);
      return {
        data: [],
        series: [{ key: 'sessions', name: 'Sessions', color: '#3B82F6' }],
        yAxisLabel: 'Value'
      };
    }
  };

  const chartConfig = getChartData();

  const tabs = [
    { id: 'sessions', label: 'Sessions', color: 'indigo' },
    { id: 'users', label: 'Users', color: 'green' },
    { id: 'pageviews', label: 'Page Views', color: 'purple' }
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalSessions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Unique Users</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Globe className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {avgBounceRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Avg Bounce Rate</div>
        </div>
      </div>

      {/* Traffic Trends Chart */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Traffic Over Time</h3>
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-100 text-${tab.color}-700`
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Actual Chart Component */}
        <div ref={chartContainerRef} className="w-full">
          {/* Debug Info - Remove this after fixing */}
          {/* <div className="text-xs text-gray-500 mb-2">
            Debug: Data length: {chartConfig.data?.length || 0}, Series: {chartConfig.series?.length || 0}, Width: {chartWidth}
          </div> */}
          
          <div className="w-full" style={{ minHeight: '420px' }}>
            <MultiSeriesLineChart
              data={chartConfig.data || []}
              series={chartConfig.series || []}
              xKey="day"
              width={chartWidth}
              height={400}
              title=""
              xAxisLabel="Date"
              yAxisLabel={chartConfig.yAxisLabel || "Value"}
              showGrid={true}
              showLegend={chartConfig.series.length > 1}
              margin={{ top: 30, right: 100, bottom: 80, left: 80 }}
            />
          </div>
        </div>
      </div>

      {/* Traffic Sources Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          
          <div className="space-y-4">
            {[
              { source: 'Organic Search', sessions: 45123, percentage: 45.2, change: '+12.3%', color: 'bg-blue-500' },
              { source: 'Direct', sessions: 25067, percentage: 25.1, change: '+8.7%', color: 'bg-green-500' },
              { source: 'Social Media', sessions: 18945, percentage: 19.0, change: '+15.2%', color: 'bg-purple-500' },
              { source: 'Email', sessions: 10865, percentage: 10.9, change: '+5.4%', color: 'bg-yellow-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.source}</div>
                    <div className="text-xs text-gray-500">{item.sessions.toLocaleString()} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.percentage}%</div>
                  <div className="text-xs text-green-600">{item.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Countries</h3>
          
          <div className="space-y-4">
            {[
              { country: 'United States', flag: '🇺🇸', sessions: 45230, percentage: 35.2 },
              { country: 'United Kingdom', flag: '🇬🇧', sessions: 23150, percentage: 18.0 },
              { country: 'Germany', flag: '🇩🇪', sessions: 18940, percentage: 14.7 },
              { country: 'Canada', flag: '🇨🇦', sessions: 15670, percentage: 12.2 },
              { country: 'France', flag: '🇫🇷', sessions: 12840, percentage: 10.0 },
              { country: 'Other', flag: '🌍', sessions: 12770, percentage: 9.9 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-3">{item.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.country}</div>
                    <div className="text-xs text-gray-500">{item.sessions.toLocaleString()} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.percentage}%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Traffic Table */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Details</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Period</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Sessions</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Users</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Page Views</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Bounce Rate</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Avg Duration</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{item.day}</td>
                  <td className="py-3 text-sm text-gray-600">{(item.sessions || 0).toLocaleString()}</td>
                  <td className="py-3 text-sm text-gray-600">{(item.users || 0).toLocaleString()}</td>
                  <td className="py-3 text-sm text-gray-600">{(item.pageViews || 0).toLocaleString()}</td>
                  <td className="py-3 text-sm text-gray-600">{item.bounceRate || 0}%</td>
                  <td className="py-3 text-sm text-gray-600">3m 24s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrafficPage;