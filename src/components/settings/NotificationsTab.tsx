// components/settings/NotificationsTab.tsx
import { useState, useEffect, useRef } from 'react';
import { Settings } from '../../types/settings';

interface NotificationsTabProps {
  settings: Settings;
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function NotificationsTab({ settings, onSettingChange }: NotificationsTabProps) {
  // Local state for threshold inputs to enable debouncing
  const [conversionValue, setConversionValue] = useState(settings.conversionThreshold);
  const [trafficValue, setTrafficValue] = useState(settings.trafficThreshold);
  const conversionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trafficTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with props when settings change from backend
  useEffect(() => {
    setConversionValue(settings.conversionThreshold);
    setTrafficValue(settings.trafficThreshold);
  }, [settings.conversionThreshold, settings.trafficThreshold]);

  // Debounced save for conversion threshold
  const handleConversionChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setConversionValue(numValue);

    if (conversionTimeoutRef.current) {
      clearTimeout(conversionTimeoutRef.current);
    }

    conversionTimeoutRef.current = setTimeout(() => {
      onSettingChange('conversionThreshold', numValue);
    }, 800);
  };

  // Debounced save for traffic threshold
  const handleTrafficChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setTrafficValue(numValue);

    if (trafficTimeoutRef.current) {
      clearTimeout(trafficTimeoutRef.current);
    }

    trafficTimeoutRef.current = setTimeout(() => {
      onSettingChange('trafficThreshold', numValue);
    }, 800);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (conversionTimeoutRef.current) clearTimeout(conversionTimeoutRef.current);
      if (trafficTimeoutRef.current) clearTimeout(trafficTimeoutRef.current);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-500 mt-1">
          Control how and when you receive notifications about your business metrics
        </p>
      </div>

      {/* Email Notifications Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-xl">📧</span>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900">Email Notifications</h4>
            <p className="text-xs text-gray-500">Receive updates in your inbox</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Critical Alerts</p>
              <p className="text-xs text-gray-500">Get notified about urgent issues immediately</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={(e) => onSettingChange('emailAlerts', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Weekly Reports</p>
              <p className="text-xs text-gray-500">Summary of your weekly performance metrics</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailReports}
              onChange={(e) => onSettingChange('emailReports', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Push Notifications Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-xl">🔔</span>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900">Push Notifications</h4>
            <p className="text-xs text-gray-500">Real-time alerts on your device</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Real-time Alerts</p>
              <p className="text-xs text-gray-500">Instant notifications for important events</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushAlerts}
              onChange={(e) => onSettingChange('pushAlerts', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">System Updates</p>
              <p className="text-xs text-gray-500">New features and platform updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushReports}
              onChange={(e) => onSettingChange('pushReports', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Alert Thresholds Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900">Alert Thresholds</h4>
            <p className="text-xs text-gray-500">Set when you want to be notified about metric changes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Conversion Rate Drop
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={conversionValue}
                onChange={(e) => handleConversionChange(e.target.value)}
                min="1"
                max="100"
                className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
              />
              <span className="ml-2 text-sm text-gray-600">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Alert when conversion drops by this percentage</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Traffic Drop
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={trafficValue}
                onChange={(e) => handleTrafficChange(e.target.value)}
                min="1"
                max="100"
                className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
              />
              <span className="ml-2 text-sm text-gray-600">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Alert when traffic drops by this percentage</p>
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900">Notification History</h4>
              <p className="text-xs text-gray-500">View your recent notifications</p>
            </div>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View All
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 text-center py-4">
            No recent notifications
          </p>
        </div>
      </div>
    </div>
  );
}

