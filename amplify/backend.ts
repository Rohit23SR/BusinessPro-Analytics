import { defineBackend, defineFunction } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import {
  RestApi,
  LambdaIntegration,
  Cors,
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import {
  UserPool,
  UserPoolClient,
  AccountRecovery,
  Mfa,
} from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';

// Define Lambda functions
const dashboardApi = defineFunction({
  name: 'dashboard-api',
  entry: './functions/api/dashboard.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
});

const analyticsApi = defineFunction({
  name: 'analytics-api',
  entry: './functions/api/analytics.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
});

const settingsApi = defineFunction({
  name: 'settings-api',
  entry: './functions/api/settings.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
});

// Create the backend
const backend = defineBackend({
  dashboardApi,
  analyticsApi,
  settingsApi,
});

// Use the existing stack from one of the functions (avoids circular dependency)
const infraStack = Stack.of(backend.dashboardApi.resources.lambda);

// ===== COGNITO AUTHENTICATION =====
const userPool = new UserPool(infraStack, 'BusinessDashboardUserPool', {
  userPoolName: 'business-dashboard-users',
  selfSignUpEnabled: true,
  signInAliases: {
    email: true,
    username: false,
  },
  autoVerify: {
    email: true,
  },
  standardAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    fullname: {
      required: false,
      mutable: true,
    },
  },
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireDigits: true,
    requireSymbols: false,
  },
  accountRecovery: AccountRecovery.EMAIL_ONLY,
  mfa: Mfa.OPTIONAL,
});

const userPoolClient = new UserPoolClient(infraStack, 'BusinessDashboardUserPoolClient', {
  userPool,
  userPoolClientName: 'business-dashboard-web-client',
  authFlows: {
    userPassword: true,
    userSrp: true,
  },
  preventUserExistenceErrors: true,
});

// ===== DYNAMODB TABLES =====
// KPIs Table
const kpisTable = new Table(infraStack, 'KPIsTable', {
  partitionKey: { name: 'timeframe', type: AttributeType.STRING },
  sortKey: { name: 'title', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Revenue Table
const revenueTable = new Table(infraStack, 'RevenueTable', {
  partitionKey: { name: 'timeframe', type: AttributeType.STRING },
  sortKey: { name: 'month', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Traffic Sources Table
const trafficTable = new Table(infraStack, 'TrafficSourcesTable', {
  partitionKey: { name: 'timeframe', type: AttributeType.STRING },
  sortKey: { name: 'name', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Activities Table
const activitiesTable = new Table(infraStack, 'ActivitiesTable', {
  partitionKey: { name: 'id', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Products Table
const productsTable = new Table(infraStack, 'ProductsTable', {
  partitionKey: { name: 'timeframe', type: AttributeType.STRING },
  sortKey: { name: 'name', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Analytics Snapshots Table
const analyticsTable = new Table(infraStack, 'AnalyticsTable', {
  partitionKey: { name: 'timeframe', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// User Settings Table
const userSettingsTable = new Table(infraStack, 'UserSettingsTable', {
  partitionKey: { name: 'userId', type: AttributeType.STRING },
  sortKey: { name: 'settingType', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Grant Lambda functions access to DynamoDB tables
const dashboardTables = [kpisTable, revenueTable, trafficTable, activitiesTable, productsTable];
const analyticsTables = [analyticsTable, trafficTable];
const settingsTables = [userSettingsTable];

dashboardTables.forEach((table) => {
  table.grantReadWriteData(backend.dashboardApi.resources.lambda);
});

analyticsTables.forEach((table) => {
  table.grantReadWriteData(backend.analyticsApi.resources.lambda);
});

settingsTables.forEach((table) => {
  table.grantReadWriteData(backend.settingsApi.resources.lambda);
});

// Add environment variables to Lambda functions
const dashboardLambda = backend.dashboardApi.resources.lambda as LambdaFunction;
dashboardLambda.addEnvironment('KPIS_TABLE', kpisTable.tableName);
dashboardLambda.addEnvironment('REVENUE_TABLE', revenueTable.tableName);
dashboardLambda.addEnvironment('TRAFFIC_TABLE', trafficTable.tableName);
dashboardLambda.addEnvironment('ACTIVITIES_TABLE', activitiesTable.tableName);
dashboardLambda.addEnvironment('PRODUCTS_TABLE', productsTable.tableName);

const analyticsLambda = backend.analyticsApi.resources.lambda as LambdaFunction;
analyticsLambda.addEnvironment('ANALYTICS_TABLE', analyticsTable.tableName);
analyticsLambda.addEnvironment('TRAFFIC_TABLE', trafficTable.tableName);

const settingsLambda = backend.settingsApi.resources.lambda as LambdaFunction;
settingsLambda.addEnvironment('USER_SETTINGS_TABLE', userSettingsTable.tableName);

// ===== REST API WITH COGNITO AUTH =====
const restApi = new RestApi(infraStack, 'BusinessDashboardApi', {
  restApiName: 'Business Dashboard API',
  description: 'REST API for Business Dashboard with Cognito Authentication',
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
  },
});

// Create Cognito Authorizer
const cognitoAuthorizer = new CognitoUserPoolsAuthorizer(infraStack, 'CognitoAuthorizer', {
  cognitoUserPools: [userPool],
  authorizerName: 'BusinessDashboardAuthorizer',
});

// Dashboard endpoints (Protected)
const dashboard = restApi.root.addResource('dashboard');

const kpis = dashboard.addResource('kpis');
kpis.addMethod(
  'GET',
  new LambdaIntegration(backend.dashboardApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const revenue = dashboard.addResource('revenue');
revenue.addMethod(
  'GET',
  new LambdaIntegration(backend.dashboardApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const traffic = dashboard.addResource('traffic');
traffic.addMethod(
  'GET',
  new LambdaIntegration(backend.dashboardApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const activity = dashboard.addResource('activity');
activity.addMethod(
  'GET',
  new LambdaIntegration(backend.dashboardApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const products = dashboard.addResource('products');
products.addMethod(
  'GET',
  new LambdaIntegration(backend.dashboardApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

// Analytics endpoints (Protected)
const analytics = restApi.root.addResource('analytics');

const overview = analytics.addResource('overview');
overview.addMethod(
  'GET',
  new LambdaIntegration(backend.analyticsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const trafficAnalytics = analytics.addResource('traffic');
trafficAnalytics.addMethod(
  'GET',
  new LambdaIntegration(backend.analyticsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const funnel = analytics.addResource('funnel');
funnel.addMethod(
  'GET',
  new LambdaIntegration(backend.analyticsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const behavior = analytics.addResource('behavior');
behavior.addMethod(
  'GET',
  new LambdaIntegration(backend.analyticsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

// Settings endpoints (Protected)
const settings = restApi.root.addResource('settings');

const preferences = settings.addResource('preferences');
preferences.addMethod(
  'GET',
  new LambdaIntegration(backend.settingsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);
preferences.addMethod(
  'PUT',
  new LambdaIntegration(backend.settingsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const dashboardConfig = settings.addResource('dashboard-config');
dashboardConfig.addMethod(
  'GET',
  new LambdaIntegration(backend.settingsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);
dashboardConfig.addMethod(
  'PUT',
  new LambdaIntegration(backend.settingsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

const notifications = settings.addResource('notifications');
notifications.addMethod(
  'GET',
  new LambdaIntegration(backend.settingsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);
notifications.addMethod(
  'PUT',
  new LambdaIntegration(backend.settingsApi.resources.lambda),
  {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  }
);

// Add outputs for frontend configuration
backend.addOutput({
  custom: {
    API: {
      endpoint: restApi.url,
    },
    Auth: {
      userPoolId: userPool.userPoolId,
      userPoolClientId: userPoolClient.userPoolClientId,
      region: Stack.of(infraStack).region,
    },
  },
});

export default backend;
