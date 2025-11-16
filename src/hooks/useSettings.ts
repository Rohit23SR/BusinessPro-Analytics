// hooks/useSettings.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Integration } from '../types/settings';
import { settingsApiClient } from '../services/apiClient';
import { isApiConfigured } from '../utils/amplifyConfig';

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

// Map backend preferences to frontend settings format
const mapBackendToFrontend = (
  preferences: Record<string, unknown>,
  dashboardConfig: Record<string, unknown>,
  notifications: Record<string, unknown>
): Settings => {
  return {
    // Profile settings
    theme: (preferences.theme as 'light' | 'dark') || 'light',
    language: (preferences.language as 'en' | 'es' | 'fr' | 'de') || 'en',
    timezone: (preferences.timezone as string) || 'UTC',
    currency: (preferences.currency as 'USD' | 'EUR' | 'GBP' | 'JPY') || 'USD',

    // Privacy settings
    analytics: (preferences.privacy as Record<string, boolean>)?.analytics ?? true,
    marketing: (preferences.privacy as Record<string, boolean>)?.marketing ?? false,
    sharing: (preferences.privacy as Record<string, boolean>)?.sharing ?? false,

    // Dashboard settings
    layout: (dashboardConfig.layout as 'grid' | 'list') || 'grid',
    timeframe: (dashboardConfig.defaultTimeframe as string) || '30d',
    autoRefresh: (dashboardConfig.autoRefresh as boolean) ?? true,
    revenueWidget: (dashboardConfig.widgets as Record<string, { enabled: boolean }>)?.revenueChart?.enabled ?? true,
    trafficWidget: (dashboardConfig.widgets as Record<string, { enabled: boolean }>)?.trafficSources?.enabled ?? true,
    conversionsWidget: (dashboardConfig.widgets as Record<string, { enabled: boolean }>)?.kpis?.enabled ?? true,

    // Notification settings
    emailAlerts: (notifications.emailNotifications as Record<string, boolean>)?.alerts ?? true,
    emailReports: (notifications.emailNotifications as Record<string, boolean>)?.weeklyReports ?? false,
    pushAlerts: (notifications.pushNotifications as Record<string, boolean>)?.realTimeAlerts ?? true,
    pushReports: (notifications.pushNotifications as Record<string, boolean>)?.systemUpdates ?? true,
    conversionThreshold: (notifications.alertThresholds as Record<string, number>)?.conversionRateDropPercentage ?? 15,
    trafficThreshold: (notifications.alertThresholds as Record<string, number>)?.trafficDropPercentage ?? 25,

    // API Key (generated locally)
    apiKey: 'sk_live_abc123...xyz789'
  };
};

// Map frontend settings back to backend format
const mapFrontendToBackendPreferences = (
  updatedSettings: Partial<Settings>,
  currentSettings: Settings
) => {
  const prefs: Record<string, unknown> = {};

  if (updatedSettings.theme !== undefined) prefs.theme = updatedSettings.theme;
  if (updatedSettings.language !== undefined) prefs.language = updatedSettings.language;
  if (updatedSettings.timezone !== undefined) prefs.timezone = updatedSettings.timezone;
  if (updatedSettings.currency !== undefined) prefs.currency = updatedSettings.currency;

  if (updatedSettings.analytics !== undefined || updatedSettings.marketing !== undefined || updatedSettings.sharing !== undefined) {
    prefs.privacy = {
      analytics: updatedSettings.analytics ?? currentSettings.analytics,
      marketing: updatedSettings.marketing ?? currentSettings.marketing,
      sharing: updatedSettings.sharing ?? currentSettings.sharing
    };
  }

  return prefs;
};

const mapFrontendToBackendDashboard = (
  updatedSettings: Partial<Settings>,
  currentSettings: Settings
) => {
  const config: Record<string, unknown> = {};

  if (updatedSettings.layout !== undefined) config.layout = updatedSettings.layout;
  if (updatedSettings.timeframe !== undefined) config.defaultTimeframe = updatedSettings.timeframe;
  if (updatedSettings.autoRefresh !== undefined) config.autoRefresh = updatedSettings.autoRefresh;

  if (updatedSettings.revenueWidget !== undefined || updatedSettings.trafficWidget !== undefined || updatedSettings.conversionsWidget !== undefined) {
    config.widgets = {
      kpis: { enabled: updatedSettings.conversionsWidget ?? currentSettings.conversionsWidget, position: 1 },
      revenueChart: { enabled: updatedSettings.revenueWidget ?? currentSettings.revenueWidget, position: 2 },
      trafficSources: { enabled: updatedSettings.trafficWidget ?? currentSettings.trafficWidget, position: 3 },
      recentActivity: { enabled: true, position: 4 },
      topProducts: { enabled: true, position: 5 }
    };
  }

  return config;
};

const mapFrontendToBackendNotifications = (
  updatedSettings: Partial<Settings>,
  currentSettings: Settings
) => {
  const notifs: Record<string, unknown> = {};

  if (updatedSettings.emailAlerts !== undefined || updatedSettings.emailReports !== undefined) {
    notifs.emailNotifications = {
      dailyReports: false,
      weeklyReports: updatedSettings.emailReports ?? currentSettings.emailReports,
      monthlyReports: true,
      alerts: updatedSettings.emailAlerts ?? currentSettings.emailAlerts,
      promotions: false
    };
  }

  if (updatedSettings.pushAlerts !== undefined || updatedSettings.pushReports !== undefined) {
    notifs.pushNotifications = {
      realTimeAlerts: updatedSettings.pushAlerts ?? currentSettings.pushAlerts,
      systemUpdates: updatedSettings.pushReports ?? currentSettings.pushReports,
      newFeatures: false
    };
  }

  if (updatedSettings.conversionThreshold !== undefined || updatedSettings.trafficThreshold !== undefined) {
    notifs.alertThresholds = {
      revenueDropPercentage: 10,
      conversionRateDropPercentage: updatedSettings.conversionThreshold ?? currentSettings.conversionThreshold,
      trafficDropPercentage: updatedSettings.trafficThreshold ?? currentSettings.trafficThreshold
    };
  }

  return notifs;
};

export const useSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const useBackendApi = isApiConfigured();

  // Fetch preferences from backend
  const preferencesQuery = useQuery({
    queryKey: ['settings', 'preferences'],
    queryFn: () => settingsApiClient.getPreferences(),
    enabled: useBackendApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch dashboard config from backend
  const dashboardConfigQuery = useQuery({
    queryKey: ['settings', 'dashboard-config'],
    queryFn: () => settingsApiClient.getDashboardConfig(),
    enabled: useBackendApi,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch notification settings from backend
  const notificationsQuery = useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: () => settingsApiClient.getNotifications(),
    enabled: useBackendApi,
    staleTime: 5 * 60 * 1000,
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (prefs: Record<string, unknown>) => settingsApiClient.updatePreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'preferences'] });
    },
  });

  // Update dashboard config mutation
  const updateDashboardMutation = useMutation({
    mutationFn: (config: Record<string, unknown>) => settingsApiClient.updateDashboardConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'dashboard-config'] });
    },
  });

  // Update notifications mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: (notifs: Record<string, unknown>) => settingsApiClient.updateNotifications(notifs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'notifications'] });
    },
  });

  // Sync backend data to local state when queries complete
  useEffect(() => {
    if (
      useBackendApi &&
      preferencesQuery.data &&
      dashboardConfigQuery.data &&
      notificationsQuery.data
    ) {
      const mappedSettings = mapBackendToFrontend(
        preferencesQuery.data.data,
        dashboardConfigQuery.data.data,
        notificationsQuery.data.data
      );
      setSettings(prev => ({ ...prev, ...mappedSettings }));
    }
  }, [
    useBackendApi,
    preferencesQuery.data,
    dashboardConfigQuery.data,
    notificationsQuery.data
  ]);

  const updateSetting = useCallback(<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): void => {
    // Optimistic update - update local state immediately
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);

    // Save to backend if configured
    if (useBackendApi) {
      setIsSaving(true);

      const updatedSettings = { [key]: value };

      // Determine which backend endpoint to call based on the setting key
      const preferencesKeys = ['theme', 'language', 'timezone', 'currency', 'analytics', 'marketing', 'sharing'];
      const dashboardKeys = ['layout', 'timeframe', 'autoRefresh', 'revenueWidget', 'trafficWidget', 'conversionsWidget'];
      const notificationKeys = ['emailAlerts', 'emailReports', 'pushAlerts', 'pushReports', 'conversionThreshold', 'trafficThreshold'];

      const promises: Promise<unknown>[] = [];

      if (preferencesKeys.includes(key as string)) {
        const backendData = mapFrontendToBackendPreferences(updatedSettings, newSettings);
        if (Object.keys(backendData).length > 0) {
          promises.push(updatePreferencesMutation.mutateAsync(backendData));
        }
      }

      if (dashboardKeys.includes(key as string)) {
        const backendData = mapFrontendToBackendDashboard(updatedSettings, newSettings);
        if (Object.keys(backendData).length > 0) {
          promises.push(updateDashboardMutation.mutateAsync(backendData));
        }
      }

      if (notificationKeys.includes(key as string)) {
        const backendData = mapFrontendToBackendNotifications(updatedSettings, newSettings);
        if (Object.keys(backendData).length > 0) {
          promises.push(updateNotificationsMutation.mutateAsync(backendData));
        }
      }

      // Ensure minimum display time of 1.2 seconds for the saving indicator
      const startTime = Date.now();
      const minDisplayTime = 1200;

      // Clear any previous error
      setSaveError(null);
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      Promise.all(promises)
        .then(() => {
          // Success - clear any error
          setSaveError(null);
        })
        .catch(error => {
          console.error('Failed to save setting:', error);
          // Show error message
          setSaveError('Failed to save. Please try again.');
          // Revert on error - refetch from backend
          queryClient.invalidateQueries({ queryKey: ['settings'] });

          // Clear error after 4 seconds
          errorTimeoutRef.current = setTimeout(() => {
            setSaveError(null);
          }, 4000);
        })
        .finally(() => {
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsed);

          // Clear any existing timeout
          if (savingTimeoutRef.current) {
            clearTimeout(savingTimeoutRef.current);
          }

          // Hide saving indicator after minimum time
          savingTimeoutRef.current = setTimeout(() => {
            setIsSaving(false);
          }, remainingTime);
        });
    }
  }, [useBackendApi, settings, updatePreferencesMutation, updateDashboardMutation, updateNotificationsMutation, queryClient]);

  const resetSettings = useCallback((): void => {
    setSettings(DEFAULT_SETTINGS);

    if (useBackendApi) {
      setIsSaving(true);

      Promise.all([
        updatePreferencesMutation.mutateAsync({
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          currency: 'USD',
          privacy: { analytics: true, marketing: false, sharing: false }
        }),
        updateDashboardMutation.mutateAsync({
          layout: 'grid',
          defaultTimeframe: '30d',
          autoRefresh: true,
          widgets: {
            kpis: { enabled: true, position: 1 },
            revenueChart: { enabled: true, position: 2 },
            trafficSources: { enabled: true, position: 3 },
            recentActivity: { enabled: true, position: 4 },
            topProducts: { enabled: true, position: 5 }
          }
        }),
        updateNotificationsMutation.mutateAsync({
          emailNotifications: {
            dailyReports: false,
            weeklyReports: false,
            monthlyReports: true,
            alerts: true,
            promotions: false
          },
          pushNotifications: {
            realTimeAlerts: true,
            systemUpdates: true,
            newFeatures: false
          },
          alertThresholds: {
            revenueDropPercentage: 10,
            conversionRateDropPercentage: 15,
            trafficDropPercentage: 25
          }
        })
      ])
        .catch(error => console.error('Failed to reset settings:', error))
        .finally(() => setIsSaving(false));
    }
  }, [useBackendApi, updatePreferencesMutation, updateDashboardMutation, updateNotificationsMutation]);

  const toggleIntegration = useCallback((name: string): void => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.name === name
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
    // Note: Integration state could be saved to backend in future
  }, []);

  const generateApiKey = useCallback((): void => {
    const newKey = `sk_live_${Math.random().toString(36).substr(2, 8)}...${Math.random().toString(36).substr(2, 6)}`;
    setSettings(prev => ({ ...prev, apiKey: newKey }));
    // Note: API key generation should be done on backend in production
  }, []);

  const isLoading = useBackendApi && (
    preferencesQuery.isLoading ||
    dashboardConfigQuery.isLoading ||
    notificationsQuery.isLoading
  );

  const isError = useBackendApi && (
    preferencesQuery.isError ||
    dashboardConfigQuery.isError ||
    notificationsQuery.isError
  );

  return {
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
  };
};
