// Analytics page with tab navigation
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Filter, Download, Calendar } from 'lucide-react'
import { useUrlFilters } from '../hooks/useNavigation'
import { useAnalyticsFilters, useAnalyticsDashboard } from '../hooks/useAnalytics'

const AnalyticsPage = () => {
  const location = useLocation()
  const { filters, updateFilters } = useUrlFilters()
  const [showFilters, setShowFilters] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const analyticsFilters = useAnalyticsFilters()
  const analyticsData = useAnalyticsDashboard(filters.timeframe, {
    trafficSource: filters.trafficSource,
    deviceType: filters.deviceType,
    geography: filters.geography,
  })

  const tabs = [
    { id: 'overview', name: 'Overview', path: '/dashboard/analytics' },
    { id: 'traffic', name: 'Traffic', path: '/dashboard/analytics/traffic' },
    { id: 'behavior', name: 'User Behavior', path: '/dashboard/analytics/behavior' },
    { id: 'conversions', name: 'Conversions', path: '/dashboard/analytics/conversions' },
  ]

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '6m', label: 'Last 6 months' },
    { value: '12m', label: 'Last 12 months' },
  ]

  const trafficSources = [
    'All Sources',
    'Organic Search',
    'Paid Search',
    'Social Media',
    'Direct',
    'Email',
  ]
  const deviceTypes = ['All Devices', 'Desktop', 'Mobile', 'Tablet']
  const geographies = ['All Locations', 'United States', 'Europe', 'Asia Pacific', 'Other']

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Get current date for filename
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `analytics-export-${filters.timeframe}-${timestamp}.csv`

      // Build CSV data
      const csvRows: string[][] = []

      // Add header with metadata
      csvRows.push(['Analytics Export Report'])
      csvRows.push(['Generated on', new Date().toLocaleString()])
      csvRows.push(['Time Period', filters.timeframe || '30d'])
      csvRows.push(['Traffic Source', filters.trafficSource || 'All Sources'])
      csvRows.push(['Device Type', filters.deviceType || 'All Devices'])
      csvRows.push(['Geography', filters.geography || 'All Locations'])
      csvRows.push([]) // Empty row

      // Overview Metrics
      if (analyticsData.overview.data) {
        csvRows.push(['OVERVIEW METRICS'])
        csvRows.push(['Metric', 'Current Value', 'Previous Value', 'Change %', 'Trend'])

        const overview = analyticsData.overview.data
        csvRows.push([
          'Total Visitors',
          overview.totalVisitors?.toString() || 'N/A',
          '',
          '',
          overview.visitorsTrend || '',
        ])
        csvRows.push([
          'Page Views',
          overview.pageViews?.toString() || 'N/A',
          '',
          '',
          overview.pageViewsTrend || '',
        ])
        csvRows.push([
          'Bounce Rate',
          `${overview.bounceRate || 0}%`,
          '',
          '',
          overview.bounceRateTrend || '',
        ])
        csvRows.push(['Avg. Session Duration', overview.avgSessionDuration || 'N/A', '', '', ''])
        csvRows.push([]) // Empty row
      }

      // Traffic Data
      if (analyticsData.traffic.data) {
        csvRows.push(['TRAFFIC SOURCES'])
        csvRows.push(['Source', 'Visitors', 'Percentage', 'Avg. Duration'])

        const traffic = analyticsData.traffic.data
        if (traffic.sources) {
          traffic.sources.forEach((source: any) => {
            csvRows.push([
              source.name || '',
              source.visitors?.toString() || '0',
              `${source.percentage || 0}%`,
              source.avgDuration || 'N/A',
            ])
          })
        }
        csvRows.push([]) // Empty row
      }

      // Conversion Funnel
      if (analyticsData.funnel.data) {
        csvRows.push(['CONVERSION FUNNEL'])
        csvRows.push(['Step', 'Users', 'Conversion Rate', 'Drop-off Rate'])

        const funnel = analyticsData.funnel.data
        if (funnel.steps) {
          funnel.steps.forEach((step: any) => {
            csvRows.push([
              step.name || '',
              step.users?.toString() || '0',
              `${step.conversionRate || 0}%`,
              `${step.dropOffRate || 0}%`,
            ])
          })
        }
        csvRows.push([]) // Empty row
      }

      // Behavior Data
      if (analyticsData.behavior.data) {
        csvRows.push(['USER BEHAVIOR'])
        csvRows.push(['Metric', 'Value'])

        const behavior = analyticsData.behavior.data
        csvRows.push(['Pages per Session', behavior.pagesPerSession?.toString() || 'N/A'])
        csvRows.push(['Avg. Time on Page', behavior.avgTimeOnPage || 'N/A'])
        csvRows.push([
          'New vs Returning',
          `${behavior.newUsersPercent || 0}% new, ${behavior.returningUsersPercent || 0}% returning`,
        ])
        csvRows.push([]) // Empty row
      }

      // Top Landing Pages
      if (analyticsData.pages.data) {
        csvRows.push(['TOP LANDING PAGES'])
        csvRows.push(['Page', 'Views', 'Unique Visitors', 'Bounce Rate', 'Avg. Duration'])

        const pages = analyticsData.pages.data
        if (Array.isArray(pages)) {
          pages.forEach((page: any) => {
            csvRows.push([
              page.url || page.path || '',
              page.views?.toString() || '0',
              page.uniqueVisitors?.toString() || '0',
              `${page.bounceRate || 0}%`,
              page.avgDuration || 'N/A',
            ])
          })
        }
      }

      // Convert to CSV string
      const csvContent = csvRows
        .map((row) =>
          row
            .map((cell) => {
              // Escape cells containing commas or quotes
              const cellStr = cell.toString()
              if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return `"${cellStr.replace(/"/g, '""')}"`
              }
              return cellStr
            })
            .join(',')
        )
        .join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Deep dive into your business performance with advanced analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting || analyticsData.isLoading}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isExporting ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Analytics Filters
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Time Period */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Time Period
              </label>
              <select
                value={filters.timeframe}
                onChange={(e) => updateFilters({ timeframe: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {timeframeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Traffic Source */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Traffic Source
              </label>
              <select
                value={filters.trafficSource}
                onChange={(e) => updateFilters({ trafficSource: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {trafficSources.map((source) => (
                  <option key={source} value={source === 'All Sources' ? '' : source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Type */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Device Type
              </label>
              <select
                value={filters.deviceType}
                onChange={(e) => updateFilters({ deviceType: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {deviceTypes.map((device) => (
                  <option key={device} value={device === 'All Devices' ? '' : device}>
                    {device}
                  </option>
                ))}
              </select>
            </div>

            {/* Geography */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Geography
              </label>
              <select
                value={filters.geography}
                onChange={(e) => updateFilters({ geography: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {geographies.map((geo) => (
                  <option key={geo} value={geo === 'All Locations' ? '' : geo}>
                    {geo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => updateFilters({ trafficSource: '', deviceType: '', geography: '' })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          <nav className="flex min-w-max space-x-4 px-4 sm:space-x-8 sm:px-6">
            {tabs.map((tab) => {
              const isActive =
                location.pathname === tab.path ||
                (tab.id === 'overview' && location.pathname === '/dashboard/analytics')

              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
