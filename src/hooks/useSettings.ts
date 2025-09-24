// hooks/useSettings.ts
import { useState, useCallback } from 'react';
import { Settings, Integration } from '../types/settings';

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  currency: 'USD',
  analytics: true,
  marketing: false,
  sharing: false,
  layout: 'grid',
  timeframe: '30d',
  autoRefresh: true,
  revenueWidget: true,
  trafficWidget: true,
  conversionsWidget: false,
  emailAlerts: true,
  emailReports: false,
  pushAlerts: true,
  pushReports: true,
  conversionThreshold: 15,
  trafficThreshold: 25,
  apiKey: 'sk_live_abc123...xyz789'
};

const DEFAULT_INTEGRATIONS: Integration[] = [
  { name: 'Google Analytics', connected: true, icon: '📊' },
  { name: 'Stripe', connected: true, icon: '💳' },
  { name: 'Salesforce', connected: false, icon: '☁️' },
  { name: 'HubSpot', connected: false, icon: '🎯' },
  { name: 'Mailchimp', connected: true, icon: '📧' },
  { name: 'Shopify', connected: false, icon: '🛒' }
];

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS);

  const updateSetting = useCallback(<K extends keyof Settings>(
    key: K, 
    value: Settings[K]
  ): void => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetSettings = useCallback((): void => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const toggleIntegration = useCallback((name: string): void => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.name === name 
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  }, []);

  const generateApiKey = useCallback((): void => {
    const newKey = `sk_live_${Math.random().toString(36).substr(2, 8)}...${Math.random().toString(36).substr(2, 6)}`;
    setSettings(prev => ({ ...prev, apiKey: newKey }));
  }, []);

  return {
    settings,
    integrations,
    updateSetting,
    resetSettings,
    toggleIntegration,
    generateApiKey
  };
};