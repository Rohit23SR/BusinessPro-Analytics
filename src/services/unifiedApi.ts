// Unified API Service
// This service provides a single interface that switches between mock and Amplify APIs
import { shouldUseMockData } from '../utils/amplifyConfig';
import { api as mockApi } from './api';
import { amplifyApi } from './amplifyApi';
import type {
  ApiResponse,
  KPI,
  RevenueData,
  TrafficSource,
  Activity,
  Product,
  AnalyticsOverview,
  TrafficData,
  ConversionFunnelStep,
  LandingPage,
  UserBehaviorData,
  CohortAnalysis,
  UserPreferences,
  DashboardConfig,
  NotificationConfig,
  AnalyticsFilters,
  TimeFrame,
  LiveActivity,
} from '../types';

/**
 * Unified Dashboard API
 * Automatically switches between mock and Amplify based on configuration
 */
export const unifiedDashboardApi = {
  getKPIs: async (timeframe: TimeFrame = '30d'): Promise<ApiResponse<KPI[]>> => {
    if (shouldUseMockData()) {
      return mockApi.dashboard.getKPIs(timeframe);
    }
    return amplifyApi.dashboard.getKPIs(timeframe);
  },

  getRevenueTrends: async (
    timeframe: '6m' | '12m' = '6m'
  ): Promise<ApiResponse<RevenueData[]>> => {
    if (shouldUseMockData()) {
      return mockApi.dashboard.getRevenueTrends(timeframe);
    }
    return amplifyApi.dashboard.getRevenueTrends(timeframe);
  },

  getTrafficSources: async (
    timeframe: TimeFrame = '30d'
  ): Promise<ApiResponse<TrafficSource[]>> => {
    if (shouldUseMockData()) {
      return mockApi.dashboard.getTrafficSources(timeframe);
    }
    return amplifyApi.dashboard.getTrafficSources(timeframe);
  },

  getRecentActivity: async (limit: number = 10): Promise<ApiResponse<Activity[]>> => {
    if (shouldUseMockData()) {
      return mockApi.dashboard.getRecentActivity(limit);
    }
    return amplifyApi.dashboard.getRecentActivity(limit);
  },

  getTopProducts: async (
    timeframe: TimeFrame = '30d',
    limit: number = 5
  ): Promise<ApiResponse<Product[]>> => {
    if (shouldUseMockData()) {
      return mockApi.dashboard.getTopProducts(timeframe, limit);
    }
    return amplifyApi.dashboard.getTopProducts(timeframe, limit);
  },
};

/**
 * Unified Analytics API
 */
export const unifiedAnalyticsApi = {
  getOverview: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<AnalyticsOverview & { appliedFilters: AnalyticsFilters }>> => {
    if (shouldUseMockData()) {
      return mockApi.analytics.getOverview(timeframe, filters);
    }
    // For now, Amplify API doesn't support filters, so we pass empty object
    const response = await amplifyApi.analytics.getOverview(timeframe);
    return {
      ...response,
      data: {
        ...response.data,
        appliedFilters: filters,
      },
    };
  },

  getTrafficAnalytics: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<{ traffic: TrafficData[]; appliedFilters: AnalyticsFilters }>> => {
    // For now, use mock data for complex analytics queries
    return mockApi.analytics.getTrafficAnalytics(timeframe, filters);
  },

  getConversionFunnel: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<
    ApiResponse<{ funnel: ConversionFunnelStep[]; appliedFilters: AnalyticsFilters }>
  > => {
    // For now, use mock data
    return mockApi.analytics.getConversionFunnel(timeframe, filters);
  },

  getUserBehavior: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<UserBehaviorData & { appliedFilters: AnalyticsFilters }>> => {
    // For now, use mock data
    return mockApi.analytics.getUserBehavior(timeframe, filters);
  },

  getTopLandingPages: async (
    timeframe: TimeFrame = '30d',
    limit: number = 10
  ): Promise<ApiResponse<LandingPage[]>> => {
    // For now, use mock data
    return mockApi.analytics.getTopLandingPages(timeframe, limit);
  },

  getCohortAnalysis: async (
    type: 'weekly' | 'monthly' = 'weekly'
  ): Promise<ApiResponse<CohortAnalysis>> => {
    // For now, use mock data
    return mockApi.analytics.getCohortAnalysis(type);
  },
};

/**
 * Unified Settings API
 */
export const unifiedSettingsApi = {
  getUserPreferences: async (): Promise<ApiResponse<UserPreferences>> => {
    // For now, use mock data for settings
    return mockApi.settings.getUserPreferences();
  },

  updateUserPreferences: async (
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> => {
    return mockApi.settings.updateUserPreferences(preferences);
  },

  getDashboardConfig: async (): Promise<ApiResponse<DashboardConfig>> => {
    return mockApi.settings.getDashboardConfig();
  },

  updateDashboardConfig: async (
    config: Partial<DashboardConfig>
  ): Promise<ApiResponse<DashboardConfig>> => {
    return mockApi.settings.updateDashboardConfig(config);
  },

  getNotificationSettings: async (): Promise<ApiResponse<NotificationConfig>> => {
    return mockApi.settings.getNotificationSettings();
  },

  updateNotificationSettings: async (
    settings: Partial<NotificationConfig>
  ): Promise<ApiResponse<NotificationConfig>> => {
    return mockApi.settings.updateNotificationSettings(settings);
  },
};

/**
 * Unified Real-time API
 */
export const unifiedRealtimeApi = {
  getLiveMetrics: async (): Promise<
    ApiResponse<{ kpis: KPI[]; lastUpdated: string }>
  > => {
    // For now, use mock data for real-time
    return mockApi.realtime.getLiveMetrics();
  },

  getLiveActivity: async (): Promise<ApiResponse<LiveActivity[]>> => {
    return mockApi.realtime.getLiveActivity();
  },
};

/**
 * Unified API Export
 * Drop-in replacement for the existing mock API
 */
export const unifiedApi = {
  dashboard: unifiedDashboardApi,
  analytics: unifiedAnalyticsApi,
  settings: unifiedSettingsApi,
  realtime: unifiedRealtimeApi,
};

// Default export
export default unifiedApi;
