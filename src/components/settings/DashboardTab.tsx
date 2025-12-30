// components/settings/DashboardTab.tsx
import { Settings } from '../../types/settings';

interface DashboardTabProps {
  settings: Settings;
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function DashboardTab({ settings, onSettingChange }: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dashboard Configuration</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Layout
          </label>
          <select
            value={settings.layout}
            onChange={(e) => onSettingChange('layout', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Time Range
          </label>
          <select
            value={settings.timeframe}
            onChange={(e) => onSettingChange('timeframe', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.autoRefresh}
            onChange={(e) => onSettingChange('autoRefresh', e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Auto-refresh data every 30 seconds</span>
        </label>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">Widget Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.revenueWidget}
              onChange={(e) => onSettingChange('revenueWidget', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Revenue</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.trafficWidget}
              onChange={(e) => onSettingChange('trafficWidget', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Traffic</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.conversionsWidget}
              onChange={(e) => onSettingChange('conversionsWidget', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Conversions</span>
          </label>
        </div>
      </div>
    </div>
  );
}