// Custom hooks for settings management using TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { queryKeys } from '../utils/queryClient';
import type { UserPreferences, DashboardConfig, NotificationConfig } from '../types';

// Hook for user preferences
export const useUserPreferences = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.settings.preferences(),
    queryFn: async () => {
      const response = await api.settings.getUserPreferences();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - preferences don't change often
    enabled: options?.enabled,
  });
};

// Hook for dashboard configuration
export const useDashboardConfig = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.settings.dashboard(),
    queryFn: async () => {
      const response = await api.settings.getDashboardConfig();
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: options?.enabled,
  });
};

// Hook for notification settings
export const useNotificationSettings = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.settings.notifications(),
    queryFn: async () => {
      const response = await api.settings.getNotificationSettings();
      return response.data;
    },
    staleTime: 8 * 60 * 1000, // 8 minutes
    enabled: options?.enabled,
  });
};

// Mutation hook for updating user preferences
export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: Partial<UserPreferences>) => {
      const response = await api.settings.updateUserPreferences(preferences);
      return response.data;
    },
    onSuccess: (updatedPreferences) => {
      // Update the cache with new data
      queryClient.setQueryData(
        queryKeys.settings.preferences(),
        updatedPreferences
      );

      // Show success message (in a real app, you might use a toast notification)
      console.log('User preferences updated successfully');

      // If theme changed, you might want to invalidate UI-related queries
      if (updatedPreferences.theme) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.all
        });
      }
    },
    onError: (error) => {
      console.error('Failed to update user preferences:', error);
    },
  });
};

// Mutation hook for updating dashboard configuration
export const useUpdateDashboardConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<DashboardConfig>) => {
      const response = await api.settings.updateDashboardConfig(config);
      return response.data;
    },
    onSuccess: (updatedConfig) => {
      // Update the cache
      queryClient.setQueryData(
        queryKeys.settings.dashboard(),
        updatedConfig
      );

      // If widgets configuration changed, refresh dashboard data
      if (updatedConfig.widgets) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.all
        });
      }

      console.log('Dashboard configuration updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update dashboard configuration:', error);
    },
  });
};

// Mutation hook for updating notification settings
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<NotificationConfig>) => {
      const response = await api.settings.updateNotificationSettings(settings);
      return response.data;
    },
    onSuccess: (updatedSettings) => {
      // Update the cache
      queryClient.setQueryData(
        queryKeys.settings.notifications(),
        updatedSettings
      );

      console.log('Notification settings updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update notification settings:', error);
    },
  });
};

// Combined hook for all settings
export const useAllSettings = () => {
  const preferencesQuery = useUserPreferences();
  const dashboardQuery = useDashboardConfig();
  const notificationsQuery = useNotificationSettings();

  return {
    preferences: preferencesQuery,
    dashboard: dashboardQuery,
    notifications: notificationsQuery,
    isLoading: preferencesQuery.isLoading || dashboardQuery.isLoading || notificationsQuery.isLoading,
    isError: preferencesQuery.isError || dashboardQuery.isError || notificationsQuery.isError,
    error: preferencesQuery.error || dashboardQuery.error || notificationsQuery.error,
  };
};

// Hook for resetting settings to defaults
export const useResetSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: 'preferences' | 'dashboard' | 'notifications' | 'all') => {
      // Simulate resetting to defaults
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const defaults = {
        preferences: {
          theme: 'light' as const,
          language: 'en',
          timezone: 'UTC',
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          notifications: { email: true, push: false, sms: false },
          privacy: { analytics: true, marketing: false, sharing: false }
        },
        dashboard: {
          layout: 'grid' as const,
          widgets: {
            kpis: { enabled: true, position: 1 },
            revenueChart: { enabled: true, position: 2 },
            trafficSources: { enabled: true, position: 3 },
            recentActivity: { enabled: true, position: 4 },
            topProducts: { enabled: true, position: 5 }
          },
          autoRefresh: true,
          refreshInterval: 30000,
          defaultTimeframe: '30d'
        },
        notifications: {
          emailNotifications: {
            dailyReports: true,
            weeklyReports: true,
            monthlyReports: false,
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
            conversionRateDropPercentage: 5,
            trafficDropPercentage: 15
          }
        }
      };

      if (type === 'all') {
        return defaults;
      } else {
        return { [type]: defaults[type] };
      }
    },
    onSuccess: (resetData, type) => {
      // Update all relevant caches
      if (type === 'all' || type === 'preferences') {
        queryClient.setQueryData(queryKeys.settings.preferences(), resetData.preferences);
      }
      if (type === 'all' || type === 'dashboard') {
        queryClient.setQueryData(queryKeys.settings.dashboard(), resetData.dashboard);
      }
      if (type === 'all' || type === 'notifications') {
        queryClient.setQueryData(queryKeys.settings.notifications(), resetData.notifications);
      }

      // Refresh related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      
      console.log(`Settings reset to defaults: ${type}`);
    },
    onError: (error) => {
      console.error('Failed to reset settings:', error);
    },
  });
};

// Hook for exporting settings
export const useExportSettings = () => {
  return useMutation({
    mutationFn: async (format: 'json' | 'csv') => {
      const queryClient = useQueryClient();
      
      // Get current settings from cache
      const preferences = queryClient.getQueryData(queryKeys.settings.preferences());
      const dashboard = queryClient.getQueryData(queryKeys.settings.dashboard());
      const notifications = queryClient.getQueryData(queryKeys.settings.notifications());
      
      const settingsData = {
        preferences,
        dashboard,
        notifications,
        exportedAt: new Date().toISOString()
      };

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: settingsData,
        filename: `settings-export-${Date.now()}.${format}`
      };
    },
    onSuccess: (result) => {
      console.log('Settings exported successfully:', result.filename);
      // In a real app, you might trigger a download here
    },
    onError: (error) => {
      console.error('Failed to export settings:', error);
    },
  });
};