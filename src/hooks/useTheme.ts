// hooks/useTheme.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsApiClient } from '../services/apiClient';
import { isApiConfigured } from '../utils/amplifyConfig';

/**
 * Hook to apply theme preference to the document
 * Watches for theme changes and updates the DOM accordingly
 */
export const useTheme = () => {
  const useBackendApi = isApiConfigured();

  // Fetch preferences from backend
  const { data: preferencesData } = useQuery({
    queryKey: ['settings', 'preferences'],
    queryFn: () => settingsApiClient.getPreferences(),
    enabled: useBackendApi,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // Get theme from backend data or localStorage fallback
    let theme: 'light' | 'dark' = 'light';

    if (useBackendApi && preferencesData?.data?.theme) {
      theme = preferencesData.data.theme as 'light' | 'dark';
    } else {
      // Fallback to localStorage for non-configured or local-only mode
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        theme = savedTheme;
      }
    }

    // Apply theme to document
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Also save to localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [useBackendApi, preferencesData]);
};
