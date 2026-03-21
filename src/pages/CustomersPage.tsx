// Customer Management Dashboard
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Target,
} from 'lucide-react'
import { useState } from 'react'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'
import AreaChart from '../components/charts/AreaChart'
import HeatMap from '../components/charts/Heatmap'

// Customer acquisition trends data
const customerAcquisitionData = [
  { x: 'Jan', y: 1247, organic: 620, paid: 380, referral: 150, social: 97 },
  { x: 'Feb', y: 1385, organic: 690, paid: 420, referral: 165, social: 110 },
  { x: 'Mar', y: 1156, organic: 580, paid: 350, referral: 140, social: 86 },
  { x: 'Apr', y: 1523, organic: 760, paid: 460, referral: 190, social: 113 },
  { x: 'May', y: 1687, organic: 845, paid: 510, referral: 210, social: 122 },
  { x: 'Jun', y: 1834, organic: 920, paid: 550, referral: 230, social: 134 },
  { x: 'Jul', y: 1756, organic: 880, paid: 530, referral: 220, social: 126 },
  { x: 'Aug', y: 1923, organic: 960, paid: 580, referral: 240, social: 143 },
  { x: 'Sep', y: 2045, organic: 1025, paid: 615, referral: 255, social: 150 },
  { x: 'Oct', y: 2134, organic: 1070, paid: 640, referral: 265, social: 159 },
  { x: 'Nov', y: 2256, organic: 1130, paid: 680, referral: 280, social: 166 },
  { x: 'Dec', y: 2387, organic: 1195, paid: 715, referral: 295, social: 182 },
]

const acquisitionSeries = [
  { key: 'organic', name: 'Organic Search', color: '#10B981', strokeWidth: 3 },
  { key: 'paid', name: 'Paid Ads', color: '#3B82F6', strokeWidth: 2 },
  { key: 'referral', name: 'Referrals', color: '#F59E0B', strokeWidth: 2 },
  { key: 'social', name: 'Social Media', color: '#EF4444', strokeWidth: 2 },
]

// Customer segments data
const customerSegmentsData = [
  { category: 'VIP Customers', current: 850, previous: 780, target: 900 },
  { category: 'Regular', current: 3200, previous: 2950, target: 3500 },
  { category: 'New Users', current: 2400, previous: 2200, target: 2600 },
  { category: 'At Risk', current: 1200, previous: 1350, target: 800 },
  { category: 'Inactive', current: 950, previous: 1100, target: 600 },
]

// Customer lifetime value distribution
const clvDistribution = [
  { name: 'High Value ($500+)', value: 15, color: '#10B981' },
  { name: 'Medium Value ($100-$499)', value: 35, color: '#3B82F6' },
  { name: 'Low Value ($50-$99)', value: 30, color: '#F59E0B' },
  { name: 'New Customers (<$50)', value: 20, color: '#6B7280' },
]

// Customer engagement heatmap data
const engagementHeatmapData = [
  { x: 'Email', y: 'VIP', value: 95 },
  { x: 'Email', y: 'Regular', value: 78 },
  { x: 'Email', y: 'New', value: 65 },
  { x: 'Email', y: 'At Risk', value: 45 },
  { x: 'SMS', y: 'VIP', value: 88 },
  { x: 'SMS', y: 'Regular', value: 72 },
  { x: 'SMS', y: 'New', value: 58 },
  { x: 'SMS', y: 'At Risk', value: 35 },
  { x: 'Push', y: 'VIP', value: 82 },
  { x: 'Push', y: 'Regular', value: 67 },
  { x: 'Push', y: 'New', value: 54 },
  { x: 'Push', y: 'At Risk', value: 28 },
  { x: 'In-App', y: 'VIP', value: 92 },
  { x: 'In-App', y: 'Regular', value: 75 },
  { x: 'In-App', y: 'New', value: 62 },
  { x: 'In-App', y: 'At Risk', value: 40 },
]

// Customer retention data
const retentionData = [
  { x: 'Month 1', y: 8500 },
  { x: 'Month 2', y: 7650 },
  { x: 'Month 3', y: 6890 },
  { x: 'Month 4', y: 6200 },
  { x: 'Month 5', y: 5680 },
  { x: 'Month 6', y: 5240 },
  { x: 'Month 7', y: 4890 },
  { x: 'Month 8', y: 4620 },
  { x: 'Month 9', y: 4380 },
  { x: 'Month 10', y: 4180 },
  { x: 'Month 11', y: 4020 },
  { x: 'Month 12', y: 3890 },
]

const CustomersPage = () => {
  const [activeSegment, setActiveSegment] = useState('all')

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
          Customer Management
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Manage your customer base and analyze customer behavior
        </p>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Total Customers</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">12,847</div>
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            +8.2% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">New This Month</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">2,387</div>
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            +15.3% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Active Rate</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">67.3%</div>
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            -2.1% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Avg CLV</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">$1,247</div>
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            +12.4% vs last month
          </div>
        </div>
      </div>

      {/* Customer Acquisition Trends */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Customer Acquisition Trends
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveSegment('all')}
              className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                activeSegment === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              All Channels
            </button>
            <button
              onClick={() => setActiveSegment('organic')}
              className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                activeSegment === 'organic'
                  ? 'bg-blue-100 text-blue-700'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Organic Only
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full sm:h-[400px]">
          <LineChart
            data={customerAcquisitionData}
            series={acquisitionSeries}
            title=""
            xAxisLabel="Month"
            yAxisLabel="New Customers"
            showGrid={true}
            showLegend={true}
            showDots={true}
            responsive={true}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Customer Segments */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Customer Segments
          </h3>

          <div className="space-y-4">
            {customerSegmentsData.map((segment, index) => {
              const percentage = segment.target > 0 ? (segment.current / segment.target) * 100 : 0
              const growth = ((segment.current - segment.previous) / segment.previous) * 100
              const isGrowing = growth > 0

              const colors = [
                'bg-green-500',
                'bg-blue-500',
                'bg-purple-500',
                'bg-red-500',
                'bg-gray-500',
              ]

              return (
                <div key={index} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 ${colors[index]} mr-3 rounded-full`}></div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {segment.category}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {segment.current.toLocaleString()} customers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {percentage.toFixed(1)}%
                      </div>
                      <div
                        className={`text-sm font-medium ${isGrowing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {isGrowing ? '+' : ''}
                        {growth.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${colors[index]}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Customer Lifetime Value Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Customer Lifetime Value
          </h3>
          <div className="flex h-[280px] items-center justify-center sm:h-[350px]">
            <PieChart
              data={clvDistribution}
              width={200}
              height={200}
              showLabels={true}
              showLegend={true}
              animate={true}
              innerRadius={60}
            />
          </div>
        </div>
      </div>

      {/* Customer Engagement Heatmap */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Engagement by Channel & Segment
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate (%)</div>
        </div>

        <div className="overflow-x-auto">
          <HeatMap data={engagementHeatmapData} title="" />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Customer Retention Curve */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            12-Month Retention Curve
          </h3>
          <div className="h-[300px] w-full">
            <LineChart
              data={retentionData}
              series={[{ key: 'y', name: 'Active Customers', color: '#3B82F6', strokeWidth: 3 }]}
              title=""
              xAxisLabel="Months Since Signup"
              yAxisLabel="Active Customers"
              showGrid={true}
              showLegend={false}
              showDots={true}
              responsive={true}
            />
          </div>
          <div className="mt-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3">
            <div className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800">12-Month Retention Rate</span>
            </div>
            <p className="mt-1 text-sm text-blue-700">
              45.8% of customers remain active after one year
            </p>
          </div>
        </div>

        {/* Customer Insights & Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Customer Insights
          </h3>

          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800">High Organic Growth</span>
              </div>
              <p className="mt-1 text-sm text-green-700">Organic acquisition up 22% this quarter</p>
            </div>

            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800">Email Engagement Down</span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                Email open rates dropped 5% - review content strategy
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800">VIP Segment Growing</span>
              </div>
              <p className="mt-1 text-sm text-blue-700">
                High-value customers increased 9% this month
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-800">At-Risk Customers</span>
              </div>
              <p className="mt-1 text-sm text-red-700">
                1,200 customers haven't engaged in 30+ days
              </p>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Recommended Actions
            </h4>
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-blue-50 px-3 py-2 text-left text-sm text-blue-700 transition-colors hover:bg-blue-100">
                Launch re-engagement campaign for at-risk customers
              </button>
              <button className="w-full rounded-lg bg-green-50 px-3 py-2 text-left text-sm text-green-700 transition-colors hover:bg-green-100">
                Create VIP loyalty program expansion
              </button>
              <button className="w-full rounded-lg bg-purple-50 px-3 py-2 text-left text-sm text-purple-700 transition-colors hover:bg-purple-100">
                A/B test email subject lines and timing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomersPage
