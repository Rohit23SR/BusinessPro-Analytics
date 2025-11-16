// Main dashboard page component
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDashboardOverview, useRefreshDashboard } from '../hooks/useDashboard';
import { useUrlFilters } from '../hooks/useNavigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import PieChart from '../components/charts/PieChart';
import LineChart from '../components/charts/LineChart';

// Multiple datasets for refresh functionality
const revenueDataSets = [
  [
    { x: 'Jan', y: 125000, actual: 125000, target: 120000, previousYear: 108000 },
    { x: 'Feb', y: 138000, actual: 138000, target: 135000, previousYear: 115000 },
    { x: 'Mar', y: 156000, actual: 156000, target: 145000, previousYear: 128000 },
    { x: 'Apr', y: 142000, actual: 142000, target: 150000, previousYear: 135000 },
    { x: 'May', y: 167000, actual: 167000, target: 160000, previousYear: 142000 },
    { x: 'Jun', y: 189000, actual: 189000, target: 170000, previousYear: 158000 },
    { x: 'Jul', y: 203000, actual: 203000, target: 180000, previousYear: 165000 },
    { x: 'Aug', y: 195000, actual: 195000, target: 185000, previousYear: 172000 },
    { x: 'Sep', y: 218000, actual: 218000, target: 190000, previousYear: 180000 },
    { x: 'Oct', y: 235000, actual: 235000, target: 200000, previousYear: 188000 },
    { x: 'Nov', y: 248000, actual: 248000, target: 210000, previousYear: 195000 },
    { x: 'Dec', y: 267000, actual: 267000, target: 220000, previousYear: 203000 }
  ],
  [
    { x: 'Jan', y: 110000, actual: 110000, target: 115000, previousYear: 98000 },
    { x: 'Feb', y: 145000, actual: 145000, target: 140000, previousYear: 125000 },
    { x: 'Mar', y: 162000, actual: 162000, target: 155000, previousYear: 138000 },
    { x: 'Apr', y: 158000, actual: 158000, target: 160000, previousYear: 145000 },
    { x: 'May', y: 175000, actual: 175000, target: 170000, previousYear: 152000 },
    { x: 'Jun', y: 192000, actual: 192000, target: 180000, previousYear: 168000 },
    { x: 'Jul', y: 210000, actual: 210000, target: 190000, previousYear: 175000 },
    { x: 'Aug', y: 205000, actual: 205000, target: 195000, previousYear: 182000 },
    { x: 'Sep', y: 225000, actual: 225000, target: 200000, previousYear: 190000 },
    { x: 'Oct', y: 242000, actual: 242000, target: 210000, previousYear: 198000 },
    { x: 'Nov', y: 255000, actual: 255000, target: 220000, previousYear: 205000 },
    { x: 'Dec', y: 278000, actual: 278000, target: 230000, previousYear: 213000 }
  ],
  [
    { x: 'Jan', y: 135000, actual: 135000, target: 125000, previousYear: 118000 },
    { x: 'Feb', y: 142000, actual: 142000, target: 138000, previousYear: 125000 },
    { x: 'Mar', y: 168000, actual: 168000, target: 150000, previousYear: 138000 },
    { x: 'Apr', y: 155000, actual: 155000, target: 155000, previousYear: 145000 },
    { x: 'May', y: 182000, actual: 182000, target: 165000, previousYear: 152000 },
    { x: 'Jun', y: 195000, actual: 195000, target: 175000, previousYear: 168000 },
    { x: 'Jul', y: 215000, actual: 215000, target: 185000, previousYear: 175000 },
    { x: 'Aug', y: 208000, actual: 208000, target: 190000, previousYear: 182000 },
    { x: 'Sep', y: 232000, actual: 232000, target: 195000, previousYear: 190000 },
    { x: 'Oct', y: 248000, actual: 248000, target: 205000, previousYear: 198000 },
    { x: 'Nov', y: 265000, actual: 265000, target: 215000, previousYear: 205000 },
    { x: 'Dec', y: 285000, actual: 285000, target: 225000, previousYear: 213000 }
  ]
];

const trafficDataSets = [
  [
    { name: 'Organic Search', value: 45, color: '#10b981' },
    { name: 'Direct Traffic', value: 25, color: '#6366f1' },
    { name: 'Social Media', value: 20, color: '#f59e0b' },
    { name: 'Email', value: 10, color: '#ef4444' }
  ],
  [
    { name: 'Organic Search', value: 38, color: '#10b981' },
    { name: 'Direct Traffic', value: 32, color: '#6366f1' },
    { name: 'Social Media', value: 18, color: '#f59e0b' },
    { name: 'Email', value: 12, color: '#ef4444' }
  ],
  [
    { name: 'Organic Search', value: 52, color: '#10b981' },
    { name: 'Direct Traffic', value: 22, color: '#6366f1' },
    { name: 'Social Media', value: 16, color: '#f59e0b' },
    { name: 'Email', value: 10, color: '#ef4444' }
  ]
];

const seriesConfig = [
  { key: 'actual', name: 'Actual Revenue', color: '#10b981', strokeWidth: 3 },
  { key: 'target', name: 'Target Revenue', color: '#6366f1', strokeWidth: 2, strokeDasharray: '5,5' },
  { key: 'previousYear', name: 'Previous Year', color: '#9ca3af', strokeWidth: 2 }
];

const DashboardPage = () => {
  const { filters } = useUrlFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [dataIndex, setDataIndex] = useState(0);
  const hasHandledRefresh = useRef(false);

  const {
    kpis,
    revenue,
    traffic,
    activity,
    products,
    isLoading,
    isError,
    error
  } = useDashboardOverview(filters.timeframe);

  const refreshDashboard = useRefreshDashboard();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Cycle through datasets for mock refresh
      setDataIndex((prev) => (prev + 1) % 3);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Uncomment this if you want to call actual refresh API
      // await refreshDashboard.mutateAsync(filters.timeframe);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle action=refresh from URL (triggered by search action)
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'refresh' && !hasHandledRefresh.current && !refreshing) {
      hasHandledRefresh.current = true;

      // Remove the action param from URL to prevent repeated refreshes
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams, { replace: true });

      // Trigger the actual refresh
      handleRefresh();
    } else if (action !== 'refresh') {
      // Reset the ref when action is not refresh
      hasHandledRefresh.current = false;
    }
  }, [searchParams, setSearchParams, refreshing]);

  if (isLoading && dataIndex === 0) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (isError && dataIndex === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your business performance and key metrics</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.data?.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600">{kpi.title}</div>
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</div>
            
            <div className={`text-sm font-medium ${
              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.change} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <div className="hidden md:flex space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Actual
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                Target
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                Previous Year
              </div>
            </div>
          </div>
          
          {revenue.isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="sm" text="Loading chart..." />
            </div>
          ) : (
            <div className="w-full" style={{ height: '350px' }}>
               <LineChart 
                data={revenueDataSets[dataIndex]}
                series={seriesConfig}
                title=""
                xAxisLabel="Month"
                yAxisLabel="Revenue ($)"
                height={350}
                margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
                showGrid={true}
                showLegend={false}
                showDots={true}
                responsive={true}
              />
            </div>
          )}
        </div>

        {/* Traffic Sources Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View Details →
            </button>
          </div>
          
          {traffic.isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="sm" text="Loading chart..." />
            </div>
          ) : (
            <div className="w-full" style={{ height: '350px' }}>
              <PieChart
                data={traffic.data?.map(item => ({
                  name: item.name,
                  value: item.value,
                  color: item.color
                })) || trafficDataSets[dataIndex]}
                width={280}
                height={200}
                showLabels={true}
                showLegend={true}
                animate={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          
          {activity.isLoading ? (
            <LoadingSpinner size="sm" text="Loading activity..." />
          ) : (
            <div className="space-y-4">
              {activity.data?.slice(0, 5).map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.activity}</div>
                    <div className="text-xs text-gray-500">{item.user} • {item.time}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    item.status === 'Completed' || item.status === 'Success' || item.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'Processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All →
            </button>
          </div>
          
          {products.isLoading ? (
            <LoadingSpinner size="sm" text="Loading products..." />
          ) : (
            <div className="space-y-4">
              {products.data?.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.sales.toLocaleString()} sales</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{product.revenue}</div>
                    <div className={`text-xs font-medium ${
                      product.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">💡 Quick Insights</h3>
            <p className="text-indigo-100">
              Revenue is up {kpis.data?.[0]?.change || '12.5%'} this month. 
              Consider increasing marketing spend on high-performing channels.
            </p>
          </div>
          <Link
            to="/dashboard/analytics"
            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            View Analytics →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;