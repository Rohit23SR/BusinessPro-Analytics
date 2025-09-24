// Settings page with tabbed interface
import { useState } from 'react';
import { Save, RefreshCw, Download, Upload } from 'lucide-react';
import { 
  useAllSettings,
  useUpdateUserPreferences,
  useUpdateDashboardConfig,
  useUpdateNotificationSettings,
  useResetSettings,
  useExportSettings
} from '../hooks/useSettings';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);

  const { preferences, dashboard, notifications, isLoading } = useAllSettings();
  
  const updatePreferences = useUpdateUserPreferences();
  const updateDashboard = useUpdateDashboardConfig();
  const updateNotifications = useUpdateNotificationSettings();
  const resetSettings = useResetSettings();
  const exportSettings = useExportSettings();

  const tabs = [
    { id: 'profile', name: 'Profile & Account', icon: '👤' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
  ];

  const handleSave = async () => {
    try {
      // Save changes based on active tab
      console.log('Saving settings...');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      await resetSettings.mutateAsync('all');
    }
  };

  const handleExport = async () => {
    await exportSettings.mutateAsync('json');
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading settings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and dashboard configuration</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            disabled={exportSettings.isPending}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          
          <button
            onClick={handleReset}
            disabled={resetSettings.isPending}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${resetSettings.isPending ? 'animate-spin' : ''}`} />
            Reset
          </button>
          
          {hasChanges && (
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3 text-base">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Profile & Account Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile & Account</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme Preference
                    </label>
                    <select 
                      defaultValue={preferences.data?.theme}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select 
                      defaultValue={preferences.data?.language}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select 
                      defaultValue={preferences.data?.timezone}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="UTC-5">Eastern Time</option>
                      <option value="UTC-8">Pacific Time</option>
                      <option value="UTC+1">Central European Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select 
                      defaultValue={preferences.data?.currency}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Privacy Settings</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={preferences.data?.privacy.analytics}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Allow analytics data collection</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={preferences.data?.privacy.marketing}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Receive marketing communications</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={preferences.data?.privacy.sharing}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Allow data sharing with partners</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Dashboard Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Layout
                    </label>
                    <select 
                      defaultValue={dashboard.data?.layout}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="grid">Grid View</option>
                      <option value="list">List View</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Time Range
                    </label>
                    <select 
                      defaultValue={dashboard.data?.defaultTimeframe}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      defaultChecked={dashboard.data?.autoRefresh}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Auto-refresh data every 30 seconds</span>
                  </label>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Widget Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(dashboard.data?.widgets || {}).map(([key, widget]) => (
                      <label key={key} className="flex items-center">
                        <input 
                          type="checkbox" 
                          defaultChecked={widget.enabled}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Email Notifications</h4>
                    <div className="space-y-4">
                      {Object.entries(notifications.data?.emailNotifications || {}).map(([key, value]) => (
                        <label key={key} className="flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={value}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Push Notifications</h4>
                    <div className="space-y-4">
                      {Object.entries(notifications.data?.pushNotifications || {}).map(([key, value]) => (
                        <label key={key} className="flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={value}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Alert Thresholds</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conversion Drop %
                        </label>
                        <input 
                          type="number"
                          defaultValue={notifications.data?.alertThresholds.conversionRateDropPercentage}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Traffic Drop %
                        </label>
                        <input 
                          type="number"
                          defaultValue={notifications.data?.alertThresholds.trafficDropPercentage}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Integrations & Data Sources</h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Google Analytics', status: 'connected', icon: '📊', color: 'text-green-600' },
                    { name: 'Stripe', status: 'connected', icon: '💳', color: 'text-green-600' },
                    { name: 'Salesforce', status: 'disconnected', icon: '☁️', color: 'text-gray-400' },
                    { name: 'HubSpot', status: 'disconnected', icon: '🎯', color: 'text-gray-400' },
                    { name: 'Mailchimp', status: 'connected', icon: '📧', color: 'text-green-600' },
                    { name: 'Shopify', status: 'disconnected', icon: '🛒', color: 'text-gray-400' }
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4">{integration.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{integration.name}</div>
                          <div className={`text-sm ${integration.color}`}>
                            {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                          </div>
                        </div>
                      </div>
                      <button className={`px-4 py-2 text-sm rounded-lg font-medium ${
                        integration.status === 'connected' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}>
                        {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">API Configuration</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">API Key</span>
                      <button className="text-sm text-indigo-600 hover:text-indigo-700">Generate New</button>
                    </div>
                    <div className="font-mono text-sm bg-white p-3 rounded border">
                      sk_live_abc123...xyz789
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Data Export</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
                      <Download className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Export CSV</span>
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
                      <Download className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Export JSON</span>
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
                      <Upload className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-sm font-medium">Import Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;