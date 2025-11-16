// REST API Service using Amplify-deployed Lambda functions
// This service makes HTTP requests to the REST API endpoints
import { getApiEndpoint } from '../utils/amplifyConfig';
import { fetchAuthSession } from 'aws-amplify/auth';
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
  UserBehaviorData,
  UserPreferences,
  DashboardConfig,
  NotificationConfig,
  AnalyticsFilters,
  TimeFrame,
} from '../types';

/**
 * Get the current auth token
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    console.warn('Failed to get auth token:', error);
    return null;
  }
};

/**
 * Make a GET request to the REST API
 */
const fetchApi = async <T>(path: string, params?: Record<string, string>): Promise<T> => {
  const baseUrl = getApiEndpoint();
  if (!baseUrl) {
    throw new Error('API endpoint not configured');
  }

  const url = new URL(path, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Get auth token
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Make a PUT request to the REST API
 */
const putApi = async <T>(path: string, body: object): Promise<T> => {
  const baseUrl = getApiEndpoint();
  if (!baseUrl) {
    throw new Error('API endpoint not configured');
  }

  const url = new URL(path, baseUrl);

  // Get auth token
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Dashboard API using REST endpoints
export const amplifyDashboardApi = {
  getKPIs: async (timeframe: TimeFrame = '30d'): Promise<ApiResponse<KPI[]>> => {
    return fetchApi<ApiResponse<KPI[]>>('/dashboard/kpis', { timeframe });
  },

  getRevenueTrends: async (timeframe: '6m' | '12m' = '6m'): Promise<ApiResponse<RevenueData[]>> => {
    return fetchApi<ApiResponse<RevenueData[]>>('/dashboard/revenue', { timeframe });
  },

  getTrafficSources: async (timeframe: TimeFrame = '30d'): Promise<ApiResponse<TrafficSource[]>> => {
    return fetchApi<ApiResponse<TrafficSource[]>>('/dashboard/traffic', { timeframe });
  },

  getRecentActivity: async (limit: number = 10): Promise<ApiResponse<Activity[]>> => {
    return fetchApi<ApiResponse<Activity[]>>('/dashboard/activity', { limit: limit.toString() });
  },

  getTopProducts: async (
    timeframe: TimeFrame = '30d',
    limit: number = 5
  ): Promise<ApiResponse<Product[]>> => {
    return fetchApi<ApiResponse<Product[]>>('/dashboard/products', {
      timeframe,
      limit: limit.toString(),
    });
  },
};

// Analytics API using REST endpoints
export const amplifyAnalyticsApi = {
  getOverview: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<AnalyticsOverview & { appliedFilters: AnalyticsFilters }>> => {
    const params: Record<string, string> = { timeframe };
    // Add filters as query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return fetchApi('/analytics/overview', params);
  },

  getTrafficAnalytics: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<{ traffic: TrafficData[]; appliedFilters: AnalyticsFilters }>> => {
    const params: Record<string, string> = { timeframe };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return fetchApi('/analytics/traffic', params);
  },

  getConversionFunnel: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<{ funnel: ConversionFunnelStep[]; appliedFilters: AnalyticsFilters }>> => {
    const params: Record<string, string> = { timeframe };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return fetchApi('/analytics/funnel', params);
  },

  getUserBehavior: async (
    timeframe: TimeFrame = '30d',
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<UserBehaviorData & { appliedFilters: AnalyticsFilters }>> => {
    const params: Record<string, string> = { timeframe };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return fetchApi('/analytics/behavior', params);
  },
};

// Settings API using REST endpoints
export const amplifySettingsApi = {
  getUserPreferences: async (): Promise<ApiResponse<UserPreferences>> => {
    return fetchApi('/settings/preferences');
  },

  updateUserPreferences: async (
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> => {
    return putApi('/settings/preferences', preferences);
  },

  getDashboardConfig: async (): Promise<ApiResponse<DashboardConfig>> => {
    return fetchApi('/settings/dashboard-config');
  },

  updateDashboardConfig: async (
    config: Partial<DashboardConfig>
  ): Promise<ApiResponse<DashboardConfig>> => {
    return putApi('/settings/dashboard-config', config);
  },

  getNotificationSettings: async (): Promise<ApiResponse<NotificationConfig>> => {
    return fetchApi('/settings/notifications');
  },

  updateNotificationSettings: async (
    settings: Partial<NotificationConfig>
  ): Promise<ApiResponse<NotificationConfig>> => {
    return putApi('/settings/notifications', settings);
  },
};

// Combined API export
export const amplifyApi = {
  dashboard: amplifyDashboardApi,
  analytics: amplifyAnalyticsApi,
  settings: amplifySettingsApi,
};

export default amplifyApi;
