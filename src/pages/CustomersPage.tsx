// Customer Management Dashboard
import { Users, UserPlus, Mail, Phone, Star, TrendingUp, TrendingDown, Calendar, DollarSign, Target } from 'lucide-react';
import { useState } from 'react';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import AreaChart from '../components/charts/AreaChart';
import HeatMap from '../components/charts/HeatMap';

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
  { x: 'Dec', y: 2387, organic: 1195, paid: 715, referral: 295, social: 182 }
];

const acquisitionSeries = [
  { key: 'organic', name: 'Organic Search', color: '#10B981', strokeWidth: 3 },
  { key: 'paid', name: 'Paid Ads', color: '#3B82F6', strokeWidth: 2 },
  { key: 'referral', name: 'Referrals', color: '#F59E0B', strokeWidth: 2 },
  { key: 'social', name: 'Social Media', color: '#EF4444', strokeWidth: 2 }
];

// Customer segments data
const customerSegmentsData = [
  { category: 'VIP Customers', current: 850, previous: 780, target: 900 },
  { category: 'Regular', current: 3200, previous: 2950, target: 3500 },
  { category: 'New Users', current: 2400, previous: 2200, target: 2600 },
  { category: 'At Risk', current: 1200, previous: 1350, target: 800 },
  { category: 'Inactive', current: 950, previous: 1100, target: 600 }
];

// Customer lifetime value distribution
const clvDistribution = [
  { name: 'High Value ($500+)', value: 15, color: '#10B981' },
  { name: 'Medium Value ($100-$499)', value: 35, color: '#3B82F6' },
  { name: 'Low Value ($50-$99)', value: 30, color: '#F59E0B' },
  { name: 'New Customers (<$50)', value: 20, color: '#6B7280' }
];

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
  { x: 'In-App', y: 'At Risk', value: 40 }
];

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
  { x: 'Month 12', y: 3890 }
];

const CustomersPage = () => {
  const [activeSegment, setActiveSegment] = useState('all');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600">Manage your customer base and analyze customer behavior</p>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Customers</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">12,847</div>
          <div className="text-sm font-medium text-green-600">+8.2% vs last month</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">New This Month</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">2,387</div>
          <div className="text-sm font-medium text-green-600">+15.3% vs last month</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">Active Rate</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">67.3%</div>
          <div className="text-sm font-medium text-red-600">-2.1% vs last month</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-sm text-gray-600 mb-1">Avg CLV</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">$1,247</div>
          <div className="text-sm font-medium text-green-600">+12.4% vs last month</div>
        </div>
      </div>

      {/* Customer Acquisition Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Customer Acquisition Trends</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveSegment('all')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                activeSegment === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Channels
            </button>
            <button 
              onClick={() => setActiveSegment('organic')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                activeSegment === 'organic' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Organic Only
            </button>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
          <LineChart 
            data={customerAcquisitionData}
            series={acquisitionSeries}
            title=""
            xAxisLabel="Month"
            yAxisLabel="New Customers"
            width="100%"
            height={400}
            showGrid={true}
            showLegend={true}
            showDots={true}
            responsive={true}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
          
          <div className="space-y-4">
            {customerSegmentsData.map((segment, index) => {
              const percentage = segment.target > 0 ? ((segment.current / segment.target) * 100) : 0;
              const growth = ((segment.current - segment.previous) / segment.previous * 100);
              const isGrowing = growth > 0;
              
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-gray-500'];
              
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${colors[index]} rounded-full mr-3`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{segment.category}</div>
                        <div className="text-sm text-gray-500">{segment.current.toLocaleString()} customers</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {percentage.toFixed(1)}%
                      </div>
                      <div className={`text-sm font-medium ${isGrowing ? 'text-green-600' : 'text-red-600'}`}>
                        {isGrowing ? '+' : ''}{growth.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index]}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Lifetime Value Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Lifetime Value</h3>
          <div style={{ height: '350px' }} className="flex items-center justify-center">
            <PieChart 
              data={clvDistribution}
              width={350}
              height={350}
              showLabels={true}
              showLegend={true}
              animate={true}
              innerRadius={60}
            />
          </div>
        </div>
      </div>

      {/* Customer Engagement Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Engagement by Channel & Segment</h3>
          <div className="text-sm text-gray-600">Engagement Rate (%)</div>
        </div>
        
        <HeatMap 
          data={engagementHeatmapData}
          width={600}
          height={300}
          title=""
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Retention Curve */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">12-Month Retention Curve</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <LineChart 
              data={retentionData}
              series={[{ key: 'y', name: 'Active Customers', color: '#3B82F6', strokeWidth: 3 }]}
              title=""
              xAxisLabel="Months Since Signup"
              yAxisLabel="Active Customers"
              width="100%"
              height={300}
              showGrid={true}
              showLegend={false}
              showDots={true}
              responsive={true}
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-center">
              <Target className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">12-Month Retention Rate</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">45.8% of customers remain active after one year</p>
          </div>
        </div>

        {/* Customer Insights & Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">High Organic Growth</span>
              </div>
              <p className="text-sm text-green-700 mt-1">Organic acquisition up 22% this quarter</p>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Email Engagement Down</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">Email open rates dropped 5% - review content strategy</p>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">VIP Segment Growing</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">High-value customers increased 9% this month</p>
            </div>

            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">At-Risk Customers</span>
              </div>
              <p className="text-sm text-red-700 mt-1">1,200 customers haven't engaged in 30+ days</p>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                Launch re-engagement campaign for at-risk customers
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                Create VIP loyalty program expansion
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                A/B test email subject lines and timing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;