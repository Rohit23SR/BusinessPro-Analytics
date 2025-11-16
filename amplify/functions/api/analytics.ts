import type { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Types
interface AnalyticsOverview {
  totalSessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  conversionRate: number;
  newUsers: number;
  returningUsers: number;
}

interface TrafficData {
  day: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
}

interface ConversionFunnelStep {
  step: string;
  visitors: number;
  percentage: number;
}

// Sample data
const overviewData: Record<string, AnalyticsOverview> = {
  '7d': {
    totalSessions: 12450,
    pageViews: 45230,
    bounceRate: 42.3,
    avgSessionDuration: '3:24',
    conversionRate: 3.2,
    newUsers: 4820,
    returningUsers: 7630,
  },
  '30d': {
    totalSessions: 52890,
    pageViews: 198450,
    bounceRate: 38.7,
    avgSessionDuration: '4:12',
    conversionRate: 3.8,
    newUsers: 18920,
    returningUsers: 33970,
  },
  '90d': {
    totalSessions: 156780,
    pageViews: 612340,
    bounceRate: 35.2,
    avgSessionDuration: '4:45',
    conversionRate: 4.1,
    newUsers: 52340,
    returningUsers: 104440,
  },
};

const trafficData: TrafficData[] = [
  { day: 'Mon', sessions: 1250, users: 980, pageViews: 4520, bounceRate: 38.2 },
  { day: 'Tue', sessions: 1380, users: 1120, pageViews: 5230, bounceRate: 36.8 },
  { day: 'Wed', sessions: 1520, users: 1280, pageViews: 5890, bounceRate: 35.4 },
  { day: 'Thu', sessions: 1450, users: 1190, pageViews: 5420, bounceRate: 37.1 },
  { day: 'Fri', sessions: 1680, users: 1420, pageViews: 6340, bounceRate: 34.2 },
  { day: 'Sat', sessions: 890, users: 720, pageViews: 3120, bounceRate: 42.8 },
  { day: 'Sun', sessions: 780, users: 640, pageViews: 2780, bounceRate: 44.5 },
];

const conversionFunnel: ConversionFunnelStep[] = [
  { step: 'Page Views', visitors: 10000, percentage: 100 },
  { step: 'Product Views', visitors: 6500, percentage: 65 },
  { step: 'Add to Cart', visitors: 2800, percentage: 28 },
  { step: 'Checkout', visitors: 1200, percentage: 12 },
  { step: 'Purchase', visitors: 380, percentage: 3.8 },
];

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
  const queryParams = event.queryStringParameters || {};

  try {
    if (path.includes('/overview')) {
      const timeframe = queryParams.timeframe || '30d';
      const data = overviewData[timeframe] || overviewData['30d'];
      return createResponse(200, { ...data, appliedFilters: queryParams });
    }

    if (path.includes('/traffic')) {
      return createResponse(200, { traffic: trafficData, appliedFilters: queryParams });
    }

    if (path.includes('/funnel')) {
      return createResponse(200, { funnel: conversionFunnel, appliedFilters: queryParams });
    }

    if (path.includes('/behavior')) {
      // Sample behavior data
      const behaviorData = {
        heatmapData: [
          { hour: 9, day: 1, value: 45 },
          { hour: 10, day: 1, value: 62 },
          { hour: 11, day: 1, value: 78 },
          { hour: 12, day: 1, value: 85 },
          { hour: 14, day: 2, value: 92 },
          { hour: 15, day: 2, value: 88 },
        ],
        deviceBreakdown: [
          { device: 'Desktop', sessions: 32450, percentage: 58.2 },
          { device: 'Mobile', sessions: 18920, percentage: 33.9 },
          { device: 'Tablet', sessions: 4420, percentage: 7.9 },
        ],
        appliedFilters: queryParams,
      };
      return createResponse(200, behaviorData);
    }

    return createResponse(404, { error: 'Endpoint not found' });
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
