// User behavior analytics page
import { MousePointer, Eye, Clock, Smartphone } from 'lucide-react';
import { useUserBehavior } from '../hooks/useAnalytics';
import { useUrlFilters } from '../hooks/useNavigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Heatmap from '../components/charts/Heatmap';
import UserJourneySankey from '../components/charts/UserJourneySankey'; // Import the new component

const featureUsageData = [
    { x: 'Dashboard', y: 'New Users', value: 320 },
    { x: 'Dashboard', y: 'Regular Users', value: 850 },
    { x: 'Dashboard', y: 'Power Users', value: 950 },
    { x: 'Reports', y: 'New Users', value: 45 },
    { x: 'Reports', y: 'Regular Users', value: 380 },
    { x: 'Reports', y: 'Power Users', value: 920 },
    { x: 'Settings', y: 'New Users', value: 120 },
    { x: 'Settings', y: 'Regular Users', value: 290 },
    { x: 'Settings', y: 'Power Users', value: 580 },
    { x: 'Analytics', y: 'New Users', value: 25 },
    { x: 'Analytics', y: 'Regular Users', value: 180 },
    { x: 'Analytics', y: 'Power Users', value: 780 },
    { x: 'Export', y: 'New Users', value: 8 },
    { x: 'Export', y: 'Regular Users', value: 95 },
    { x: 'Export', y: 'Power Users', value: 450 },
    { x: 'API Access', y: 'New Users', value: 2 },
    { x: 'API Access', y: 'Regular Users', value: 15 },
    { x: 'API Access', y: 'Power Users', value: 280 },
];

const BehaviorPage = () => {
  const { filters } = useUrlFilters();
  const { data, isLoading, isError } = useUserBehavior(filters.timeframe, filters);

  if (isLoading) {
    return <LoadingSpinner text="Loading user behavior data..." />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Failed to load user behavior data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Device Breakdown */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Device Usage</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {data?.deviceBreakdown.map((device, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                device.device === 'Desktop' ? 'bg-blue-100' :
                device.device === 'Mobile' ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {device.device === 'Desktop' ? 
                  <div className="text-3xl">🖥️</div> : 
                  device.device === 'Mobile' ? 
                  <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" /> :
                  <div className="text-3xl">📱</div>
                }
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {device.percentage}%
              </div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{device.device}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {device.sessions.toLocaleString()} sessions
              </div>
            </div>
          )) || []}
        </div>
      </div>

      {/* User Activity Heatmap */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Feature Usage Heatmap</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-lg">By User Type</button>
            <button className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">By Time</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <Heatmap
            data={featureUsageData}
            title="Feature Usage by User Segment"
          />
        </div>
      </div>

      {/* Behavior Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">2.4</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pages per Session</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8.3% vs last period</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">3m 42s</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Session Duration</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12.1% vs last period</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <MousePointer className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">24.7%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">-3.2% vs last period</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">67.3%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Return Visitors</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+5.7% vs last period</div>
        </div>
      </div>

      {/* User Journey Flow - Now with Sankey Component */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">User Journey Flow</h3>

        {/* Use the UserJourneySankey component */}
        <div className="overflow-x-auto">
          <UserJourneySankey />
        </div>
      </div>

      {/* Engagement Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Engagement Patterns</h3>
          
          <div className="space-y-4">
            {[
              { pattern: 'Quick Browsers', percentage: 34, description: 'Short visits, high bounce rate', color: 'bg-red-500' },
              { pattern: 'Engaged Visitors', percentage: 42, description: 'Medium sessions, multiple pages', color: 'bg-blue-500' },
              { pattern: 'Deep Explorers', percentage: 18, description: 'Long sessions, high interaction', color: 'bg-green-500' },
              { pattern: 'Return Customers', percentage: 6, description: 'Frequent visits, high value', color: 'bg-purple-500' }
            ].map((pattern, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${pattern.color} rounded-full mr-3`}></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{pattern.pattern}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{pattern.description}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{pattern.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Popular Content</h3>
          
          <div className="space-y-4">
            {[
              { title: 'Getting Started Guide', views: 12453, engagement: 87 },
              { title: 'Product Documentation', views: 8934, engagement: 76 },
              { title: 'Pricing Comparison', views: 7621, engagement: 82 },
              { title: 'Feature Overview', views: 6543, engagement: 71 },
              { title: 'Customer Stories', views: 5432, engagement: 89 }
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{content.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{content.views.toLocaleString()} views</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    content.engagement >= 80 ? 'text-green-600 dark:text-green-400' :
                    content.engagement >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {content.engagement}% engagement
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorPage;