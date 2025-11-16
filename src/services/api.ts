// Mock API Services with TypeScript and realistic delays
import { mockData } from '../data/mockData';
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
  LiveActivity
} from '../types';

// Utility function to simulate network delay
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Utility function to simulate random errors (5% chance)
const shouldSimulateError = (): boolean => Math.random() < 0.05;

// Utility function to create realistic API response
const createApiResponse = <T>(data: T, status: number = 200): ApiResponse<T> => ({
  data,
  status,
  timestamp: new Date().toISOString(),
  meta: {
    requestId: Math.random().toString(36).substr(2, 9),
    version: '1.0.0'
  }
});

// Dashboard API endpoints
export const dashboardApi = {
  // Get KPI metrics
  getKPIs: async (timeframe: TimeFrame = '30d'): Promise<ApiResponse<KPI[]>> => {
    await delay(Math.random() * 300 + 200); // 200-500ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch KPI data');
    }
    
    return createApiResponse(
      mockData.dashboard.kpis[timeframe] || mockData.dashboard.kpis['30d']
    );
  },

  // Get revenue trends
  getRevenueTrends: async (timeframe: '6m' | '12m' = '6m'): Promise<ApiResponse<RevenueData[]>> => {
    await delay(Math.random() * 400 + 300); // 300-700ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch revenue trends');
    }
    
    return createApiResponse(
      mockData.dashboard.revenueTrends[timeframe] || mockData.dashboard.revenueTrends['6m']
    );
  },

  // Get traffic sources
  getTrafficSources: async (timeframe: TimeFrame = '30d'): Promise<ApiResponse<TrafficSource[]>> => {
    await delay(Math.random() * 200 + 150); // 150-350ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch traffic sources');
    }
    
    return createApiResponse(
      mockData.dashboard.trafficSources[timeframe] || mockData.dashboard.trafficSources['30d']
    );
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 10): Promise<ApiResponse<Activity[]>> => {
    await delay(Math.random() * 250 + 200); // 200-450ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch recent activity');
    }
    
    const activities = mockData.dashboard.recentActivity.slice(0, limit);
    return createApiResponse(activities);
  },

  // Get top products
  getTopProducts: async (
    timeframe: TimeFrame = '30d', 
    limit: number = 5
  ): Promise<ApiResponse<Product[]>> => {
    await delay(Math.random() * 300 + 250); // 250-550ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch top products');
    }
    
    const products = mockData.dashboard.topProducts[timeframe]?.slice(0, limit) || 
                    mockData.dashboard.topProducts['30d'].slice(0, limit);
    return createApiResponse(products);
  }
};

// Analytics API endpoints
export const analyticsApi = {
  // Get analytics overview
  getOverview: async (
    timeframe: TimeFrame = '30d', 
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<AnalyticsOverview & { appliedFilters: AnalyticsFilters }>> => {
    await delay(Math.random() * 400 + 300); // 300-700ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch analytics overview');
    }
    
    const overview = mockData.analytics.overview[timeframe] || mockData.analytics.overview['30d'];
    return createApiResponse({
      ...overview,
      appliedFilters: filters
    });
  },

  // Get traffic analytics
  getTrafficAnalytics: async (
    timeframe: TimeFrame = '30d', 
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<{ traffic: TrafficData[]; appliedFilters: AnalyticsFilters }>> => {
    await delay(Math.random() * 500 + 400); // 400-900ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch traffic analytics');
    }
    
    const traffic = mockData.analytics.traffic[timeframe] || mockData.analytics.traffic['30d'];
    return createApiResponse({
      traffic,
      appliedFilters: filters
    });
  },

  // Get conversion funnel
  getConversionFunnel: async (
    timeframe: TimeFrame = '30d', 
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<{ funnel: ConversionFunnelStep[]; appliedFilters: AnalyticsFilters }>> => {
    await delay(Math.random() * 350 + 250); // 250-600ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch conversion funnel');
    }
    
    const funnel = mockData.analytics.conversionFunnel[timeframe] || 
                   mockData.analytics.conversionFunnel['30d'];
    return createApiResponse({
      funnel,
      appliedFilters: filters
    });
  },

  // Get user behavior data
  getUserBehavior: async (
    timeframe: TimeFrame = '30d', 
    filters: AnalyticsFilters = {}
  ): Promise<ApiResponse<UserBehaviorData & { appliedFilters: AnalyticsFilters }>> => {
    await delay(Math.random() * 450 + 350); // 350-800ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch user behavior data');
    }
    
    const behavior = mockData.analytics.userBehavior[timeframe] || 
                     mockData.analytics.userBehavior['30d'];
    return createApiResponse({
      ...behavior,
      appliedFilters: filters
    });
  },

  // Get top landing pages
  getTopLandingPages: async (
    timeframe: TimeFrame = '30d', 
    limit: number = 10
  ): Promise<ApiResponse<LandingPage[]>> => {
    await delay(Math.random() * 300 + 200); // 200-500ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch top landing pages');
    }
    
    const pages = mockData.analytics.topLandingPages[timeframe]?.slice(0, limit) || 
                 mockData.analytics.topLandingPages['30d'].slice(0, limit);
    return createApiResponse(pages);
  },

  // Get cohort analysis
  getCohortAnalysis: async (
    type: 'weekly' | 'monthly' = 'weekly'
  ): Promise<ApiResponse<CohortAnalysis>> => {
    await delay(Math.random() * 600 + 500); // 500-1100ms delay (complex query)
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch cohort analysis');
    }
    
    const cohort = mockData.analytics.cohortAnalysis[type] || 
                   mockData.analytics.cohortAnalysis.weekly;
    return createApiResponse(cohort);
  }
};

// Settings API endpoints
export const settingsApi = {
  // Get user preferences
  getUserPreferences: async (): Promise<ApiResponse<UserPreferences>> => {
    await delay(Math.random() * 200 + 100); // 100-300ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch user preferences');
    }
    
    return createApiResponse(mockData.settings.userPreferences);
  },

  // Update user preferences
  updateUserPreferences: async (
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> => {
    await delay(Math.random() * 400 + 300); // 300-700ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to update user preferences');
    }
    
    // Simulate successful update
    const updatedPreferences = { 
      ...mockData.settings.userPreferences, 
      ...preferences 
    };
    mockData.settings.userPreferences = updatedPreferences;
    
    return createApiResponse(updatedPreferences);
  },

  // Get dashboard configuration
  getDashboardConfig: async (): Promise<ApiResponse<DashboardConfig>> => {
    await delay(Math.random() * 250 + 150); // 150-400ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch dashboard configuration');
    }
    
    return createApiResponse(mockData.settings.dashboardConfig);
  },

  // Update dashboard configuration
  updateDashboardConfig: async (
    config: Partial<DashboardConfig>
  ): Promise<ApiResponse<DashboardConfig>> => {
    await delay(Math.random() * 350 + 250); // 250-600ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to update dashboard configuration');
    }
    
    // Simulate successful update
    const updatedConfig = { 
      ...mockData.settings.dashboardConfig, 
      ...config 
    };
    mockData.settings.dashboardConfig = updatedConfig;
    
    return createApiResponse(updatedConfig);
  },

  // Get notification settings
  getNotificationSettings: async (): Promise<ApiResponse<NotificationConfig>> => {
    await delay(Math.random() * 200 + 100); // 100-300ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch notification settings');
    }
    
    return createApiResponse(mockData.settings.notifications);
  },

  // Update notification settings
  updateNotificationSettings: async (
    settings: Partial<NotificationConfig>
  ): Promise<ApiResponse<NotificationConfig>> => {
    await delay(Math.random() * 300 + 200); // 200-500ms delay
    
    if (shouldSimulateError()) {
      throw new Error('Failed to update notification settings');
    }
    
    // Simulate successful update
    const updatedSettings = { 
      ...mockData.settings.notifications, 
      ...settings 
    };
    mockData.settings.notifications = updatedSettings;
    
    return createApiResponse(updatedSettings);
  }
};

// Real-time data simulation (for polling)
export const realtimeApi = {
  // Get live metrics (for real-time updates)
  getLiveMetrics: async (): Promise<ApiResponse<{ kpis: KPI[]; lastUpdated: string }>> => {
    await delay(Math.random() * 100 + 50); // 50-150ms delay (fast for real-time)
    
    // Generate slight variations in data
    const baseKpis = mockData.dashboard.kpis['30d'];
    const liveKpis: KPI[] = baseKpis.map(kpi => ({
      ...kpi,
      value: kpi.title === 'Total Revenue' 
        ? `$${(parseInt(kpi.value.replace(/[$,]/g, '')) + Math.floor(Math.random() * 1000)).toLocaleString()}`
        : kpi.title === 'New Customers'
        ? `${parseInt(kpi.value.replace(/,/g, '')) + Math.floor(Math.random() * 10)}`
        : kpi.value
    }));
    
    return createApiResponse({
      kpis: liveKpis,
      lastUpdated: new Date().toISOString()
    });
  },

  // Get live activity feed
  getLiveActivity: async (): Promise<ApiResponse<LiveActivity[]>> => {
    await delay(Math.random() * 150 + 100); // 100-250ms delay
    
    const users = ['John Smith', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Chen', 'Emma Davis'];
    const activities = ['New Order', 'Payment Received', 'User Registration', 'Subscription Upgrade'];
    
    // Simulate new activities
    const newActivities: LiveActivity[] = [
      {
        id: Date.now(),
        activity: `${activities[Math.floor(Math.random() * activities.length)]} #${Math.floor(Math.random() * 9999) + 1000}`,
        user: users[Math.floor(Math.random() * users.length)],
        time: 'Just now',
        status: 'Completed',
        timestamp: new Date().toISOString()
      }
    ];
    
    return createApiResponse(newActivities);
  }
};

// Combined API export
export const api = {
  dashboard: dashboardApi,
  analytics: analyticsApi,
  settings: settingsApi,
  realtime: realtimeApi
};

// Export default
export default api;