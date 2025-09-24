// Custom hook for navigation management
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { navigation, routes } from '../router';
import type { TimeFrame } from '../types';

export interface NavigationState {
  // Current route information
  pathname: string;
  currentRoute: typeof routes.dashboard;
  breadcrumbs: Array<{ name: string; path: string }>;
  isActive: (path: string) => boolean;
  
  // Navigation functions
  navigateTo: (path: string, options?: { replace?: boolean; state?: any }) => void;
  goBack: () => void;
  goForward: () => void;
  
  // Query parameters
  searchParams: URLSearchParams;
  setSearchParam: (key: string, value: string) => void;
  removeSearchParam: (key: string) => void;
  getSearchParam: (key: string) => string | null;
  
  // Dashboard-specific navigation
  navigateToTimeframe: (timeframe: TimeFrame) => void;
  navigateToAnalytics: (tab?: string) => void;
  navigateToSettings: (section?: string) => void;
}

export const useNavigation = (): NavigationState => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Current route information
  const currentRoute = useMemo(() => 
    navigation.getCurrentRoute(location.pathname),
    [location.pathname]
  );

  const breadcrumbs = useMemo(() => 
    navigation.getBreadcrumbs(location.pathname),
    [location.pathname]
  );

  // Check if a route is active
  const isActive = useCallback((path: string) => 
    navigation.isActiveRoute(location.pathname, path),
    [location.pathname]
  );

  // Basic navigation functions
  const navigateTo = useCallback((
    path: string, 
    options?: { replace?: boolean; state?: any }
  ) => {
    navigate(path, {
      replace: options?.replace || false,
      state: options?.state,
    });
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  // Search params helpers
  const setSearchParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const removeSearchParam = useCallback((key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const getSearchParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  // Dashboard-specific navigation helpers
  const navigateToTimeframe = useCallback((timeframe: TimeFrame) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('timeframe', timeframe);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const navigateToAnalytics = useCallback((tab?: string) => {
    if (tab) {
      navigate(`/dashboard/analytics/${tab}`);
    } else {
      navigate('/dashboard/analytics');
    }
  }, [navigate]);

  const navigateToSettings = useCallback((section?: string) => {
    const newParams = new URLSearchParams();
    if (section) {
      newParams.set('section', section);
    }
    navigate('/dashboard/settings', { 
      replace: false,
      state: { searchParams: newParams.toString() }
    });
  }, [navigate]);

  return {
    // Current state
    pathname: location.pathname,
    currentRoute,
    breadcrumbs,
    isActive,
    
    // Navigation functions
    navigateTo,
    goBack,
    goForward,
    
    // Search params
    searchParams,
    setSearchParam,
    removeSearchParam,
    getSearchParam,
    
    // Dashboard navigation
    navigateToTimeframe,
    navigateToAnalytics,
    navigateToSettings,
  };
};

// Hook for managing filters in URL
export const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    timeframe: (searchParams.get('timeframe') as TimeFrame) || '30d',
    trafficSource: searchParams.get('traffic_source') || '',
    deviceType: searchParams.get('device_type') || '',
    geography: searchParams.get('geography') || '',
  }), [searchParams]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        newParams.set(key === 'trafficSource' ? 'traffic_source' : 
                     key === 'deviceType' ? 'device_type' : key, value);
      } else {
        newParams.delete(key === 'trafficSource' ? 'traffic_source' : 
                        key === 'deviceType' ? 'device_type' : key);
      }
    });
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
};

// Hook for route-based data fetching
export const useRouteData = () => {
  const location = useLocation();
  
  const shouldFetchDashboard = useMemo(() => 
    location.pathname.startsWith('/dashboard') && 
    !location.pathname.includes('/analytics'),
    [location.pathname]
  );

  const shouldFetchAnalytics = useMemo(() => 
    location.pathname.includes('/analytics'),
    [location.pathname]
  );

  const shouldFetchSettings = useMemo(() => 
    location.pathname.includes('/settings'),
    [location.pathname]
  );

  const analyticsTab = useMemo(() => {
    const segments = location.pathname.split('/');
    const analyticsIndex = segments.indexOf('analytics');
    return analyticsIndex !== -1 && segments[analyticsIndex + 1] 
      ? segments[analyticsIndex + 1] 
      : 'overview';
  }, [location.pathname]);

  return {
    shouldFetchDashboard,
    shouldFetchAnalytics,
    shouldFetchSettings,
    analyticsTab,
    currentPath: location.pathname,
  };
};

export default useNavigation;