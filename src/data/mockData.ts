import type {
  KPI,
  RevenueData,
  TrafficSource,
  Activity,
  Product,
  AnalyticsOverview,
  TrafficData,
  ConversionFunnelStep,
  LandingPage,
  UserBehaviorData,
  CohortAnalysis,
  UserPreferences,
  DashboardConfig,
  NotificationConfig,
  TimeFrame
} from '../types';

// Comprehensive mock data for the business dashboard
interface MockData {
  dashboard: {
    kpis: Record<TimeFrame, KPI[]>;
    revenueTrends: Record<'6m' | '12m', RevenueData[]>;
    trafficSources: Record<TimeFrame, TrafficSource[]>;
    recentActivity: Activity[];
    topProducts: Record<TimeFrame, Product[]>;
  };
  analytics: {
    overview: Record<TimeFrame, AnalyticsOverview>;
    traffic: Record<TimeFrame, TrafficData[]>;
    conversionFunnel: Record<TimeFrame, ConversionFunnelStep[]>;
    userBehavior: Record<TimeFrame, UserBehaviorData>;
    topLandingPages: Record<TimeFrame, LandingPage[]>;
    cohortAnalysis: {
      weekly: CohortAnalysis;
      monthly: CohortAnalysis;
    };
  };
  settings: {
    userPreferences: UserPreferences;
    dashboardConfig: DashboardConfig;
    notifications: NotificationConfig;
  };
}

export const mockData: MockData = {
  // Dashboard data
  dashboard: {
    kpis: {
      '7d': [
        { title: 'Total Revenue', value: '$28,450', change: '+5.2%', trend: 'up', icon: 'DollarSign' },
        { title: 'New Customers', value: '312', change: '+12.8%', trend: 'up', icon: 'Users' },
        { title: 'Conversion Rate', value: '3.8%', change: '+2.1%', trend: 'up', icon: 'Activity' },
        { title: 'Avg Order Value', value: '$91.25', change: '+3.4%', trend: 'up', icon: 'ShoppingCart' }
      ],
      '30d': [
        { title: 'Total Revenue', value: '$124,563', change: '+12.5%', trend: 'up', icon: 'DollarSign' },
        { title: 'New Customers', value: '1,247', change: '+8.2%', trend: 'up', icon: 'Users' },
        { title: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down', icon: 'Activity' },
        { title: 'Avg Order Value', value: '$89.32', change: '+5.7%', trend: 'up', icon: 'ShoppingCart' }
      ],
      '90d': [
        { title: 'Total Revenue', value: '$387,920', change: '+18.7%', trend: 'up', icon: 'DollarSign' },
        { title: 'New Customers', value: '3,841', change: '+15.3%', trend: 'up', icon: 'Users' },
        { title: 'Conversion Rate', value: '3.1%', change: '-1.8%', trend: 'down', icon: 'Activity' },
        { title: 'Avg Order Value', value: '$87.65', change: '+2.9%', trend: 'up', icon: 'ShoppingCart' }
      ],
      '6m': [
        { title: 'Total Revenue', value: '$687,420', change: '+22.3%', trend: 'up', icon: 'DollarSign' },
        { title: 'New Customers', value: '6,234', change: '+18.7%', trend: 'up', icon: 'Users' },
        { title: 'Conversion Rate', value: '3.05%', change: '-0.8%', trend: 'down', icon: 'Activity' },
        { title: 'Avg Order Value', value: '$86.12', change: '+1.9%', trend: 'up', icon: 'ShoppingCart' }
      ],
      '12m': [
        { title: 'Total Revenue', value: '$1,234,567', change: '+28.4%', trend: 'up', icon: 'DollarSign' },
        { title: 'New Customers', value: '12,847', change: '+24.1%', trend: 'up', icon: 'Users' },
        { title: 'Conversion Rate', value: '2.98%', change: '-1.2%', trend: 'down', icon: 'Activity' },
        { title: 'Avg Order Value', value: '$84.67', change: '+3.8%', trend: 'up', icon: 'ShoppingCart' }
      ]
    },
    
    revenueTrends: {
      '6m': [
        { month: 'Jan', revenue: 65000, customers: 1200, orders: 890, target: 70000 },
        { month: 'Feb', revenue: 72000, customers: 1350, orders: 920, target: 75000 },
        { month: 'Mar', revenue: 68000, customers: 1180, orders: 850, target: 72000 },
        { month: 'Apr', revenue: 85000, customers: 1580, orders: 1100, target: 80000 },
        { month: 'May', revenue: 92000, customers: 1720, orders: 1250, target: 85000 },
        { month: 'Jun', revenue: 124563, customers: 1890, orders: 1430, target: 95000 }
      ],
      '12m': [
        { month: 'Jan 2024', revenue: 45000, customers: 890, orders: 650, target: 50000 },
        { month: 'Feb', revenue: 52000, customers: 980, orders: 720, target: 55000 },
        { month: 'Mar', revenue: 48000, customers: 850, orders: 680, target: 52000 },
        { month: 'Apr', revenue: 61000, customers: 1150, orders: 820, target: 60000 },
        { month: 'May', revenue: 58000, customers: 1080, orders: 780, target: 62000 },
        { month: 'Jun', revenue: 67000, customers: 1280, orders: 890, target: 65000 },
        { month: 'Jul', revenue: 72000, customers: 1350, orders: 920, target: 70000 },
        { month: 'Aug', revenue: 69000, customers: 1290, orders: 880, target: 72000 },
        { month: 'Sep', revenue: 78000, customers: 1460, orders: 1050, target: 75000 },
        { month: 'Oct', revenue: 85000, customers: 1580, orders: 1100, target: 80000 },
        { month: 'Nov', revenue: 92000, customers: 1720, orders: 1250, target: 85000 },
        { month: 'Dec', revenue: 124563, customers: 1890, orders: 1430, target: 95000 }
      ]
    },
    
    trafficSources: {
      '7d': [
        { name: 'Organic Search', value: 42, color: '#6366f1' },
        { name: 'Direct', value: 28, color: '#8b5cf6' },
        { name: 'Social Media', value: 20, color: '#06b6d4' },
        { name: 'Email', value: 10, color: '#10b981' }
      ],
      '30d': [
        { name: 'Organic Search', value: 45, color: '#6366f1' },
        { name: 'Direct', value: 25, color: '#8b5cf6' },
        { name: 'Social Media', value: 18, color: '#06b6d4' },
        { name: 'Email', value: 12, color: '#10b981' }
      ],
      '90d': [
        { name: 'Organic Search', value: 48, color: '#6366f1' },
        { name: 'Direct', value: 22, color: '#8b5cf6' },
        { name: 'Social Media', value: 16, color: '#06b6d4' },
        { name: 'Email', value: 14, color: '#10b981' }
      ],
      '6m': [
        { name: 'Organic Search', value: 50, color: '#6366f1' },
        { name: 'Direct', value: 21, color: '#8b5cf6' },
        { name: 'Social Media', value: 15, color: '#06b6d4' },
        { name: 'Email', value: 14, color: '#10b981' }
      ],
      '12m': [
        { name: 'Organic Search', value: 52, color: '#6366f1' },
        { name: 'Direct', value: 20, color: '#8b5cf6' },
        { name: 'Social Media', value: 14, color: '#06b6d4' },
        { name: 'Email', value: 14, color: '#10b981' }
      ]
    },
    
    recentActivity: [
      { id: 1, activity: 'New Order #1234', user: 'John Smith', time: '2m ago', status: 'Completed' },
      { id: 2, activity: 'Payment Received', user: 'Sarah Johnson', time: '5m ago', status: 'Success' },
      { id: 3, activity: 'Support Ticket #5678', user: 'Mike Wilson', time: '12m ago', status: 'Pending' },
      { id: 4, activity: 'User Registration', user: 'Lisa Brown', time: '18m ago', status: 'Active' },
      { id: 5, activity: 'Subscription Upgrade', user: 'David Lee', time: '25m ago', status: 'Completed' },
      { id: 6, activity: 'New Order #1235', user: 'Emma Davis', time: '32m ago', status: 'Processing' },
      { id: 7, activity: 'Refund Request', user: 'Tom Miller', time: '45m ago', status: 'Pending' },
      { id: 8, activity: 'Password Reset', user: 'Anna Wilson', time: '1h ago', status: 'Completed' }
    ],
    
    topProducts: {
      '7d': [
        { name: 'Premium Widget Pro', sales: 312, revenue: '$12,480', growth: '+18.5%', category: 'Premium' },
        { name: 'Standard Package', sales: 189, revenue: '$7,560', growth: '+12.3%', category: 'Standard' },
        { name: 'Basic Service', sales: 145, revenue: '$2,900', growth: '-5.2%', category: 'Basic' },
        { name: 'Enterprise Solution', sales: 67, revenue: '$23,450', growth: '+28.7%', category: 'Enterprise' }
      ],
      '30d': [
        { name: 'Premium Widget Pro', sales: 1234, revenue: '$45,678', growth: '+15.3%', category: 'Premium' },
        { name: 'Standard Package', sales: 856, revenue: '$23,456', growth: '+8.7%', category: 'Standard' },
        { name: 'Basic Service', sales: 642, revenue: '$12,890', growth: '-3.2%', category: 'Basic' },
        { name: 'Enterprise Solution', sales: 234, revenue: '$78,901', growth: '+22.1%', category: 'Enterprise' },
        { name: 'Consulting Hours', sales: 445, revenue: '$31,150', growth: '+11.8%', category: 'Services' }
      ],
      '90d': [
        { name: 'Premium Widget Pro', sales: 3567, revenue: '$132,458', growth: '+19.2%', category: 'Premium' },
        { name: 'Standard Package', sales: 2341, revenue: '$64,123', growth: '+13.5%', category: 'Standard' },
        { name: 'Enterprise Solution', sales: 678, revenue: '$234,567', growth: '+25.8%', category: 'Enterprise' },
        { name: 'Basic Service', sales: 1823, revenue: '$35,467', growth: '-1.8%', category: 'Basic' },
        { name: 'Consulting Hours', sales: 1256, revenue: '$87,920', growth: '+16.4%', category: 'Services' }
      ],
      '6m': [
        { name: 'Premium Widget Pro', sales: 6234, revenue: '$234,567', growth: '+21.4%', category: 'Premium' },
        { name: 'Enterprise Solution', sales: 1234, revenue: '$456,789', growth: '+28.9%', category: 'Enterprise' },
        { name: 'Standard Package', sales: 4567, revenue: '$123,456', growth: '+16.2%', category: 'Standard' },
        { name: 'Consulting Hours', sales: 2345, revenue: '$164,150', growth: '+18.7%', category: 'Services' },
        { name: 'Basic Service', sales: 3456, revenue: '$69,120', growth: '+2.1%', category: 'Basic' }
      ],
      '12m': [
        { name: 'Premium Widget Pro', sales: 12345, revenue: '$456,789', growth: '+24.6%', category: 'Premium' },
        { name: 'Enterprise Solution', sales: 2456, revenue: '$891,234', growth: '+32.1%', category: 'Enterprise' },
        { name: 'Standard Package', sales: 8901, revenue: '$234,567', growth: '+18.9%', category: 'Standard' },
        { name: 'Consulting Hours', sales: 4567, revenue: '$319,690', growth: '+22.3%', category: 'Services' },
        { name: 'Basic Service', sales: 6789, revenue: '$135,780', growth: '+5.4%', category: 'Basic' }
      ]
    }
  },
  
  // Analytics data
  analytics: {
    overview: {
      '7d': {
        totalSessions: 34567,
        pageViews: 89123,
        bounceRate: 26.8,
        avgSessionDuration: '2m 15s',
        conversionRate: 3.8,
        newUsers: 8456,
        returningUsers: 26111
      },
      '30d': {
        totalSessions: 156847,
        pageViews: 428931,
        bounceRate: 24.7,
        avgSessionDuration: '3m 42s',
        conversionRate: 3.24,
        newUsers: 42567,
        returningUsers: 114280
      },
      '90d': {
        totalSessions: 487532,
        pageViews: 1284567,
        bounceRate: 25.2,
        avgSessionDuration: '3m 28s',
        conversionRate: 3.1,
        newUsers: 135678,
        returningUsers: 351854
      },
      '6m': {
        totalSessions: 934567,
        pageViews: 2456789,
        bounceRate: 24.9,
        avgSessionDuration: '3m 35s',
        conversionRate: 3.05,
        newUsers: 267890,
        returningUsers: 666677
      },
      '12m': {
        totalSessions: 1876543,
        pageViews: 4987654,
        bounceRate: 25.1,
        avgSessionDuration: '3m 41s',
        conversionRate: 2.98,
        newUsers: 543210,
        returningUsers: 1333333
      }
    },
    
    traffic: {
      '7d': [
        { day: 'Mon', sessions: 4200, users: 3800, pageViews: 12600, bounceRate: 28 },
        { day: 'Tue', sessions: 3800, users: 3400, pageViews: 11400, bounceRate: 26 },
        { day: 'Wed', sessions: 5100, users: 4600, pageViews: 15300, bounceRate: 24 },
        { day: 'Thu', sessions: 4700, users: 4200, pageViews: 14100, bounceRate: 25 },
        { day: 'Fri', sessions: 5400, users: 4900, pageViews: 16200, bounceRate: 23 },
        { day: 'Sat', sessions: 3900, users: 3500, pageViews: 11700, bounceRate: 29 },
        { day: 'Sun', sessions: 3800, users: 3400, pageViews: 11400, bounceRate: 27 }
      ],
      '30d': [
        { day: 'Week 1', sessions: 24000, users: 21000, pageViews: 72000, bounceRate: 24 },
        { day: 'Week 2', sessions: 19800, users: 17200, pageViews: 59400, bounceRate: 28 },
        { day: 'Week 3', sessions: 28500, users: 25100, pageViews: 85500, bounceRate: 22 },
        { day: 'Week 4', sessions: 31200, users: 27800, pageViews: 93600, bounceRate: 23 }
      ],
      '90d': [
        { day: 'Month 1', sessions: 145000, users: 128000, pageViews: 435000, bounceRate: 25 },
        { day: 'Month 2', sessions: 167000, users: 146000, pageViews: 501000, bounceRate: 24 },
        { day: 'Month 3', sessions: 189000, users: 165000, pageViews: 567000, bounceRate: 23 }
      ],
      '6m': [
        { day: 'Jan', sessions: 120000, users: 105000, pageViews: 360000, bounceRate: 26 },
        { day: 'Feb', sessions: 135000, users: 118000, pageViews: 405000, bounceRate: 25 },
        { day: 'Mar', sessions: 142000, users: 124000, pageViews: 426000, bounceRate: 24 },
        { day: 'Apr', sessions: 158000, users: 138000, pageViews: 474000, bounceRate: 23 },
        { day: 'May', sessions: 167000, users: 146000, pageViews: 501000, bounceRate: 24 },
        { day: 'Jun', sessions: 189000, users: 165000, pageViews: 567000, bounceRate: 23 }
      ],
      '12m': [
        { day: 'Jan 2024', sessions: 89000, users: 78000, pageViews: 267000, bounceRate: 28 },
        { day: 'Feb', sessions: 95000, users: 83000, pageViews: 285000, bounceRate: 27 },
        { day: 'Mar', sessions: 102000, users: 89000, pageViews: 306000, bounceRate: 26 },
        { day: 'Apr', sessions: 108000, users: 94000, pageViews: 324000, bounceRate: 26 },
        { day: 'May', sessions: 115000, users: 100000, pageViews: 345000, bounceRate: 25 },
        { day: 'Jun', sessions: 120000, users: 105000, pageViews: 360000, bounceRate: 26 },
        { day: 'Jul', sessions: 135000, users: 118000, pageViews: 405000, bounceRate: 25 },
        { day: 'Aug', sessions: 142000, users: 124000, pageViews: 426000, bounceRate: 24 },
        { day: 'Sep', sessions: 158000, users: 138000, pageViews: 474000, bounceRate: 23 },
        { day: 'Oct', sessions: 167000, users: 146000, pageViews: 501000, bounceRate: 24 },
        { day: 'Nov', sessions: 189000, users: 165000, pageViews: 567000, bounceRate: 23 },
        { day: 'Dec', sessions: 198000, users: 173000, pageViews: 594000, bounceRate: 22 }
      ]
    },
    
    conversionFunnel: {
      '7d': [
        { step: 'Landing Page', visitors: 34567, percentage: 100 },
        { step: 'Product View', visitors: 17284, percentage: 50 },
        { step: 'Add to Cart', visitors: 6914, percentage: 20 },
        { step: 'Checkout', visitors: 3457, percentage: 10 },
        { step: 'Purchase', visitors: 1313, percentage: 3.8 }
      ],
      '30d': [
        { step: 'Landing Page', visitors: 156847, percentage: 100 },
        { step: 'Product View', visitors: 78423, percentage: 50 },
        { step: 'Add to Cart', visitors: 31369, percentage: 20 },
        { step: 'Checkout', visitors: 15685, percentage: 10 },
        { step: 'Purchase', visitors: 5084, percentage: 3.24 }
      ],
      '90d': [
        { step: 'Landing Page', visitors: 487532, percentage: 100 },
        { step: 'Product View', visitors: 243766, percentage: 50 },
        { step: 'Add to Cart', visitors: 97506, percentage: 20 },
        { step: 'Checkout', visitors: 48753, percentage: 10 },
        { step: 'Purchase', visitors: 15113, percentage: 3.1 }
      ],
      '6m': [
        { step: 'Landing Page', visitors: 934567, percentage: 100 },
        { step: 'Product View', visitors: 467284, percentage: 50 },
        { step: 'Add to Cart', visitors: 186913, percentage: 20 },
        { step: 'Checkout', visitors: 93457, percentage: 10 },
        { step: 'Purchase', visitors: 28504, percentage: 3.05 }
      ],
      '12m': [
        { step: 'Landing Page', visitors: 1876543, percentage: 100 },
        { step: 'Product View', visitors: 938272, percentage: 50 },
        { step: 'Add to Cart', visitors: 375309, percentage: 20 },
        { step: 'Checkout', visitors: 187654, percentage: 10 },
        { step: 'Purchase', visitors: 55921, percentage: 2.98 }
      ]
    },
    
    userBehavior: {
      '7d': {
        heatmapData: [
          { hour: 0, day: 0, value: 12 }, { hour: 6, day: 0, value: 28 }, { hour: 12, day: 0, value: 65 },
          { hour: 18, day: 0, value: 42 }, { hour: 0, day: 1, value: 15 }, { hour: 9, day: 1, value: 82 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', sessions: 17284, percentage: 50 },
          { device: 'Mobile', sessions: 13827, percentage: 40 },
          { device: 'Tablet', sessions: 3457, percentage: 10 }
        ]
      },
      '30d': {
        heatmapData: [
          { hour: 0, day: 0, value: 10 }, { hour: 1, day: 0, value: 8 },
          { hour: 8, day: 0, value: 45 }, { hour: 12, day: 0, value: 60 },
          { hour: 18, day: 0, value: 38 }, { hour: 22, day: 0, value: 25 },
          { hour: 0, day: 1, value: 12 }, { hour: 9, day: 1, value: 78 },
          { hour: 14, day: 1, value: 85 }, { hour: 19, day: 1, value: 42 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', sessions: 78423, percentage: 50 },
          { device: 'Mobile', sessions: 62739, percentage: 40 },
          { device: 'Tablet', sessions: 15685, percentage: 10 }
        ]
      },
      '90d': {
        heatmapData: [
          { hour: 0, day: 0, value: 15 }, { hour: 6, day: 0, value: 35 }, { hour: 12, day: 0, value: 75 },
          { hour: 18, day: 0, value: 52 }, { hour: 0, day: 1, value: 18 }, { hour: 9, day: 1, value: 88 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', sessions: 243766, percentage: 50 },
          { device: 'Mobile', sessions: 195013, percentage: 40 },
          { device: 'Tablet', sessions: 48753, percentage: 10 }
        ]
      },
      '6m': {
        heatmapData: [
          { hour: 0, day: 0, value: 18 }, { hour: 6, day: 0, value: 42 }, { hour: 12, day: 0, value: 85 },
          { hour: 18, day: 0, value: 58 }, { hour: 0, day: 1, value: 22 }, { hour: 9, day: 1, value: 95 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', sessions: 467284, percentage: 50 },
          { device: 'Mobile', sessions: 373827, percentage: 40 },
          { device: 'Tablet', sessions: 93456, percentage: 10 }
        ]
      },
      '12m': {
        heatmapData: [
          { hour: 0, day: 0, value: 22 }, { hour: 6, day: 0, value: 48 }, { hour: 12, day: 0, value: 95 },
          { hour: 18, day: 0, value: 65 }, { hour: 0, day: 1, value: 25 }, { hour: 9, day: 1, value: 105 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', sessions: 938272, percentage: 50 },
          { device: 'Mobile', sessions: 750617, percentage: 40 },
          { device: 'Tablet', sessions: 187654, percentage: 10 }
        ]
      }
    },
    
    topLandingPages: {
      '7d': [
        { page: '/', title: 'Home Page', sessions: 10000, bounceRate: 25.2, conversions: 280, avgDuration: '3m 15s' },
        { page: '/products/premium', title: 'Premium Products', sessions: 6500, bounceRate: 19.8, conversions: 195, avgDuration: '4m 05s' },
        { page: '/pricing', title: 'Pricing Page', sessions: 4200, bounceRate: 31.5, conversions: 142, avgDuration: '2m 48s' }
      ],
      '30d': [
        { page: '/', title: 'Home Page', sessions: 45123, bounceRate: 23.4, conversions: 1234, avgDuration: '3m 45s' },
        { page: '/products/premium', title: 'Premium Products', sessions: 28456, bounceRate: 18.7, conversions: 892, avgDuration: '4m 12s' },
        { page: '/blog/getting-started', title: 'Getting Started Guide', sessions: 19847, bounceRate: 31.2, conversions: 456, avgDuration: '5m 28s' },
        { page: '/pricing', title: 'Pricing Page', sessions: 15632, bounceRate: 28.9, conversions: 678, avgDuration: '2m 56s' },
        { page: '/contact', title: 'Contact Us', sessions: 8234, bounceRate: 45.1, conversions: 234, avgDuration: '1m 45s' },
        { page: '/about', title: 'About Us', sessions: 6789, bounceRate: 38.2, conversions: 123, avgDuration: '2m 18s' }
      ],
      '90d': [
        { page: '/', title: 'Home Page', sessions: 138456, bounceRate: 24.1, conversions: 3687, avgDuration: '3m 38s' },
        { page: '/products/premium', title: 'Premium Products', sessions: 85234, bounceRate: 19.2, conversions: 2654, avgDuration: '4m 08s' },
        { page: '/pricing', title: 'Pricing Page', sessions: 46789, bounceRate: 29.7, conversions: 1987, avgDuration: '2m 52s' },
        { page: '/blog/getting-started', title: 'Getting Started Guide', sessions: 38456, bounceRate: 32.1, conversions: 987, avgDuration: '5m 15s' }
      ],
      '6m': [
        { page: '/', title: 'Home Page', sessions: 267890, bounceRate: 23.8, conversions: 6954, avgDuration: '3m 42s' },
        { page: '/products/premium', title: 'Premium Products', sessions: 164567, bounceRate: 18.9, conversions: 5123, avgDuration: '4m 15s' },
        { page: '/pricing', title: 'Pricing Page', sessions: 89345, bounceRate: 28.6, conversions: 3654, avgDuration: '2m 59s' },
        { page: '/blog/getting-started', title: 'Getting Started Guide', sessions: 73456, bounceRate: 31.8, conversions: 1876, avgDuration: '5m 22s' }
      ],
      '12m': [
        { page: '/', title: 'Home Page', sessions: 534567, bounceRate: 24.2, conversions: 13789, avgDuration: '3m 39s' },
        { page: '/products/premium', title: 'Premium Products', sessions: 328901, bounceRate: 19.1, conversions: 10234, avgDuration: '4m 11s' },
        { page: '/pricing', title: 'Pricing Page', sessions: 178234, bounceRate: 29.3, conversions: 7123, avgDuration: '2m 57s' },
        { page: '/blog/getting-started', title: 'Getting Started Guide', sessions: 146789, bounceRate: 32.4, conversions: 3654, avgDuration: '5m 18s' }
      ]
    },
    
    cohortAnalysis: {
      weekly: {
        cohorts: [
          { period: 'Week 1', week0: 100, week1: 85, week2: 72, week3: 68, week4: 65 },
          { period: 'Week 2', week0: 100, week1: 88, week2: 75, week3: 71, week4: null },
          { period: 'Week 3', week0: 100, week1: 82, week2: 69, week3: null, week4: null },
          { period: 'Week 4', week0: 100, week1: 79, week2: null, week3: null, week4: null }
        ]
      },
      monthly: {
        cohorts: [
          { period: 'Jan 2024', month0: 100, month1: 75, month2: 65, month3: 58, month4: 52 },
          { period: 'Feb 2024', month0: 100, month1: 78, month2: 68, month3: 61, month4: null },
          { period: 'Mar 2024', month0: 100, month1: 72, month2: 62, month3: null, month4: null },
          { period: 'Apr 2024', month0: 100, month1: 76, month2: null, month3: null, month4: null }
        ]
      }
    }
  },
  
  // Settings data
  settings: {
    userPreferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC-5',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        analytics: true,
        marketing: false,
        sharing: false
      }
    },
    
    dashboardConfig: {
      layout: 'grid',
      widgets: {
        kpis: { enabled: true, position: 1 },
        revenueChart: { enabled: true, position: 2 },
        trafficSources: { enabled: true, position: 3 },
        recentActivity: { enabled: true, position: 4 },
        topProducts: { enabled: false, position: 5 }
      },
      autoRefresh: true,
      refreshInterval: 30000, // 30 seconds
      defaultTimeframe: '30d'
    },
    
    notifications: {
      emailNotifications: {
        dailyReports: true,
        weeklyReports: true,
        monthlyReports: false,
        alerts: true,
        promotions: false
      },
      pushNotifications: {
        realTimeAlerts: true,
        systemUpdates: true,
        newFeatures: false
      },
      alertThresholds: {
        revenueDropPercentage: 10,
        conversionRateDropPercentage: 5,
        trafficDropPercentage: 15
      }
    }
  }
};