// pages/SettingsPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useNotification } from '../hooks/useNotification';
import { exportSettingsJSON, exportSettingsCSV } from '../utils/settingsUtils';
import { SETTINGS_TABS } from '../constants/settingsConstants';

// Components
import NotificationPopup from '../components/ui/NotificationPopup';
import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import ProfileTab from '../components/settings/ProfileTab';
import DashboardTab from '../components/settings/DashboardTab';
import NotificationsTab from '../components/settings/NotificationsTab';
import IntegrationsTab from '../components/settings/IntegrationsTab';

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const {
    settings,
    integrations,
    updateSetting,
    resetSettings,
    toggleIntegration,
    generateApiKey,
    isLoading,
    isSaving,
    isError,
    saveError
  } = useSettings();

  const { showPopup, popupMessage, showNotification, hideNotification } = useNotification();

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Sync tab with URL parameter on mount and when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && SETTINGS_TABS.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleSettingChange = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ): void => {
    updateSetting(key, value);
  };

  const handleReset = (): void => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
      showNotification('Settings reset to defaults!');
    }
  };

  const handleExportJSON = (): void => {
    exportSettingsJSON(settings);
    showNotification('Settings exported successfully!');
  };

  const handleExportCSV = (): void => {
    exportSettingsCSV(settings);
    showNotification('CSV export completed!');
  };

  const handleDataImport = (): void => {
    // Simulate importing sample data
    const sampleData = {
      theme: 'dark' as const,
      language: 'es' as const,
      timezone: 'UTC-5' as const,
      currency: 'EUR' as const,
      analytics: false,
      marketing: true,
      layout: 'list' as const,
      autoRefresh: false,
      conversionThreshold: 20,
      trafficThreshold: 30
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      updateSetting(key as keyof typeof settings, value);
    });
    
    showNotification('Sample data imported successfully!');
  };

  const handleIntegrationAction = (name: string): void => {
    const integration = integrations.find(i => i.name === name);
    const action = integration?.connected ? 'disconnected' : 'connected';
    
    toggleIntegration(name);
    showNotification(`${name} ${action} successfully!`);
  };

  const handleApiKeyGeneration = (): void => {
    generateApiKey();
    showNotification('New API key generated!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        );
      case 'dashboard':
        return (
          <DashboardTab 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        );
      case 'notifications':
        return (
          <NotificationsTab 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        );
      case 'integrations':
        return (
          <IntegrationsTab
            integrations={integrations}
            settings={settings}
            onIntegrationToggle={handleIntegrationAction}
            onApiKeyGenerate={handleApiKeyGeneration}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            onImportData={handleDataImport}
          />
        );
      default:
        return (
          <ProfileTab 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load settings from server</p>
          <p className="text-gray-500 text-sm">Using local settings instead</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed position indicators - outside main flow */}
      <NotificationPopup
        show={showPopup}
        message={popupMessage}
        onClose={hideNotification}
      />

      {isSaving && (
        <div className="fixed top-20 right-6 z-[100] bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 pointer-events-none">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm font-medium">Saving...</span>
        </div>
      )}

      {saveError && !isSaving && (
        <div className="fixed top-20 right-6 z-[100] bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{saveError}</span>
        </div>
      )}

      <div className="space-y-6">
        <SettingsHeader
        onExport={handleExportJSON}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SettingsSidebar
            tabs={SETTINGS_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
