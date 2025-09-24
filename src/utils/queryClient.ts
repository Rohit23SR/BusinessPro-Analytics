import { QueryClient } from '@tanstack/react-query';

// Create query client with optimized settings for the dashboard
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time - how long data stays in cache after component unmounts  
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
      
      // Retry configuration
      retry: (failureCount: number, error: Error) => {
        // Don't retry on 4xx errors, only on network/server errors
        if (error.message.includes('404') || error.message.includes('401')) {
          return false;
        }
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Background refetch settings
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Network mode
      networkMode: 'online',
    },
    
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Network mode for mutations
      networkMode: 'online',
    }
  }
});

// Query key factory for consistent query keys
export const queryKeys = {
  // Dashboard keys
  dashboard: {
    all: ['dashboard'] as const,
    kpis: (timeframe: string) => ['dashboard', 'kpis', timeframe] as const,
    revenue: (timeframe: string) => ['dashboard', 'revenue', timeframe] as const,
    traffic: (timeframe: string) => ['dashboard', 'traffic', timeframe] as const,
    activity: (limit: number) => ['dashboard', 'activity', limit] as const,
    products: (timeframe: string, limit: number) => ['dashboard', 'products', timeframe, limit] as const,
  },
  
  // Analytics keys
  analytics: {
    all: ['analytics'] as const,
    overview: (timeframe: string, filters: object) => ['analytics', 'overview', timeframe, filters] as const,
    traffic: (timeframe: string, filters: object) => ['analytics', 'traffic', timeframe, filters] as const,
    funnel: (timeframe: string, filters: object) => ['analytics', 'funnel', timeframe, filters] as const,
    behavior: (timeframe: string, filters: object) => ['analytics', 'behavior', timeframe, filters] as const,
    pages: (timeframe: string, limit: number) => ['analytics', 'pages', timeframe, limit] as const,
    cohort: (type: string) => ['analytics', 'cohort', type] as const,
  },
  
  // Settings keys
  settings: {
    all: ['settings'] as const,
    preferences: () => ['settings', 'preferences'] as const,
    dashboard: () => ['settings', 'dashboard'] as const,
    notifications: () => ['settings', 'notifications'] as const,
  },
  
  // Real-time keys
  realtime: {
    all: ['realtime'] as const,
    metrics: () => ['realtime', 'metrics'] as const,
    activity: () => ['realtime', 'activity'] as const,
  }
} as const;

// Utility functions for query management
export const queryUtils = {
  // Invalidate all dashboard queries
  invalidateDashboard: () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.all
    });
  },
  
  // Invalidate all analytics queries
  invalidateAnalytics: () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.analytics.all
    });
  },
  
  // Invalidate all settings queries
  invalidateSettings: () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.settings.all
    });
  },
  
  // Prefetch dashboard data
  prefetchDashboard: async (timeframe: string) => {
    const { dashboardApi } = await import('../services/api');
    
    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.kpis(timeframe),
        queryFn: () => dashboardApi.getKPIs(timeframe as any),
        staleTime: 2 * 60 * 1000, // 2 minutes for prefetch
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.traffic(timeframe),
        queryFn: () => dashboardApi.getTrafficSources(timeframe as any),
        staleTime: 2 * 60 * 1000,
      }),
    ]);
  },
  
  // Clear all queries
  clearAll: () => {
    queryClient.clear();
  },
  
  // Get query data without triggering fetch
  getQueryData: <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData<T>(queryKey);
  },
  
  // Set query data manually
  setQueryData: <T>(queryKey: readonly unknown[], data: T) => {
    queryClient.setQueryData(queryKey, data);
  }
};

// Error boundary for query errors
export const handleQueryError = (error: Error, queryKey: readonly unknown[]) => {
  console.error(`Query error for ${JSON.stringify(queryKey)}:`, error);
  
  // You can add error reporting service here
  // errorReportingService.captureException(error, { extra: { queryKey } });
};

// Default mutation options
export const defaultMutationOptions = {
  onError: (error: Error, variables: unknown, context: unknown) => {
    console.error('Mutation error:', error, { variables, context });
    // Handle mutation errors globally
  },
  
  onSuccess: (data: unknown, variables: unknown, context: unknown) => {
    // Handle successful mutations globally
    console.log('Mutation success:', { data, variables, context });
  }
};