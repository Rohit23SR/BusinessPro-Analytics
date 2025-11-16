import { Amplify } from 'aws-amplify';

// Configuration state
let apiEndpoint: string | null = null;
let authConfig: {
  userPoolId: string;
  userPoolClientId: string;
  region: string;
} | null = null;

/**
 * Configure Amplify with the generated outputs
 * Call this function once at app startup
 */
export const configureAmplify = async () => {
  try {
    // Dynamic import of the generated config
    const outputs = await import('../../amplify_outputs.json');

    // Extract API endpoint
    if (outputs.default?.custom?.API?.endpoint) {
      apiEndpoint = outputs.default.custom.API.endpoint;
      console.log('API configured:', apiEndpoint);
    }

    // Extract Auth config
    if (outputs.default?.custom?.Auth) {
      authConfig = outputs.default.custom.Auth;

      // Configure Amplify with Auth
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: authConfig.userPoolId,
            userPoolClientId: authConfig.userPoolClientId,
            signUpVerificationMethod: 'code',
          },
        },
      });

      console.log('Auth configured:', authConfig.userPoolId);
    }
  } catch (error) {
    console.warn(
      'Amplify outputs not found. Run `npx ampx sandbox` to generate them.',
      'Using mock data instead.',
      error
    );
  }
};

/**
 * Get the API base URL
 */
export const getApiEndpoint = (): string | null => apiEndpoint;

/**
 * Get the Auth configuration
 */
export const getAuthConfig = () => authConfig;

/**
 * Check if the API is configured
 */
export const isApiConfigured = (): boolean => apiEndpoint !== null;

/**
 * Check if Auth is configured
 */
export const isAuthConfigured = (): boolean => authConfig !== null;

/**
 * Helper to check if we should use mock data
 */
export const shouldUseMockData = (): boolean => {
  return !apiEndpoint || import.meta.env.VITE_USE_MOCK_DATA === 'true';
};
