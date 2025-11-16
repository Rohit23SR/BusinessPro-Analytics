// Real API Client with Authentication
import { fetchAuthSession } from 'aws-amplify/auth';
import { getApiEndpoint } from '../utils/amplifyConfig';

interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
  meta: {
    requestId: string;
    version: string;
  };
}

/**
 * Get the current user's JWT token for authenticated requests
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

/**
 * Make an authenticated API request
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const baseUrl = getApiEndpoint();

  if (!baseUrl) {
    throw new Error('API endpoint not configured');
  }

  const token = await getAuthToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Settings API endpoints - connects to real backend
 */
export const settingsApiClient = {
  // Get user preferences
  getPreferences: async () => {
    return apiRequest<Record<string, unknown>>('settings/preferences', {
      method: 'GET',
    });
  },

  // Update user preferences
  updatePreferences: async (preferences: Record<string, unknown>) => {
    return apiRequest<Record<string, unknown>>('settings/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },

  // Get dashboard configuration
  getDashboardConfig: async () => {
    return apiRequest<Record<string, unknown>>('settings/dashboard-config', {
      method: 'GET',
    });
  },

  // Update dashboard configuration
  updateDashboardConfig: async (config: Record<string, unknown>) => {
    return apiRequest<Record<string, unknown>>('settings/dashboard-config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  // Get notification settings
  getNotifications: async () => {
    return apiRequest<Record<string, unknown>>('settings/notifications', {
      method: 'GET',
    });
  },

  // Update notification settings
  updateNotifications: async (settings: Record<string, unknown>) => {
    return apiRequest<Record<string, unknown>>('settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

export default settingsApiClient;
