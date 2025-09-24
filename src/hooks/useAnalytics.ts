// Custom hooks for analytics data fetching using TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { queryKeys } from '../utils/queryClient';
import type {
  TimeFrame,
  AnalyticsOverview,
  TrafficData,
  ConversionFunnelStep,
  LandingPage,
  UserBehaviorData,
  CohortAnalysis,
  AnalyticsFilters
} from '../types';

// Hook for analytics overview
export const useAnalyticsOverview = (
  timeframe: TimeFrame = '30d',
  filters: AnalyticsFilters = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.analytics.overview(timeframe, filters),
    queryFn: async () => {
      const response = await api.analytics.getOverview(timeframe, filters);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: options?.enabled,
  });
};

// Hook for traffic analytics
export const useTrafficAnalytics = (
  timeframe: TimeFrame = '30d',
  filters: AnalyticsFilters = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.analytics.traffic(timeframe, filters),
    queryFn: async () => {
      const response = await api.analytics.getTrafficAnalytics(timeframe, filters);
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: options?.enabled,
  });
};

// Hook for conversion funnel
export const useConversionFunnel = (
  timeframe: TimeFrame = '30d',
  filters: AnalyticsFilters = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.analytics.funnel(timeframe, filters),
    queryFn: async () => {
      const response = await api.analytics.getConversionFunnel(timeframe, filters);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - funnel data changes slowly
    enabled: options?.enabled,
  });
};

// Hook for user behavior data
export const useUserBehavior = (
  timeframe: TimeFrame = '30d',
  filters: AnalyticsFilters = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.analytics.behavior(timeframe, filters),
    queryFn: async () => {
      const response = await api.analytics.getUserBehavior(timeframe, filters);
      return response.data;
    },
    staleTime: 4 * 60 * 1000, // 4 minutes
    enabled: options?.enabled,
  });
};

// Hook for top landing pages
export const useTopLandingPages = (
  timeframe: TimeFrame = '30d',
  limit: number = 10,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.analytics.pages(timeframe, limit),
    queryFn: async () => {
      const response = await api.analytics.getTopLandingPages(timeframe, limit);
      return response.data;
    },
    staleTime: 6 * 60 * 1000, // 6 minutes
    enabled: options?.enabled,
  });
};

// Hook for cohort analysis
export const useCohortAnalysis = (
  type: 'weekly' | 'monthly' = 'weekly',
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.analytics.cohort(type),
    queryFn: async () => {
      const response = await api.analytics.getCohortAnalysis(type);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - cohort data changes very slowly
    enabled: options?.enabled,
  });
};

// Combined hook for analytics overview page
export const useAnalyticsDashboard = (
  timeframe: TimeFrame = '30d',
  filters: AnalyticsFilters = {}
) => {
  const overviewQuery = useAnalyticsOverview(timeframe, filters);
  const trafficQuery = useTrafficAnalytics(timeframe, filters);
  const funnelQuery = useConversionFunnel(timeframe, filters);
  const behaviorQuery = useUserBehavior(timeframe, filters);
  const pagesQuery = useTopLandingPages(timeframe, 6);

  return {
    overview: overviewQuery,
    traffic: trafficQuery,
    funnel: funnelQuery,
    behavior: behaviorQuery,
    pages: pagesQuery,
    isLoading: 
      overviewQuery.isLoading || 
      trafficQuery.isLoading || 
      funnelQuery.isLoading,
    isError: 
      overviewQuery.isError || 
      trafficQuery.isError || 
      funnelQuery.isError,
    error: overviewQuery.error || trafficQuery.error || funnelQuery.error,
    refetch: () => {
      overviewQuery.refetch();
      trafficQuery.refetch();
      funnelQuery.refetch();
      behaviorQuery.refetch();
      pagesQuery.refetch();
    }
  };
};

// Hook for analytics filters management
export const useAnalyticsFilters = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFilters: AnalyticsFilters) => {
      // Invalidate all analytics queries when filters change
      await queryClient.invalidateQueries({
        queryKey: queryKeys.analytics.all,
      });
      return newFilters;
    },
    onSuccess: (filters) => {
      console.log('Analytics filters updated:', filters);
    },
    onError: (error) => {
      console.error('Failed to update analytics filters:', error);
    },
  });
};

// Hook for exporting analytics data
export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: async (params: {
      timeframe: TimeFrame;
      filters: AnalyticsFilters;
      format: 'csv' | 'pdf' | 'excel';
    }) => {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call an export API
      return {
        success: true,
        downloadUrl: `https://api.example.com/exports/${Date.now()}.${params.format}`,
        filename: `analytics-export-${params.timeframe}.${params.format}`
      };
    },
    onSuccess: (result) => {
      console.log('Export successful:', result);
      // You could trigger a download here
    },
    onError: (error) => {
      console.error('Export failed:', error);
    },
  });
};

// Hook for analytics insights (AI-powered suggestions)
export const useAnalyticsInsights = (
  timeframe: TimeFrame = '30d',
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['analytics', 'insights', timeframe],
    queryFn: async () => {
      // Simulate AI insights generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return [
        {
          type: 'opportunity',
          title: 'High-Converting Traffic',
          description: `Users from organic search have 32% higher conversion rates in ${timeframe}. Consider increasing SEO investment.`,
          impact: 'high',
          confidence: 0.87
        },
        {
          type: 'warning',
          title: 'Mobile Optimization',
          description: 'Mobile bounce rate (34%) is significantly higher than desktop (21%). Review mobile UX.',
          impact: 'medium',
          confidence: 0.92
        },
        {
          type: 'info',
          title: 'Peak Performance',
          description: 'Conversion rates are 45% higher on Tuesdays and Wednesdays. Optimize campaigns for these days.',
          impact: 'medium',
          confidence: 0.78
        }
      ];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: options?.enabled,
  });
};