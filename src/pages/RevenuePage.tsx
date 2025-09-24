// Revenue analytics page
import { DollarSign, TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';
import { useRevenueTrends, useTopProducts } from '../hooks/useDashboard';
import { useUrlFilters } from '../hooks/useNavigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LineChart from '../components/charts/LineChart';

// Sample revenue trends data - replace with your actual revenue data
const revenueChartData = [
    { x: 'Jan', y: 125000, revenue: 125000, target: 120000, orders: 850 },
    { x: 'Feb', y: 132000, revenue: 132000, target: 125000, orders: 920 },
    { x: 'Mar', y: 118000, revenue: 118000, target: 130000, orders: 780 },
    { x: 'Apr', y: 145000, revenue: 145000, target: 135000, orders: 1050 },
    { x: 'May', y: 158000, revenue: 158000, target: 140000, orders: 1180 },
    { x: 'Jun', y: 172000, revenue: 172000, target: 150000, orders: 1250 },
    { x: 'Jul', y: 168000, revenue: 168000, target: 155000, orders: 1200 },
    { x: 'Aug', y: 185000, revenue: 185000, target: 160000, orders: 1350 },
    { x: 'Sep', y: 195000, revenue: 195000, target: 170000, orders: 1420 },
    { x: 'Oct', y: 202000, revenue: 202000, target: 175000, orders: 1480 },
    { x: 'Nov', y: 218000, revenue: 218000, target: 180000, orders: 1580 },
    { x: 'Dec', y: 235000, revenue: 235000, target: 190000, orders: 1650 }
];

const revenueSeries = [
    { key: 'revenue', name: 'Revenue', color: '#3b82f6', strokeWidth: 3 },
    { key: 'target', name: 'Target', color: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' },
    { key: 'orders', name: 'Orders (scaled)', color: '#f59e0b', strokeWidth: 2 },
];

const RevenuePage = () => {
  const { filters } = useUrlFilters();
  const revenueQuery = useRevenueTrends(filters.timeframe === '12m' ? '12m' : '6m');
  const productsQuery = useTopProducts(filters.timeframe, 10);

  if (revenueQuery.isLoading) {
    return <LoadingSpinner text="Loading revenue data..." />;
  }

  // Use API data if available, otherwise use sample data
  const revenueData = revenueQuery.data && revenueQuery.data.length > 0 ? revenueQuery.data : 
    // Convert chart data to match expected format
    revenueChartData.map(item => ({
      month: item.x,
      revenue: item.revenue,
      orders: item.orders,
      target: item.target
    }));

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const lastMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const monthOverMonthGrowth = previousMonth 
    ? ((lastMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1)
    : '0';

  // Scale orders data for better visualization (divide by 10 to fit with revenue scale)
  const chartData = revenueChartData.map(item => ({
    ...item,
    orders: item.orders * 100 // Scale orders to be visible on same chart
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-gray-600">Track revenue performance, trends, and growth metrics</p>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-green-600">
            +{monthOverMonthGrowth}% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">Average Order Value</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            ${avgOrderValue.toFixed(2)}
          </div>
          <div className="text-sm font-medium text-green-600">
            +5.7% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {totalOrders.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-green-600">
            +8.2% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">3.24%</div>
          <div className="text-sm font-medium text-red-600">
            -2.1% vs last period
          </div>
        </div>
      </div>

      {/* Revenue Chart - FIXED */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
          <div className="flex space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Revenue
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Target
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              Orders (×100)
            </div>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
          <LineChart 
            data={chartData}
            series={revenueSeries}
            title=""
            xAxisLabel="Month"
            yAxisLabel="Revenue ($) / Orders (scaled)"
            width="100%"
            height={400}
            showGrid={true}
            showLegend={true}
            showDots={true}
            responsive={true}
          />
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Performance</h3>
          
          <div className="space-y-4">
            {revenueData.slice(-6).map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{month.month}</div>
                  <div className="text-sm text-gray-500">{month.orders.toLocaleString()} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${month.revenue.toLocaleString()}</div>
                  <div className={`text-sm ${
                    month.target && month.revenue >= month.target ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Target: ${month.target?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Revenue Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Revenue Products</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All →
            </button>
          </div>
          
          {productsQuery.isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="space-y-4">
              {(productsQuery.data || [
                { name: 'Premium Package', sales: 1250, revenue: '$45,000', growth: '+12.3%' },
                { name: 'Standard Plan', sales: 2100, revenue: '$38,500', growth: '+8.7%' },
                { name: 'Enterprise Solution', sales: 450, revenue: '$32,000', growth: '+15.2%' },
                { name: 'Basic Package', sales: 3200, revenue: '$28,000', growth: '+5.4%' },
                { name: 'Pro Features', sales: 980, revenue: '$24,500', growth: '+9.1%' },
                { name: 'Add-on Services', sales: 650, revenue: '$18,200', growth: '+6.8%' }
              ]).slice(0, 6).map((product, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' : 'bg-indigo-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales.toLocaleString()} sales</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{product.revenue}</div>
                    <div className={`text-sm font-medium ${
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

      {/* Revenue Goals */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🎯 Monthly Revenue Goal</h3>
            <p className="text-green-100 mb-4">
              You're {lastMonth?.target && lastMonth.revenue >= lastMonth.target ? 'exceeding' : 'tracking toward'} your revenue target for this month
            </p>
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-sm text-green-200">Current</div>
                <div className="text-2xl font-bold">${lastMonth?.revenue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-green-200">Target</div>
                <div className="text-2xl font-bold">${lastMonth?.target?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-green-200">Progress</div>
                <div className="text-2xl font-bold">
                  {lastMonth?.target ? Math.round((lastMonth.revenue / lastMonth.target) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <button className="px-6 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors font-medium">
              Set New Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;