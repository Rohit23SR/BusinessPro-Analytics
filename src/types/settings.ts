// types/settings.ts
export interface Integration {
  name: string;
  connected: boolean;
  icon: string;
}

export interface Settings {
  theme: string;
  language: string;
  timezone: string;
  currency: string;
  analytics: boolean;
  marketing: boolean;
  sharing: boolean;
  layout: string;
  timeframe: string;
  autoRefresh: boolean;
  revenueWidget: boolean;
  trafficWidget: boolean;
  conversionsWidget: boolean;
  emailAlerts: boolean;
  emailReports: boolean;
  pushAlerts: boolean;
  pushReports: boolean;
  conversionThreshold: number;
  trafficThreshold: number;
  apiKey: string;
}

export interface Tab {
  id: string;
  name: string;
  icon: string;
}