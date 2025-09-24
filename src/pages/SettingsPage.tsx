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
    generateApiKey
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
    showNotification('Preference saved!');
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

  return (
    <div className="space-y-6">
      <NotificationPopup 
        show={showPopup}
        message={popupMessage}
        onClose={hideNotification}
      />

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
  );
}