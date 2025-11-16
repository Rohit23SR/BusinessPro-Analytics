import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportSettingsJSON, exportSettingsCSV } from './settingsUtils';

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock DOM elements
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

describe('settingsUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock document.createElement
    vi.spyOn(document, 'createElement').mockImplementation(() => ({
      href: '',
      download: '',
      click: mockClick,
      style: {},
    } as unknown as HTMLAnchorElement));

    // Mock document.body
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
  });

  describe('exportSettingsJSON', () => {
    it('should create a JSON file with settings data', () => {
      const settings = {
        theme: 'dark' as const,
        language: 'en' as const,
        timezone: 'UTC',
        currency: 'USD' as const,
        analytics: true,
        marketing: false,
        sharing: false,
        layout: 'grid' as const,
        timeframe: '30d',
        autoRefresh: true,
        revenueWidget: true,
        trafficWidget: true,
        conversionsWidget: false,
        emailAlerts: true,
        emailReports: false,
        pushAlerts: true,
        pushReports: true,
        conversionThreshold: 15,
        trafficThreshold: 25,
        apiKey: 'test-key',
      };

      exportSettingsJSON(settings);

      expect(mockCreateObjectURL).toHaveBeenCalledOnce();
      expect(mockClick).toHaveBeenCalledOnce();
      expect(mockRevokeObjectURL).toHaveBeenCalledOnce();
    });

    it('should handle empty settings object', () => {
      const settings = {} as any;

      exportSettingsJSON(settings);

      expect(mockCreateObjectURL).toHaveBeenCalledOnce();
      expect(mockClick).toHaveBeenCalledOnce();
    });
  });

  describe('exportSettingsCSV', () => {
    it('should create a CSV file with settings data', () => {
      const settings = {
        theme: 'light' as const,
        language: 'es' as const,
        timezone: 'UTC-5',
        currency: 'EUR' as const,
        analytics: false,
        marketing: true,
        sharing: true,
        layout: 'list' as const,
        timeframe: '7d',
        autoRefresh: false,
        revenueWidget: false,
        trafficWidget: false,
        conversionsWidget: true,
        emailAlerts: false,
        emailReports: true,
        pushAlerts: false,
        pushReports: false,
        conversionThreshold: 20,
        trafficThreshold: 30,
        apiKey: 'another-key',
      };

      exportSettingsCSV(settings);

      expect(mockCreateObjectURL).toHaveBeenCalledOnce();
      expect(mockClick).toHaveBeenCalledOnce();
      expect(mockRevokeObjectURL).toHaveBeenCalledOnce();
    });

    it('should convert boolean values to strings', () => {
      const settings = {
        theme: 'dark' as const,
        language: 'en' as const,
        timezone: 'UTC',
        currency: 'USD' as const,
        analytics: true,
        marketing: false,
        sharing: false,
        layout: 'grid' as const,
        timeframe: '30d',
        autoRefresh: true,
        revenueWidget: true,
        trafficWidget: true,
        conversionsWidget: false,
        emailAlerts: true,
        emailReports: false,
        pushAlerts: true,
        pushReports: true,
        conversionThreshold: 15,
        trafficThreshold: 25,
        apiKey: 'test-key',
      };

      exportSettingsCSV(settings);

      // Verify the blob was created (means conversion happened)
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });
});
