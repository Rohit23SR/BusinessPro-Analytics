// components/settings/NotificationsTab.tsx
import { Settings } from '../../types/settings';

interface NotificationsTabProps {
  settings: Settings;
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function NotificationsTab({ settings, onSettingChange }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Email Notifications</h4>
          <div className="space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={settings.emailAlerts}
                onChange={(e) => onSettingChange('emailAlerts', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700">Alerts</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={settings.emailReports}
                onChange={(e) => onSettingChange('emailReports', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700">Reports</span>
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Push Notifications</h4>
          <div className="space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={settings.pushAlerts}
                onChange={(e) => onSettingChange('pushAlerts', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700">Alerts</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={settings.pushReports}
                onChange={(e) => onSettingChange('pushReports', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700">Reports</span>
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Alert Thresholds</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion Drop %
              </label>
              <input 
                type="number"
                value={settings.conversionThreshold}
                onChange={(e) => onSettingChange('conversionThreshold', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Traffic Drop %
              </label>
              <input 
                type="number"
                value={settings.trafficThreshold}
                onChange={(e) => onSettingChange('trafficThreshold', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}