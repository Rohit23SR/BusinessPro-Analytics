// Conversion analytics page
import { Target, TrendingUp, Users, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useConversionFunnel } from '../hooks/useAnalytics'
import { useUrlFilters } from '../hooks/useNavigation'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LineChart from '../components/charts/LineChart'

const funnelData1 = [
  {
    x: 'Jan',
    y: 45.2,
    landingPage: 45.2,
    productView: 12.8,
    addToCart: 8.4,
    checkout: 3.2,
    purchase: 2.1,
  },
  {
    x: 'Feb',
    y: 47.8,
    landingPage: 47.8,
    productView: 14.1,
    addToCart: 9.2,
    checkout: 3.6,
    purchase: 2.3,
  },
  {
    x: 'Mar',
    y: 44.6,
    landingPage: 44.6,
    productView: 13.5,
    addToCart: 8.8,
    checkout: 3.4,
    purchase: 2.2,
  },
  {
    x: 'Apr',
    y: 52.1,
    landingPage: 52.1,
    productView: 16.2,
    addToCart: 11.1,
    checkout: 4.2,
    purchase: 2.8,
  },
  {
    x: 'May',
    y: 55.4,
    landingPage: 55.4,
    productView: 17.8,
    addToCart: 12.3,
    checkout: 4.8,
    purchase: 3.2,
  },
  {
    x: 'Jun',
    y: 58.9,
    landingPage: 58.9,
    productView: 19.5,
    addToCart: 13.8,
    checkout: 5.4,
    purchase: 3.7,
  },
  {
    x: 'Jul',
    y: 61.2,
    landingPage: 61.2,
    productView: 21.1,
    addToCart: 15.2,
    checkout: 6.1,
    purchase: 4.2,
  },
  {
    x: 'Aug',
    y: 59.8,
    landingPage: 59.8,
    productView: 20.3,
    addToCart: 14.6,
    checkout: 5.8,
    purchase: 3.9,
  },
  {
    x: 'Sep',
    y: 63.5,
    landingPage: 63.5,
    productView: 22.8,
    addToCart: 16.7,
    checkout: 6.8,
    purchase: 4.5,
  },
  {
    x: 'Oct',
    y: 66.2,
    landingPage: 66.2,
    productView: 24.5,
    addToCart: 18.2,
    checkout: 7.5,
    purchase: 4.8,
  },
  {
    x: 'Nov',
    y: 68.9,
    landingPage: 68.9,
    productView: 26.1,
    addToCart: 19.8,
    checkout: 8.2,
    purchase: 5.1,
  },
  {
    x: 'Dec',
    y: 72.4,
    landingPage: 72.4,
    productView: 28.6,
    addToCart: 21.9,
    checkout: 9.1,
    purchase: 5.6,
  },
]

const funnelSeries1 = [
  { key: 'landingPage', name: 'Landing Page View', color: '#22d3ee', strokeWidth: 2 },
  { key: 'productView', name: 'Product View', color: '#22c55e', strokeWidth: 2 },
  { key: 'addToCart', name: 'Add to Cart', color: '#fbbf24', strokeWidth: 2 },
  { key: 'checkout', name: 'Checkout Started', color: '#f87171', strokeWidth: 2 },
  { key: 'purchase', name: 'Purchase Complete', color: '#a78bfa', strokeWidth: 3 },
]

const ConversionsPage = () => {
  const { filters } = useUrlFilters()
  const { data, isLoading, isError } = useConversionFunnel(filters.timeframe, filters)
  const [activeFunnelTab, setActiveFunnelTab] = useState('ecommerce')

  // Define different funnel types with sample data
  const ecommerceFunnel = [
    { step: 'Visit Website', visitors: 45000, percentage: 100.0 },
    { step: 'View Product', visitors: 18000, percentage: 40.0 },
    { step: 'Add to Cart', visitors: 7200, percentage: 16.0 },
    { step: 'Checkout Started', visitors: 3600, percentage: 8.0 },
    { step: 'Payment Complete', visitors: 1350, percentage: 3.0 },
  ]

  const leadgenFunnel = [
    { step: 'Landing Page', visitors: 25000, percentage: 100.0 },
    { step: 'Form View', visitors: 15000, percentage: 60.0 },
    { step: 'Form Start', visitors: 9000, percentage: 36.0 },
    { step: 'Form Complete', visitors: 4500, percentage: 18.0 },
    { step: 'Lead Qualified', visitors: 1800, percentage: 7.2 },
  ]

  if (isLoading) {
    return <LoadingSpinner text="Loading conversion data..." />
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load conversion data</p>
      </div>
    )
  }

  // Get the appropriate funnel data based on active tab
  const currentFunnelData = activeFunnelTab === 'ecommerce' ? ecommerceFunnel : leadgenFunnel

  // Use API data if available, otherwise use sample data
  const funnelData = data?.funnel && data.funnel.length > 0 ? data.funnel : currentFunnelData

  const totalVisitors = funnelData[0]?.visitors || 0
  const conversions = funnelData[funnelData.length - 1]?.visitors || 0
  const overallConversionRate =
    totalVisitors > 0 ? ((conversions / totalVisitors) * 100).toFixed(2) : '0'

  return (
    <div className="space-y-8">
      {/* Conversion Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalVisitors.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Visitors</div>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400">
            +15.3% vs last period
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {conversions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Conversions</div>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400">
            +8.7% vs last period
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-red-500" />
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {overallConversionRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
          <div className="mt-1 text-xs text-red-600 dark:text-red-400">-2.1% vs last period</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">$89.32</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</div>
          <div className="mt-1 text-xs text-green-600 dark:text-green-400">
            +5.7% vs last period
          </div>
        </div>
      </div>

      {/* Conversion Funnel with Working Tabs */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Conversion Funnel
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFunnelTab('ecommerce')}
              className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                activeFunnelTab === 'ecommerce'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              E-commerce
            </button>
            <button
              onClick={() => setActiveFunnelTab('leadgen')}
              className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                activeFunnelTab === 'leadgen'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Lead Gen
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {funnelData.map((step, stepIndex) => {
            const isLast = stepIndex === funnelData.length - 1
            const nextStep = funnelData[stepIndex + 1]
            const dropOffRate = nextStep
              ? (((step.visitors - nextStep.visitors) / step.visitors) * 100).toFixed(1)
              : 0

            // Color arrays for different funnel types
            const ecommerceColors = [
              'bg-cyan-500',
              'bg-blue-500',
              'bg-indigo-500',
              'bg-purple-500',
              'bg-pink-500',
            ]
            const leadgenColors = [
              'bg-green-500',
              'bg-emerald-500',
              'bg-teal-500',
              'bg-cyan-500',
              'bg-blue-500',
            ]

            const colorArray = activeFunnelTab === 'ecommerce' ? ecommerceColors : leadgenColors
            const stepColor = colorArray[stepIndex] || 'bg-gray-500'

            return (
              <div key={stepIndex}>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="flex items-center">
                    <div
                      className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${stepColor}`}
                    >
                      {stepIndex + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {step.step}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {step.percentage.toFixed(1)}% of total visitors
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {step.visitors.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">visitors</div>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                      <span className="mr-2">↓</span>
                      {dropOffRate}% drop-off
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Funnel Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {conversions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Conversions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {overallConversionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Conversion Trends - Fixed */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
          Conversion Rate Trends
        </h3>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div className="h-[350px] w-full sm:h-[500px]">
            <LineChart
              data={funnelData1}
              series={funnelSeries1}
              title="Conversion Funnel Step Analysis (%)"
              xAxisLabel="Month"
              yAxisLabel="Step Conversion Rate (%)"
              showGrid={true}
              showLegend={true}
              showDots={true}
              responsive={true}
            />
          </div>
        </div>
      </div>

      {/* Conversion by Source */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Conversion by Traffic Source
          </h3>

          <div className="space-y-4">
            {[
              { source: 'Organic Search', conversions: 1234, rate: 4.2, revenue: '$45,678' },
              { source: 'Paid Search', conversions: 892, rate: 6.8, revenue: '$32,150' },
              { source: 'Social Media', conversions: 456, rate: 2.1, revenue: '$18,940' },
              { source: 'Direct Traffic', conversions: 678, rate: 3.9, revenue: '$28,430' },
              { source: 'Email', conversions: 234, rate: 8.4, revenue: '$15,670' },
            ].map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {source.source}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {source.conversions} conversions
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100">{source.rate}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{source.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Optimization Opportunities
          </h3>

          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="text-lg text-red-600 dark:text-red-400">⚠️</div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-red-800">High Cart Abandonment</div>
                  <div className="mt-1 text-sm text-red-700">
                    80% of users abandon their cart. Consider simplifying checkout process.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="text-lg text-yellow-600 dark:text-yellow-400">💡</div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-yellow-800">Mobile Optimization</div>
                  <div className="mt-1 text-sm text-yellow-700">
                    Mobile conversion rate is 40% lower than desktop. Review mobile UX.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="text-lg text-green-600 dark:text-green-400">✅</div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-green-800">Email Campaigns</div>
                  <div className="mt-1 text-sm text-green-700">
                    Email traffic has highest conversion rate. Increase email marketing spend.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals and Targets */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2 text-xl font-bold">🎯 Conversion Goals</h3>
            <p className="mb-4 text-indigo-100">
              Current conversion rate: {overallConversionRate}% | Target: 4.5%
            </p>
            <div className="h-3 w-full rounded-full bg-indigo-400">
              <div
                className="h-3 rounded-full bg-white transition-all duration-500 dark:bg-gray-800"
                style={{
                  width: `${Math.min((parseFloat(overallConversionRate) / 4.5) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {Math.round((parseFloat(overallConversionRate) / 4.5) * 100)}%
            </div>
            <div className="text-indigo-200">of goal</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversionsPage
