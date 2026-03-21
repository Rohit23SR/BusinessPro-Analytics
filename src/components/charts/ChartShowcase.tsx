// Chart showcase component to demonstrate all chart types
import { useState } from 'react'
import { LineChart, PieChart, BarChart, AreaChart } from './index'

const ChartShowcase = () => {
  const [activeChart, setActiveChart] = useState('line')

  // Sample data for demonstrations
  const lineData = [
    { x: 'Jan', revenue: 65000, customers: 1200, orders: 890 },
    { x: 'Feb', revenue: 72000, customers: 1350, orders: 920 },
    { x: 'Mar', revenue: 68000, customers: 1180, orders: 850 },
    { x: 'Apr', revenue: 85000, customers: 1580, orders: 1100 },
    { x: 'May', revenue: 92000, customers: 1720, orders: 1250 },
    { x: 'Jun', revenue: 124563, customers: 1890, orders: 1430 },
  ]

  const pieData = [
    { name: 'Organic Search', value: 45, color: '#6366f1' },
    { name: 'Direct', value: 25, color: '#8b5cf6' },
    { name: 'Social Media', value: 18, color: '#06b6d4' },
    { name: 'Email', value: 12, color: '#10b981' },
  ]

  const barData = [
    { category: 'Sales', current: 7200, previous: 6800, target: 8000 },
    { category: 'Marketing', current: 5100, previous: 4600, target: 5500 },
    { category: 'Support', current: 3400, previous: 3100, target: 3800 },
  ]

  const areaData = [
    { x: 'Mon', y: 2400 },
    { x: 'Tue', y: 1398 },
    { x: 'Wed', y: 9800 },
    { x: 'Thu', y: 3908 },
    { x: 'Fri', y: 4800 },
    { x: 'Sat', y: 3800 },
    { x: 'Sun', y: 4300 },
  ]

  const charts = [
    { id: 'line', name: 'Line Chart', icon: '📈' },
    { id: 'pie', name: 'Pie Chart', icon: '🥧' },
    { id: 'bar', name: 'Bar Chart', icon: '📊' },
    { id: 'area', name: 'Area Chart', icon: '📉' },
  ]

  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <LineChart
            data={lineData}
            height={350}
            xKey="x"
            yKeys={['revenue', 'customers', 'orders']}
            colors={['#6366f1', '#10b981', '#f59e0b']}
            showGrid={true}
            showDots={true}
            showLegend={true}
            animate={true}
          />
        )
      case 'pie':
        return (
          <div className="flex justify-center">
            <PieChart
              data={pieData}
              width={400}
              height={350}
              showLabels={true}
              showLegend={true}
              animate={true}
            />
          </div>
        )
      case 'bar':
        return (
          <BarChart
            data={barData}
            height={350}
            categoryKey="category"
            valueKeys={['current', 'previous', 'target']}
            colors={['#6366f1', '#8b5cf6', '#06b6d4']}
            showGrid={true}
            showLegend={true}
            animate={true}
          />
        )
      case 'area':
        return (
          <AreaChart
            data={areaData}
            height={350}
            xKey="x"
            yKey="y"
            gradientColors={['#6366f1', '#e0e7ff']}
            strokeColor="#6366f1"
            showGrid={true}
            showDots={true}
            animate={true}
            curve="monotone"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex justify-center">
        <div className="inline-flex space-x-1 rounded-lg border border-gray-200 bg-white p-2">
          {charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeChart === chart.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{chart.icon}</span>
              <span>{chart.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {charts.find((c) => c.id === activeChart)?.name} Demonstration
          </h3>
          <p className="text-sm text-gray-600">
            Interactive {activeChart} chart with hover effects, animations, and responsive design
          </p>
        </div>

        <div className="flex min-h-[350px] items-center justify-center">{renderChart()}</div>
      </div>

      {/* Chart Features */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="mb-2 text-2xl">🎨</div>
          <div className="mb-1 font-medium text-gray-900">Customizable</div>
          <div className="text-sm text-gray-600">Colors, styles, and themes</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="mb-2 text-2xl">📱</div>
          <div className="mb-1 font-medium text-gray-900">Responsive</div>
          <div className="text-sm text-gray-600">Works on all screen sizes</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="mb-2 text-2xl">⚡</div>
          <div className="mb-1 font-medium text-gray-900">Interactive</div>
          <div className="text-sm text-gray-600">Hover effects and tooltips</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="mb-2 text-2xl">🎬</div>
          <div className="mb-1 font-medium text-gray-900">Animated</div>
          <div className="text-sm text-gray-600">Smooth entry animations</div>
        </div>
      </div>
    </div>
  )
}

export default ChartShowcase
