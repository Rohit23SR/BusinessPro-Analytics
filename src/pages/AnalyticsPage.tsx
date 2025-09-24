// Analytics page with tab navigation
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Filter, Download, Calendar } from 'lucide-react';
import { useUrlFilters } from '../hooks/useNavigation';
import { useAnalyticsFilters } from '../hooks/useAnalytics';



const AnalyticsPage = () => {
  const location = useLocation();
  const { filters, updateFilters } = useUrlFilters();
  const [showFilters, setShowFilters] = useState(false);
  
  const analyticsFilters = useAnalyticsFilters();

  const tabs = [
    { id: 'overview', name: 'Overview', path: '/dashboard/analytics' },
    { id: 'traffic', name: 'Traffic', path: '/dashboard/analytics/traffic' },
    { id: 'behavior', name: 'User Behavior', path: '/dashboard/analytics/behavior' },
    { id: 'conversions', name: 'Conversions', path: '/dashboard/analytics/conversions' },
  ];

  const timeframeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '6m', label: 'Last 6 months' },
    { value: '12m', label: 'Last 12 months' },
  ];

  const trafficSources = ['All Sources', 'Organic Search', 'Paid Search', 'Social Media', 'Direct', 'Email'];
  const deviceTypes = ['All Devices', 'Desktop', 'Mobile', 'Tablet'];
  const geographies = ['All Locations', 'United States', 'Europe', 'Asia Pacific', 'Other'];

  const handleExport = async () => {
    // Simulate export
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Deep dive into your business performance with advanced analytics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Time Period */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Time Period</label>
              <select
                value={filters.timeframe}
                onChange={(e) => updateFilters({ timeframe: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              <label className="block text-xs font-medium text-gray-500 mb-1">Traffic Source</label>
              <select
                value={filters.trafficSource}
                onChange={(e) => updateFilters({ trafficSource: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              <label className="block text-xs font-medium text-gray-500 mb-1">Device Type</label>
              <select
                value={filters.deviceType}
                onChange={(e) => updateFilters({ deviceType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              <label className="block text-xs font-medium text-gray-500 mb-1">Geography</label>
              <select
                value={filters.geography}
                onChange={(e) => updateFilters({ geography: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path || 
                             (tab.id === 'overview' && location.pathname === '/dashboard/analytics');
              
              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;