// Revenue analytics page
import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Target, Calendar, X } from 'lucide-react'
import { useRevenueTrends, useTopProducts } from '../hooks/useDashboard'
import { useUrlFilters } from '../hooks/useNavigation'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LineChart from '../components/charts/LineChart'

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
  { x: 'Dec', y: 235000, revenue: 235000, target: 190000, orders: 1650 },
]

const revenueSeries = [
  { key: 'revenue', name: 'Revenue', color: '#60a5fa', strokeWidth: 3 },
  { key: 'target', name: 'Target', color: '#22c55e', strokeWidth: 2, strokeDasharray: '5,5' },
  { key: 'orders', name: 'Orders (scaled)', color: '#fbbf24', strokeWidth: 2 },
]

const RevenuePage = () => {
  const { filters } = useUrlFilters()
  const revenueQuery = useRevenueTrends(filters.timeframe === '12m' ? '12m' : '6m')
  const productsQuery = useTopProducts(filters.timeframe, 10)

  // Goal modal state
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [newGoalAmount, setNewGoalAmount] = useState('')
  const [customGoal, setCustomGoal] = useState<number | null>(null)
  const [goalSaved, setGoalSaved] = useState(false)

  if (revenueQuery.isLoading) {
    return <LoadingSpinner text="Loading revenue data..." />
  }

  // Use API data if available, otherwise use sample data
  const revenueData =
    revenueQuery.data && revenueQuery.data.length > 0
      ? revenueQuery.data
      : // Convert chart data to match expected format
        revenueChartData.map((item) => ({
          month: item.x,
          revenue: item.revenue,
          orders: item.orders,
          target: item.target,
        }))

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0)

  const handleSetGoal = () => {
    const amount = parseFloat(newGoalAmount.replace(/,/g, ''))
    if (!isNaN(amount) && amount > 0) {
      setCustomGoal(amount)
      setGoalSaved(true)
      setTimeout(() => setGoalSaved(false), 3000)
      setShowGoalModal(false)
      setNewGoalAmount('')
    }
  }

  const formatCurrency = (value: string) => {
    const num = value.replace(/,/g, '').replace(/[^0-9]/g, '')
    if (num) {
      return parseInt(num).toLocaleString()
    }
    return ''
  }
  const avgOrderValue = totalRevenue / totalOrders
  const lastMonth = revenueData[revenueData.length - 1]
  const previousMonth = revenueData[revenueData.length - 2]
  const monthOverMonthGrowth = previousMonth
    ? (((lastMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1)
    : '0'

  // Scale orders data for better visualization (divide by 10 to fit with revenue scale)
  const chartData = revenueChartData.map((item) => ({
    ...item,
    orders: item.orders * 100, // Scale orders to be visible on same chart
  }))

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
          Revenue Analytics
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Track revenue performance, trends, and growth metrics
        </p>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-green-600">
            +{monthOverMonthGrowth}% vs last period
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Average Order Value</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${avgOrderValue.toFixed(2)}
          </div>
          <div className="text-sm font-medium text-green-600">+5.7% vs last period</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalOrders.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-green-600">+8.2% vs last period</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">3.24%</div>
          <div className="text-sm font-medium text-red-600">-2.1% vs last period</div>
        </div>
      </div>

      {/* Revenue Chart - FIXED */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Revenue Trends
          </h3>
          <div className="flex space-x-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Revenue
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
              Target
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
              Orders (×100)
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full sm:h-[400px]">
          <LineChart
            data={chartData}
            series={revenueSeries}
            title=""
            xAxisLabel="Month"
            yAxisLabel="Revenue ($) / Orders (scaled)"
            showGrid={true}
            showLegend={true}
            showDots={true}
            responsive={true}
          />
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Monthly Breakdown */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Monthly Performance
          </h3>

          <div className="space-y-4">
            {revenueData.slice(-6).map((month, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{month.month}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {month.orders.toLocaleString()} orders
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    ${month.revenue.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm ${
                      month.target && month.revenue >= month.target
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    Target: ${month.target?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Revenue Products */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              Top Revenue Products
            </h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View All →
            </button>
          </div>

          {productsQuery.isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="space-y-4">
              {(
                productsQuery.data || [
                  { name: 'Premium Package', sales: 1250, revenue: '$45,000', growth: '+12.3%' },
                  { name: 'Standard Plan', sales: 2100, revenue: '$38,500', growth: '+8.7%' },
                  { name: 'Enterprise Solution', sales: 450, revenue: '$32,000', growth: '+15.2%' },
                  { name: 'Basic Package', sales: 3200, revenue: '$28,000', growth: '+5.4%' },
                  { name: 'Pro Features', sales: 980, revenue: '$24,500', growth: '+9.1%' },
                  { name: 'Add-on Services', sales: 650, revenue: '$18,200', growth: '+6.8%' },
                ]
              )
                .slice(0, 6)
                .map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0 dark:border-gray-700"
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                              ? 'bg-gray-400'
                              : index === 2
                                ? 'bg-amber-600'
                                : 'bg-indigo-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.sales.toLocaleString()} sales
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {product.revenue}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          product.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
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
      <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-bold sm:text-xl">🎯 Monthly Revenue Goal</h3>
            <p className="mb-4 text-sm text-green-100 sm:text-base">
              You're{' '}
              {lastMonth?.target && lastMonth.revenue >= lastMonth.target
                ? 'exceeding'
                : 'tracking toward'}{' '}
              your revenue target for this month
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div>
                <div className="text-xs text-green-200 sm:text-sm">Current</div>
                <div className="text-lg font-bold sm:text-2xl">
                  ${lastMonth?.revenue.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-green-200 sm:text-sm">Target</div>
                <div className="text-lg font-bold sm:text-2xl">
                  ${customGoal ? customGoal.toLocaleString() : lastMonth?.target?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-green-200 sm:text-sm">Progress</div>
                <div className="text-lg font-bold sm:text-2xl">
                  {customGoal || lastMonth?.target
                    ? Math.round((lastMonth.revenue / (customGoal || lastMonth.target)) * 100)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
          <div className="lg:text-right">
            <button
              onClick={() => setShowGoalModal(true)}
              className="w-full rounded-lg bg-white bg-opacity-20 px-4 py-2 text-sm font-medium transition-colors hover:bg-opacity-30 sm:px-6 sm:py-3 sm:text-base lg:w-auto"
            >
              Set New Goal
            </button>
          </div>
        </div>
      </div>

      {/* Goal Saved Notification */}
      {goalSaved && (
        <div className="fixed right-6 top-20 z-50 flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          <Target className="h-4 w-4" />
          <span className="text-sm font-medium">New goal saved!</span>
        </div>
      )}

      {/* Set New Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowGoalModal(false)}
          />
          <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
                  Set Revenue Goal
                </h3>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="rounded p-1 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Revenue Target
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <input
                    type="text"
                    value={newGoalAmount}
                    onChange={(e) => setNewGoalAmount(formatCurrency(e.target.value))}
                    placeholder="250,000"
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-8 pr-4 text-lg text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Current month revenue: ${lastMonth?.revenue?.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Setting a clear revenue goal helps track your business performance and identify
                  areas for improvement.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetGoal}
                  disabled={!newGoalAmount}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RevenuePage
