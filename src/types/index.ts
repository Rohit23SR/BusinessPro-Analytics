// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
  meta: {
    requestId: string;
    version: string;
  };
}

// Dashboard Types
export interface KPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  customers: number;
  orders: number;
  target?: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface Activity {
  id: number;
  activity: string;
  user: string;
  time: string;
  status: 'Completed' | 'Success' | 'Pending' | 'Active' | 'Processing';
}

export interface Product {
  name: string;
  sales: number;
  revenue: string;
  growth: string;
  category: string;
}

// Analytics Types
export interface AnalyticsOverview {
  totalSessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  conversionRate: number;
  newUsers: number;
  returningUsers: number;
}

export interface TrafficData {
  day: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
}

export interface ConversionFunnelStep {
  step: string;
  visitors: number;
  percentage: number;
}

export interface LandingPage {
  page: string;
  title: string;
  sessions: number;
  bounceRate: number;
  conversions: number;
  avgDuration: string;
}

export interface HeatmapData {
  hour: number;
  day: number;
  value: number;
}

export interface DeviceData {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  sessions: number;
  percentage: number;
}

export interface UserBehaviorData {
  heatmapData: HeatmapData[];
  deviceBreakdown: DeviceData[];
}

export interface CohortData {
  period: string;
  week0?: number;
  week1?: number | null;
  week2?: number | null;
  week3?: number | null;
  week4?: number | null;
  month0?: number;
  month1?: number | null;
  month2?: number | null;
  month3?: number | null;
  month4?: number | null;
}

export interface CohortAnalysis {
  cohorts: CohortData[];
}

// Settings Types
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface PrivacySettings {
  analytics: boolean;
  marketing: boolean;
  sharing: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface WidgetConfig {
  enabled: boolean;
  position: number;
}

export interface DashboardConfig {
  layout: 'grid' | 'list';
  widgets: {
    kpis: WidgetConfig;
    revenueChart: WidgetConfig;
    trafficSources: WidgetConfig;
    recentActivity: WidgetConfig;
    topProducts: WidgetConfig;
  };
  autoRefresh: boolean;
  refreshInterval: number;
  defaultTimeframe: string;
}

export interface EmailNotifications {
  dailyReports: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  alerts: boolean;
  promotions: boolean;
}

export interface PushNotifications {
  realTimeAlerts: boolean;
  systemUpdates: boolean;
  newFeatures: boolean;
}

export interface AlertThresholds {
  revenueDropPercentage: number;
  conversionRateDropPercentage: number;
  trafficDropPercentage: number;
}

export interface NotificationConfig {
  emailNotifications: EmailNotifications;
  pushNotifications: PushNotifications;
  alertThresholds: AlertThresholds;
}

// Filter Types
export interface AnalyticsFilters {
  timeframe?: string;
  trafficSource?: string;
  deviceType?: string;
  geography?: string;
}

// Route Types
export interface RouteParams {
  section?: string;
  tab?: string;
}

// Component Props Types
export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export interface ChartProps {
  data: any[];
  width?: number;
  height?: number;
  className?: string;
}

export interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

// Hook Types
export interface UseApiQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Form Types
export interface SettingsFormData {
  userPreferences?: Partial<UserPreferences>;
  dashboardConfig?: Partial<DashboardConfig>;
  notificationConfig?: Partial<NotificationConfig>;
}

// Real-time Types
export interface LiveMetrics {
  kpis: KPI[];
  lastUpdated: string;
}

export interface LiveActivity {
  id: number;
  activity: string;
  user: string;
  time: string;
  status: string;
  timestamp: string;
}

// Utility Types
export type TimeFrame = '7d' | '30d' | '90d' | '6m' | '12m';
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'heatmap';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Navigation Types
export interface NavItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  children?: NavItem[];
}

// Theme Types
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';