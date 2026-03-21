// Product Analytics Dashboard
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Star,
  AlertTriangle,
  Eye,
  DollarSign,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'
import AreaChart from '../components/charts/AreaChart'
import HeatMap from '../components/charts/Heatmap'

// Sample data for product sales trends
const productSalesData = [
  { x: 'Jan', y: 45000, electronics: 18000, clothing: 12000, books: 8000, home: 7000 },
  { x: 'Feb', y: 52000, electronics: 21000, clothing: 14000, books: 9000, home: 8000 },
  { x: 'Mar', y: 48000, electronics: 19000, clothing: 13000, books: 8500, home: 7500 },
  { x: 'Apr', y: 58000, electronics: 24000, clothing: 15000, books: 10000, home: 9000 },
  { x: 'May', y: 65000, electronics: 27000, clothing: 16000, books: 11000, home: 11000 },
  { x: 'Jun', y: 72000, electronics: 30000, clothing: 18000, books: 12000, home: 12000 },
  { x: 'Jul', y: 78000, electronics: 32000, clothing: 19000, books: 13000, home: 14000 },
  { x: 'Aug', y: 71000, electronics: 29000, clothing: 17000, books: 12000, home: 13000 },
  { x: 'Sep', y: 82000, electronics: 35000, clothing: 20000, books: 13000, home: 14000 },
  { x: 'Oct', y: 89000, electronics: 38000, clothing: 22000, books: 14000, home: 15000 },
  { x: 'Nov', y: 95000, electronics: 42000, clothing: 24000, books: 14000, home: 15000 },
  { x: 'Dec', y: 110000, electronics: 48000, clothing: 28000, books: 16000, home: 18000 },
]

const productSalesSeries = [
  { key: 'electronics', name: 'Electronics', color: '#3B82F6', strokeWidth: 3 },
  { key: 'clothing', name: 'Clothing', color: '#10B981', strokeWidth: 2 },
  { key: 'books', name: 'Books', color: '#F59E0B', strokeWidth: 2 },
  { key: 'home', name: 'Home & Garden', color: '#EF4444', strokeWidth: 2 },
]

// Top products bar chart data
const topProductsData = [
  { category: 'iPhone 15', current: 4200, previous: 3800, target: 4500 },
  { category: 'MacBook', current: 3800, previous: 3500, target: 4000 },
  { category: 'AirPods', current: 3200, previous: 2900, target: 3500 },
  { category: 'iPad Air', current: 2800, previous: 2600, target: 3200 },
  { category: 'Apple Watch', current: 2400, previous: 2200, target: 2800 },
  { category: 'Nike Shoes', current: 2100, previous: 1900, target: 2400 },
]

// Product category distribution
const categoryDistribution = [
  { name: 'Electronics', value: 42, color: '#3B82F6' },
  { name: 'Clothing', value: 28, color: '#10B981' },
  { name: 'Books', value: 15, color: '#F59E0B' },
  { name: 'Home & Garden', value: 15, color: '#EF4444' },
]

// Product performance heatmap data
const productPerformanceData = [
  { x: 'Q1', y: 'Electronics', value: 85 },
  { x: 'Q1', y: 'Clothing', value: 72 },
  { x: 'Q1', y: 'Books', value: 68 },
  { x: 'Q1', y: 'Home & Garden', value: 61 },
  { x: 'Q2', y: 'Electronics', value: 92 },
  { x: 'Q2', y: 'Clothing', value: 78 },
  { x: 'Q2', y: 'Books', value: 71 },
  { x: 'Q2', y: 'Home & Garden', value: 65 },
  { x: 'Q3', y: 'Electronics', value: 88 },
  { x: 'Q3', y: 'Clothing', value: 82 },
  { x: 'Q3', y: 'Books', value: 69 },
  { x: 'Q3', y: 'Home & Garden', value: 70 },
  { x: 'Q4', y: 'Electronics', value: 95 },
  { x: 'Q4', y: 'Clothing', value: 89 },
  { x: 'Q4', y: 'Books', value: 73 },
  { x: 'Q4', y: 'Home & Garden', value: 78 },
]

// Inventory levels data with shorter labels
const inventoryData = [
  { x: 'W1', y: 8500 },
  { x: 'W2', y: 7800 },
  { x: 'W3', y: 7200 },
  { x: 'W4', y: 6800 },
  { x: 'W5', y: 6200 },
  { x: 'W6', y: 5800 },
  { x: 'W7', y: 5200 },
  { x: 'W8', y: 4800 },
  { x: 'W9', y: 4200 },
  { x: 'W10', y: 3800 },
  { x: 'W11', y: 3200 },
  { x: 'W12', y: 2800 },
]

const ProductsPage = () => {
  const [activeMetric, setActiveMetric] = useState('sales')

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
          Product Analytics
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Track product performance, inventory, and customer preferences
        </p>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Total Products</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">1,247</div>
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            +12 new this month
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Avg Order Value</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">$89.32</div>
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            +5.7% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">4.6</div>
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            +0.2 vs last month
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-red-500" />
          </div>
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Cart Conversion</div>
          <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">23.4%</div>
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            -1.2% vs last month
          </div>
        </div>
      </div>

      {/* Product Sales Trends */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Product Sales Trends
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveMetric('sales')}
              className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                activeMetric === 'sales'
                  ? 'bg-blue-100 text-blue-700'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveMetric('revenue')}
              className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                activeMetric === 'revenue'
                  ? 'bg-blue-100 text-blue-700'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Revenue
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full sm:h-[400px]">
          <LineChart
            data={productSalesData}
            series={productSalesSeries}
            title=""
            xAxisLabel="Month"
            yAxisLabel="Sales ($)"
            showGrid={true}
            showLegend={true}
            showDots={true}
            responsive={true}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Top Performing Products
          </h3>

          {/* Custom Product List Instead of Chart */}
          <div className="space-y-4">
            {topProductsData.map((product, index) => {
              const percentage = (product.current / product.target) * 100
              const isAboveTarget = product.current >= product.target

              return (
                <div key={index} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                          index === 0
                            ? 'bg-blue-500'
                            : index === 1
                              ? 'bg-indigo-500'
                              : index === 2
                                ? 'bg-purple-500'
                                : 'bg-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {product.category}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Current: {product.current.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold ${isAboveTarget ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
                      >
                        {percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {product.target.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isAboveTarget ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>

                  {/* Performance vs Previous */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Previous: {product.previous.toLocaleString()}
                    </span>
                    <span
                      className={`font-medium ${
                        product.current > product.previous
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {product.current > product.previous ? '+' : ''}
                      {(((product.current - product.previous) / product.previous) * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Sales by Category
          </h3>
          <div className="flex h-[280px] items-center justify-center sm:h-[350px]">
            <PieChart
              data={categoryDistribution}
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

      {/* Product Performance Heatmap */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Quarterly Performance by Category
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">Performance Score (%)</div>
        </div>

        <div className="overflow-x-auto">
          <HeatMap data={productPerformanceData} title="" />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Inventory Levels */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Inventory Levels Trend
          </h3>
          <div className="h-[300px] w-full">
            <LineChart
              data={inventoryData}
              series={[{ key: 'y', name: 'Stock Level', color: '#EF4444', strokeWidth: 3 }]}
              title=""
              xAxisLabel="Week"
              yAxisLabel="Units in Stock"
              showGrid={true}
              showLegend={false}
              showDots={true}
              responsive={true}
            />
          </div>
          <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-3">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-800">Low Stock Alert</span>
            </div>
            <p className="mt-1 text-sm text-red-700">23 products are running low on inventory</p>
          </div>
        </div>

        {/* Product Insights */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Product Insights
          </h3>

          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800">Best Performer</span>
              </div>
              <p className="mt-1 text-sm text-green-700">
                Electronics category up 35% this quarter
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <div className="flex items-center">
                <Eye className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800">
                  High Views, Low Conversion
                </span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                Home & Garden products need optimization
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800">Customer Favorite</span>
              </div>
              <p className="mt-1 text-sm text-blue-700">iPhone 15 Pro maintains 4.8★ rating</p>
            </div>

            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-800">Trending</span>
              </div>
              <p className="mt-1 text-sm text-purple-700">
                Winter clothing seeing early demand spike
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Quick Actions
            </h4>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">
                Restock Alerts
              </button>
              <button className="rounded-lg bg-green-100 px-3 py-1 text-xs text-green-700 hover:bg-green-200">
                Price Optimize
              </button>
              <button className="rounded-lg bg-purple-100 px-3 py-1 text-xs text-purple-700 hover:bg-purple-200">
                A/B Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
