// Traffic analytics page
import { Globe, TrendingUp, Users, Eye } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTrafficAnalytics } from '../hooks/useAnalytics'
import { useUrlFilters } from '../hooks/useNavigation'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MultiSeriesLineChart from '../components/charts/MultiSeriesLineChart'

const TrafficPage = () => {
  const { filters } = useUrlFilters()
  const { data, isLoading, isError } = useTrafficAnalytics(filters.timeframe, filters)
  const [activeTab, setActiveTab] = useState('sessions')
  const [chartWidth, setChartWidth] = useState(800)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  // Handle responsive chart width
  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth
        setChartWidth(Math.max(300, containerWidth - 40)) // Reduced min width for mobile
      }
    }

    updateChartWidth()
    window.addEventListener('resize', updateChartWidth)
    return () => window.removeEventListener('resize', updateChartWidth)
  }, [])

  if (isLoading) {
    return <LoadingSpinner text="Loading traffic analytics..." />
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">Failed to load traffic data</p>
      </div>
    )
  }

  // Safely extract and validate traffic data
  const rawTrafficData = data?.traffic || []
  const trafficData = Array.isArray(rawTrafficData) ? rawTrafficData : []

  // Create mock data if no real data exists (for demo purposes)
  const mockData = [
    { day: '2024-01-01', sessions: 1250, users: 980, pageViews: 3200, bounceRate: 42.5 },
    { day: '2024-01-02', sessions: 1380, users: 1020, pageViews: 3450, bounceRate: 38.2 },
    { day: '2024-01-03', sessions: 1150, users: 890, pageViews: 2980, bounceRate: 44.1 },
    { day: '2024-01-04', sessions: 1420, users: 1100, pageViews: 3680, bounceRate: 35.8 },
    { day: '2024-01-05', sessions: 1320, users: 1050, pageViews: 3520, bounceRate: 40.3 },
    { day: '2024-01-06', sessions: 1180, users: 920, pageViews: 3100, bounceRate: 43.7 },
    { day: '2024-01-07', sessions: 1480, users: 1180, pageViews: 3850, bounceRate: 32.9 },
  ]

  // Use real data if available, otherwise use mock data
  const chartData = trafficData.length > 0 ? trafficData : mockData

  // Safe calculations with fallbacks
  const totalSessions = chartData.reduce((sum, item) => sum + (item.sessions || 0), 0)
  const totalUsers = chartData.reduce((sum, item) => sum + (item.users || 0), 0)
  const avgBounceRate =
    chartData.length > 0
      ? chartData.reduce((sum, item) => sum + (item.bounceRate || 0), 0) / chartData.length
      : 0

  // Prepare chart data based on active tab
  const getChartData = () => {
    try {
      // Transform data to match DataPoint interface
      const transformedData = chartData.map((item) => ({
        ...item, // spread first to get all properties
        sessions: item.sessions || 0,
        users: item.users || 0,
        pageViews: item.pageViews || 0,
        bounceRate: item.bounceRate || 0,
      }))

      switch (activeTab) {
        case 'sessions':
          return {
            data: transformedData,
            series: [
              {
                key: 'sessions',
                name: 'Sessions',
                color: '#3B82F6',
              },
            ],
            yAxisLabel: 'Sessions',
          }
        case 'users':
          return {
            data: transformedData,
            series: [
              {
                key: 'users',
                name: 'Users',
                color: '#10B981',
              },
            ],
            yAxisLabel: 'Users',
          }
        case 'pageviews':
          return {
            data: transformedData,
            series: [
              {
                key: 'pageViews',
                name: 'Page Views',
                color: '#8B5CF6',
              },
            ],
            yAxisLabel: 'Page Views',
          }
        default:
          return {
            data: transformedData,
            series: [
              { key: 'sessions', name: 'Sessions', color: '#3B82F6' },
              { key: 'users', name: 'Users', color: '#10B981' },
              { key: 'pageViews', name: 'Page Views', color: '#8B5CF6' },
            ],
            yAxisLabel: 'Count',
          }
      }
    } catch (error) {
      console.error('Error in getChartData:', error)
      return {
        data: [],
        series: [{ key: 'sessions', name: 'Sessions', color: '#3B82F6' }],
        yAxisLabel: 'Value',
      }
    }
  }

  const chartConfig = getChartData()

  const tabs = [
    { id: 'sessions', label: 'Sessions', color: 'indigo' },
    { id: 'users', label: 'Users', color: 'green' },
    { id: 'pageviews', label: 'Page Views', color: 'purple' },
  ]

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalSessions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Unique Users</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <Globe className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {avgBounceRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Bounce Rate</div>
        </div>
      </div>

      {/* Device-Based Session Trends */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Device-Based Session Trends
          </h3>
        </div>

        <div ref={chartContainerRef} className="w-full rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div className="w-full" style={{ minHeight: '420px' }}>
            <MultiSeriesLineChart
              data={[
                { day: 'Q1 2023', desktop: 32000, mobile: 28000, tablet: 8500 },
                { day: 'Q2 2023', desktop: 34500, mobile: 32000, tablet: 9200 },
                { day: 'Q3 2023', desktop: 36000, mobile: 35500, tablet: 9800 },
                { day: 'Q4 2023', desktop: 38000, mobile: 39000, tablet: 10500 },
                { day: 'Q1 2024', desktop: 39500, mobile: 42500, tablet: 11200 },
                { day: 'Q2 2024', desktop: 41000, mobile: 46000, tablet: 12000 },
                { day: 'Q3 2024', desktop: 42500, mobile: 49500, tablet: 12800 },
                { day: 'Q4 2024', desktop: 44000, mobile: 53000, tablet: 13500 },
              ]}
              series={[
                { key: 'mobile', name: 'Mobile Sessions', color: '#22c55e', strokeWidth: 3 },
                { key: 'desktop', name: 'Desktop Sessions', color: '#60a5fa', strokeWidth: 3 },
                { key: 'tablet', name: 'Tablet Sessions', color: '#fbbf24', strokeWidth: 2 },
              ]}
              xKey="day"
              width={chartWidth}
              height={400}
              title=""
              xAxisLabel="Quarter"
              yAxisLabel="Sessions"
              showGrid={true}
              showLegend={true}
              margin={{
                top: 20,
                right: window.innerWidth < 640 ? 20 : window.innerWidth < 768 ? 60 : 120,
                bottom: window.innerWidth < 640 ? 60 : 80,
                left: window.innerWidth < 640 ? 40 : window.innerWidth < 768 ? 60 : 80,
              }}
            />
          </div>
        </div>
      </div>

      {/* Traffic Over Time Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Traffic Over Time
          </h3>
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-100 dark:bg-${tab.color}-900/30 text-${tab.color}-700 dark:text-${tab.color}-400`
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
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
              yAxisLabel={chartConfig.yAxisLabel || 'Value'}
              showGrid={true}
              showLegend={chartConfig.series.length > 1}
              margin={{
                top: 20,
                right: window.innerWidth < 640 ? 20 : window.innerWidth < 768 ? 60 : 100,
                bottom: window.innerWidth < 640 ? 60 : 80,
                left: window.innerWidth < 640 ? 40 : window.innerWidth < 768 ? 60 : 80,
              }}
            />
          </div>
        </div>
      </div>

      {/* Traffic Sources Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Traffic Sources */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Traffic Sources
          </h3>

          <div className="space-y-4">
            {[
              {
                source: 'Organic Search',
                sessions: 45123,
                percentage: 45.2,
                change: '+12.3%',
                color: 'bg-blue-500',
              },
              {
                source: 'Direct',
                sessions: 25067,
                percentage: 25.1,
                change: '+8.7%',
                color: 'bg-green-500',
              },
              {
                source: 'Social Media',
                sessions: 18945,
                percentage: 19.0,
                change: '+15.2%',
                color: 'bg-purple-500',
              },
              {
                source: 'Email',
                sessions: 10865,
                percentage: 10.9,
                change: '+5.4%',
                color: 'bg-yellow-500',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
              >
                <div className="flex items-center">
                  <div className={`h-3 w-3 ${item.color} mr-3 rounded-full`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.source}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.sessions.toLocaleString()} sessions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.percentage}%
                  </div>
                  <div className="text-xs text-green-600">{item.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Top Countries
          </h3>

          <div className="space-y-4">
            {[
              { country: 'United States', flag: '🇺🇸', sessions: 45230, percentage: 35.2 },
              { country: 'United Kingdom', flag: '🇬🇧', sessions: 23150, percentage: 18.0 },
              { country: 'Germany', flag: '🇩🇪', sessions: 18940, percentage: 14.7 },
              { country: 'Canada', flag: '🇨🇦', sessions: 15670, percentage: 12.2 },
              { country: 'France', flag: '🇫🇷', sessions: 12840, percentage: 10.0 },
              { country: 'Other', flag: '🌍', sessions: 12770, percentage: 9.9 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{item.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.country}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.sessions.toLocaleString()} sessions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.percentage}%
                  </div>
                  <div className="mt-1 h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
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
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
          Traffic Details
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Period
                </th>
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sessions
                </th>
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Users
                </th>
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Page Views
                </th>
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bounce Rate
                </th>
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <td className="py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.day}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                    {(item.sessions || 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                    {(item.users || 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                    {(item.pageViews || 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                    {item.bounceRate || 0}%
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">3m 24s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TrafficPage
