// Custom hooks for dashboard data fetching using TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { queryKeys } from '../utils/queryClient';
import type { TimeFrame, KPI, RevenueData, TrafficSource, Activity, Product } from '../types';
import React, { useEffect } from 'react';

// Hook for KPI data
export const useKPIs = (timeframe: TimeFrame = '30d', options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.dashboard.kpis(timeframe),
    queryFn: async () => {
      const response = await api.dashboard.getKPIs(timeframe);
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: options?.enabled,
  });
};

// Hook for revenue trends
export const useRevenueTrends = (
  timeframe: '6m' | '12m' = '6m',
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.dashboard.revenue(timeframe),
    queryFn: async () => {
      const response = await api.dashboard.getRevenueTrends(timeframe);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - revenue data changes less frequently
    enabled: options?.enabled,
  });
};

// Hook for traffic sources
export const useTrafficSources = (
  timeframe: TimeFrame = '30d',
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.dashboard.traffic(timeframe),
    queryFn: async () => {
      const response = await api.dashboard.getTrafficSources(timeframe);
      return response.data;
    },
    staleTime: 4 * 60 * 1000, // 4 minutes
    enabled: options?.enabled,
  });
};

// Hook for recent activity
export const useRecentActivity = (limit: number = 10, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.dashboard.activity(limit),
    queryFn: async () => {
      const response = await api.dashboard.getRecentActivity(limit);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds - activity data should be fresh
    refetchInterval: 60 * 1000, // Auto-refetch every minute
    enabled: options?.enabled,
  });
};

// Hook for top products
export const useTopProducts = (
  timeframe: TimeFrame = '30d',
  limit: number = 5,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.dashboard.products(timeframe, limit),
    queryFn: async () => {
      const response = await api.dashboard.getTopProducts(timeframe, limit);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled,
  });
};

// Hook for live metrics (real-time updates)
export const useLiveMetrics = (options?: { enabled?: boolean; refetchInterval?: number }) => {
  return useQuery({
    queryKey: queryKeys.realtime.metrics(),
    queryFn: async () => {
      const response = await api.realtime.getLiveMetrics();
      return response.data;
    },
    staleTime: 0, // Always fetch fresh data
    refetchInterval: options?.refetchInterval || 30 * 1000, // 30 seconds default
    refetchIntervalInBackground: true,
    enabled: options?.enabled !== false, // Enabled by default
  });
};

// Hook for live activity feed
export const useLiveActivity = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.realtime.activity(),
    queryFn: async () => {
      const response = await api.realtime.getLiveActivity();
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 15 * 1000, // 15 seconds
    refetchIntervalInBackground: true,
    enabled: options?.enabled !== false,
  });
};

// Combined hook for dashboard overview
export const useDashboardOverview = (timeframe: TimeFrame = '30d') => {
  const queryClient = useQueryClient();

  const kpisQuery = useKPIs(timeframe);
  const revenueQuery = useRevenueTrends(timeframe === '12m' ? '12m' : '6m');
  const trafficQuery = useTrafficSources(timeframe);
  const activityQuery = useRecentActivity(8);
  const productsQuery = useTopProducts(timeframe, 5);

  // Prefetch live metrics
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.realtime.metrics(),
      queryFn: async () => {
        const response = await api.realtime.getLiveMetrics();
        return response.data;
      },
      staleTime: 0,
    });
  }, [queryClient]);

  return {
    kpis: kpisQuery,
    revenue: revenueQuery,
    traffic: trafficQuery,
    activity: activityQuery,
    products: productsQuery,
    isLoading: kpisQuery.isLoading || revenueQuery.isLoading || trafficQuery.isLoading,
    isError: kpisQuery.isError || revenueQuery.isError || trafficQuery.isError,
    error: kpisQuery.error || revenueQuery.error || trafficQuery.error,
  };
};

// Mutation hooks for dashboard actions
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timeframe: TimeFrame) => {
      // Invalidate all dashboard queries
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.all,
      });
      
      // Optionally fetch fresh data
      return { success: true, timeframe };
    },
    onSuccess: () => {
      console.log('Dashboard refreshed successfully');
    },
    onError: (error) => {
      console.error('Failed to refresh dashboard:', error);
    },
  });
};