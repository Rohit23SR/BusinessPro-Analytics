import type { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand, PutCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment variables
const KPIS_TABLE = process.env.KPIS_TABLE || 'business-dashboard-kpis';
const REVENUE_TABLE = process.env.REVENUE_TABLE || 'business-dashboard-revenue';
const TRAFFIC_TABLE = process.env.TRAFFIC_TABLE || 'business-dashboard-traffic';
const ACTIVITIES_TABLE = process.env.ACTIVITIES_TABLE || 'business-dashboard-activities';
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'business-dashboard-products';

// Seed data for initial setup
const seedKPIs = async () => {
  const kpiData = [
    { timeframe: '7d', title: 'Total Revenue', value: '$12,426', change: '+8.2%', trend: 'up', icon: 'DollarSign' },
    { timeframe: '7d', title: 'New Customers', value: '148', change: '+12.5%', trend: 'up', icon: 'Users' },
    { timeframe: '7d', title: 'Conversion Rate', value: '3.2%', change: '-0.4%', trend: 'down', icon: 'TrendingUp' },
    { timeframe: '7d', title: 'Avg Order Value', value: '$84', change: '+5.1%', trend: 'up', icon: 'ShoppingCart' },
    { timeframe: '30d', title: 'Total Revenue', value: '$48,352', change: '+12.5%', trend: 'up', icon: 'DollarSign' },
    { timeframe: '30d', title: 'New Customers', value: '573', change: '+18.2%', trend: 'up', icon: 'Users' },
    { timeframe: '30d', title: 'Conversion Rate', value: '3.8%', change: '+0.6%', trend: 'up', icon: 'TrendingUp' },
    { timeframe: '30d', title: 'Avg Order Value', value: '$92', change: '+8.3%', trend: 'up', icon: 'ShoppingCart' },
    { timeframe: '90d', title: 'Total Revenue', value: '$142,890', change: '+22.1%', trend: 'up', icon: 'DollarSign' },
    { timeframe: '90d', title: 'New Customers', value: '1,842', change: '+28.7%', trend: 'up', icon: 'Users' },
    { timeframe: '90d', title: 'Conversion Rate', value: '4.1%', change: '+1.2%', trend: 'up', icon: 'TrendingUp' },
    { timeframe: '90d', title: 'Avg Order Value', value: '$98', change: '+12.4%', trend: 'up', icon: 'ShoppingCart' },
  ];

  const writeRequests = kpiData.map((item) => ({
    PutRequest: { Item: item },
  }));

  // BatchWrite has a limit of 25 items
  for (let i = 0; i < writeRequests.length; i += 25) {
    const batch = writeRequests.slice(i, i + 25);
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [KPIS_TABLE]: batch,
        },
      })
    );
  }
};

const seedRevenue = async () => {
  const revenueData = [
    { timeframe: '6m', month: '01-Jan', revenue: 42000, customers: 320, orders: 480, target: 40000 },
    { timeframe: '6m', month: '02-Feb', revenue: 38000, customers: 290, orders: 420, target: 42000 },
    { timeframe: '6m', month: '03-Mar', revenue: 51000, customers: 410, orders: 580, target: 45000 },
    { timeframe: '6m', month: '04-Apr', revenue: 47000, customers: 380, orders: 520, target: 48000 },
    { timeframe: '6m', month: '05-May', revenue: 54000, customers: 450, orders: 620, target: 50000 },
    { timeframe: '6m', month: '06-Jun', revenue: 58000, customers: 490, orders: 680, target: 52000 },
  ];

  const writeRequests = revenueData.map((item) => ({
    PutRequest: { Item: item },
  }));

  await docClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [REVENUE_TABLE]: writeRequests,
      },
    })
  );
};

const seedTrafficSources = async () => {
  const trafficData = [
    { timeframe: '30d', name: 'Direct', value: 35, color: '#3B82F6' },
    { timeframe: '30d', name: 'Organic Search', value: 28, color: '#10B981' },
    { timeframe: '30d', name: 'Social Media', value: 22, color: '#F59E0B' },
    { timeframe: '30d', name: 'Referral', value: 15, color: '#8B5CF6' },
  ];

  const writeRequests = trafficData.map((item) => ({
    PutRequest: { Item: item },
  }));

  await docClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [TRAFFIC_TABLE]: writeRequests,
      },
    })
  );
};

const seedActivities = async () => {
  const activities = [
    { id: '1', activityType: 'New Order #1234', user: 'John Smith', time: '2 min ago', status: 'Completed', timestamp: new Date().toISOString() },
    { id: '2', activityType: 'Payment Received', user: 'Jane Doe', time: '5 min ago', status: 'Success', timestamp: new Date().toISOString() },
    { id: '3', activityType: 'User Registration', user: 'Mike Johnson', time: '12 min ago', status: 'Completed', timestamp: new Date().toISOString() },
    { id: '4', activityType: 'Product Update', user: 'Sarah Wilson', time: '25 min ago', status: 'Pending', timestamp: new Date().toISOString() },
    { id: '5', activityType: 'Subscription Upgrade', user: 'Alex Chen', time: '1 hour ago', status: 'Active', timestamp: new Date().toISOString() },
  ];

  const writeRequests = activities.map((item) => ({
    PutRequest: { Item: item },
  }));

  await docClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [ACTIVITIES_TABLE]: writeRequests,
      },
    })
  );
};

const seedProducts = async () => {
  const products = [
    { timeframe: '30d', name: 'Wireless Headphones', sales: 1234, revenue: '$98,720', growth: '+15.3%', category: 'Electronics' },
    { timeframe: '30d', name: 'Smart Watch Pro', sales: 982, revenue: '$147,300', growth: '+22.1%', category: 'Electronics' },
    { timeframe: '30d', name: 'Laptop Stand', sales: 876, revenue: '$35,040', growth: '+8.7%', category: 'Accessories' },
    { timeframe: '30d', name: 'USB-C Hub', sales: 745, revenue: '$44,700', growth: '+12.4%', category: 'Accessories' },
    { timeframe: '30d', name: 'Mechanical Keyboard', sales: 623, revenue: '$74,760', growth: '+18.9%', category: 'Electronics' },
  ];

  const writeRequests = products.map((item) => ({
    PutRequest: { Item: item },
  }));

  await docClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [PRODUCTS_TABLE]: writeRequests,
      },
    })
  );
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
  const queryParams = event.queryStringParameters || {};

  try {
    // KPIs endpoint
    if (path.includes('/kpis')) {
      const timeframe = queryParams.timeframe || '30d';

      const result = await docClient.send(
        new QueryCommand({
          TableName: KPIS_TABLE,
          KeyConditionExpression: 'timeframe = :tf',
          ExpressionAttributeValues: {
            ':tf': timeframe,
          },
        })
      );

      // Seed data if table is empty
      if (!result.Items || result.Items.length === 0) {
        await seedKPIs();
        const retryResult = await docClient.send(
          new QueryCommand({
            TableName: KPIS_TABLE,
            KeyConditionExpression: 'timeframe = :tf',
            ExpressionAttributeValues: {
              ':tf': timeframe,
            },
          })
        );
        return createResponse(200, retryResult.Items || []);
      }

      return createResponse(200, result.Items);
    }

    // Revenue endpoint
    if (path.includes('/revenue')) {
      const timeframe = queryParams.timeframe || '6m';

      const result = await docClient.send(
        new QueryCommand({
          TableName: REVENUE_TABLE,
          KeyConditionExpression: 'timeframe = :tf',
          ExpressionAttributeValues: {
            ':tf': timeframe,
          },
        })
      );

      if (!result.Items || result.Items.length === 0) {
        await seedRevenue();
        const retryResult = await docClient.send(
          new QueryCommand({
            TableName: REVENUE_TABLE,
            KeyConditionExpression: 'timeframe = :tf',
            ExpressionAttributeValues: {
              ':tf': timeframe,
            },
          })
        );
        // Clean up month format for response
        const cleanedData = (retryResult.Items || []).map((item: Record<string, unknown>) => ({
          ...item,
          month: (item.month as string).split('-')[1],
        }));
        return createResponse(200, cleanedData);
      }

      const cleanedData = result.Items.map((item: Record<string, unknown>) => ({
        ...item,
        month: (item.month as string).split('-')[1],
      }));
      return createResponse(200, cleanedData);
    }

    // Traffic sources endpoint
    if (path.includes('/traffic')) {
      const timeframe = queryParams.timeframe || '30d';

      const result = await docClient.send(
        new QueryCommand({
          TableName: TRAFFIC_TABLE,
          KeyConditionExpression: 'timeframe = :tf',
          ExpressionAttributeValues: {
            ':tf': timeframe,
          },
        })
      );

      if (!result.Items || result.Items.length === 0) {
        await seedTrafficSources();
        const retryResult = await docClient.send(
          new QueryCommand({
            TableName: TRAFFIC_TABLE,
            KeyConditionExpression: 'timeframe = :tf',
            ExpressionAttributeValues: {
              ':tf': timeframe,
            },
          })
        );
        return createResponse(200, retryResult.Items || []);
      }

      return createResponse(200, result.Items);
    }

    // Activity endpoint
    if (path.includes('/activity')) {
      const limit = parseInt(queryParams.limit || '10', 10);

      const result = await docClient.send(
        new ScanCommand({
          TableName: ACTIVITIES_TABLE,
          Limit: limit,
        })
      );

      if (!result.Items || result.Items.length === 0) {
        await seedActivities();
        const retryResult = await docClient.send(
          new ScanCommand({
            TableName: ACTIVITIES_TABLE,
            Limit: limit,
          })
        );
        // Transform to match expected format
        const activities = (retryResult.Items || []).map((item: Record<string, unknown>) => ({
          id: parseInt(item.id as string, 10),
          activity: item.activityType,
          user: item.user,
          time: item.time,
          status: item.status,
        }));
        return createResponse(200, activities);
      }

      const activities = result.Items.map((item: Record<string, unknown>) => ({
        id: parseInt(item.id as string, 10),
        activity: item.activityType,
        user: item.user,
        time: item.time,
        status: item.status,
      }));
      return createResponse(200, activities);
    }

    // Products endpoint
    if (path.includes('/products')) {
      const timeframe = queryParams.timeframe || '30d';
      const limit = parseInt(queryParams.limit || '5', 10);

      const result = await docClient.send(
        new QueryCommand({
          TableName: PRODUCTS_TABLE,
          KeyConditionExpression: 'timeframe = :tf',
          ExpressionAttributeValues: {
            ':tf': timeframe,
          },
          Limit: limit,
        })
      );

      if (!result.Items || result.Items.length === 0) {
        await seedProducts();
        const retryResult = await docClient.send(
          new QueryCommand({
            TableName: PRODUCTS_TABLE,
            KeyConditionExpression: 'timeframe = :tf',
            ExpressionAttributeValues: {
              ':tf': timeframe,
            },
            Limit: limit,
          })
        );
        return createResponse(200, retryResult.Items || []);
      }

      return createResponse(200, result.Items);
    }

    return createResponse(404, { error: 'Endpoint not found' });
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Internal server error', details: String(error) });
  }
};
