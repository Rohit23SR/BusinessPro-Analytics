import type { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const USER_SETTINGS_TABLE = process.env.USER_SETTINGS_TABLE || 'business-dashboard-user-settings';

// Default settings
const defaultPreferences = {
  theme: 'light',
  language: 'en',
  timezone: 'America/New_York',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  notifications: { email: true, push: true, sms: false },
  privacy: { analytics: true, marketing: false, sharing: true },
};

const defaultDashboardConfig = {
  layout: 'grid',
  widgets: {
    kpis: { enabled: true, position: 1 },
    revenueChart: { enabled: true, position: 2 },
    trafficSources: { enabled: true, position: 3 },
    recentActivity: { enabled: true, position: 4 },
    topProducts: { enabled: true, position: 5 },
  },
  autoRefresh: true,
  refreshInterval: 30000,
  defaultTimeframe: '30d',
};

const defaultNotificationConfig = {
  emailNotifications: {
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true,
    alerts: true,
    promotions: false,
  },
  pushNotifications: {
    realTimeAlerts: true,
    systemUpdates: true,
    newFeatures: false,
  },
  alertThresholds: {
    revenueDropPercentage: 10,
    conversionRateDropPercentage: 15,
    trafficDropPercentage: 20,
  },
};

// Helper to get user ID from Cognito claims
const getUserId = (event: APIGatewayProxyEvent): string => {
  // Get user ID from Cognito authorizer claims
  const claims = event.requestContext.authorizer?.claims;
  if (claims && claims.sub) {
    return claims.sub;
  }
  // Fallback to a default user ID for testing
  return 'default-user';
};

// Helper to create API response
const createResponse = (statusCode: number, body: object): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Api-Key',
  },
  body: JSON.stringify({
    data: body,
    status: statusCode,
    timestamp: new Date().toISOString(),
    meta: {
      requestId: Math.random().toString(36).substr(2, 9),
      version: '1.0.0',
    },
  }),
});

// Main handler
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const path = event.path;
  const method = event.httpMethod;
  const userId = getUserId(event);

  try {
    // User Preferences
    if (path.includes('/preferences')) {
      if (method === 'GET') {
        const result = await docClient.send(
          new GetCommand({
            TableName: USER_SETTINGS_TABLE,
            Key: { userId, settingType: 'preferences' },
          })
        );

        if (!result.Item) {
          // Create default preferences
          await docClient.send(
            new PutCommand({
              TableName: USER_SETTINGS_TABLE,
              Item: {
                userId,
                settingType: 'preferences',
                ...defaultPreferences,
                updatedAt: new Date().toISOString(),
              },
            })
          );
          return createResponse(200, defaultPreferences);
        }

        // Remove DynamoDB metadata from response
        const { userId: _, settingType: __, updatedAt: ___, ...preferences } = result.Item;
        return createResponse(200, preferences);
      }

      if (method === 'PUT') {
        const body = JSON.parse(event.body || '{}');

        // Get existing preferences
        const existing = await docClient.send(
          new GetCommand({
            TableName: USER_SETTINGS_TABLE,
            Key: { userId, settingType: 'preferences' },
          })
        );

        const currentPrefs = existing.Item || defaultPreferences;
        const updatedPrefs = {
          ...currentPrefs,
          ...body,
          userId,
          settingType: 'preferences',
          updatedAt: new Date().toISOString(),
        };

        await docClient.send(
          new PutCommand({
            TableName: USER_SETTINGS_TABLE,
            Item: updatedPrefs,
          })
        );

        const { userId: _, settingType: __, updatedAt: ___, ...prefs } = updatedPrefs;
        return createResponse(200, prefs);
      }
    }

    // Dashboard Config
    if (path.includes('/dashboard-config')) {
      if (method === 'GET') {
        const result = await docClient.send(
          new GetCommand({
            TableName: USER_SETTINGS_TABLE,
            Key: { userId, settingType: 'dashboard-config' },
          })
        );

        if (!result.Item) {
          await docClient.send(
            new PutCommand({
              TableName: USER_SETTINGS_TABLE,
              Item: {
                userId,
                settingType: 'dashboard-config',
                ...defaultDashboardConfig,
                updatedAt: new Date().toISOString(),
              },
            })
          );
          return createResponse(200, defaultDashboardConfig);
        }

        const { userId: _, settingType: __, updatedAt: ___, ...config } = result.Item;
        return createResponse(200, config);
      }

      if (method === 'PUT') {
        const body = JSON.parse(event.body || '{}');

        const existing = await docClient.send(
          new GetCommand({
            TableName: USER_SETTINGS_TABLE,
            Key: { userId, settingType: 'dashboard-config' },
          })
        );

        const currentConfig = existing.Item || defaultDashboardConfig;
        const updatedConfig = {
          ...currentConfig,
          ...body,
          userId,
          settingType: 'dashboard-config',
          updatedAt: new Date().toISOString(),
        };

        await docClient.send(
          new PutCommand({
            TableName: USER_SETTINGS_TABLE,
            Item: updatedConfig,
          })
        );

        const { userId: _, settingType: __, updatedAt: ___, ...config } = updatedConfig;
        return createResponse(200, config);
      }
    }

    // Notification Config
    if (path.includes('/notifications')) {
      if (method === 'GET') {
        const result = await docClient.send(
          new GetCommand({
            TableName: USER_SETTINGS_TABLE,
            Key: { userId, settingType: 'notifications' },
          })
        );

        if (!result.Item) {
          await docClient.send(
            new PutCommand({
              TableName: USER_SETTINGS_TABLE,
              Item: {
                userId,
                settingType: 'notifications',
                ...defaultNotificationConfig,
                updatedAt: new Date().toISOString(),
              },
            })
          );
          return createResponse(200, defaultNotificationConfig);
        }

        const { userId: _, settingType: __, updatedAt: ___, ...notifications } = result.Item;
        return createResponse(200, notifications);
      }

      if (method === 'PUT') {
        const body = JSON.parse(event.body || '{}');

        const existing = await docClient.send(
          new GetCommand({
            TableName: USER_SETTINGS_TABLE,
            Key: { userId, settingType: 'notifications' },
          })
        );

        const currentNotifs = existing.Item || defaultNotificationConfig;
        const updatedNotifs = {
          ...currentNotifs,
          ...body,
          userId,
          settingType: 'notifications',
          updatedAt: new Date().toISOString(),
        };

        await docClient.send(
          new PutCommand({
            TableName: USER_SETTINGS_TABLE,
            Item: updatedNotifs,
          })
        );

        const { userId: _, settingType: __, updatedAt: ___, ...notifications } = updatedNotifs;
        return createResponse(200, notifications);
      }
    }

    return createResponse(404, { error: 'Endpoint not found' });
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Internal server error', details: String(error) });
  }
};
