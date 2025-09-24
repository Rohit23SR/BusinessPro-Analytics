// utils/settingsUtils.ts
import { Settings } from '../types/settings';

export const exportSettingsJSON = (settings: Settings): void => {
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'settings.json';
  link.click();
  URL.revokeObjectURL(url);
};

export const exportSettingsCSV = (settings: Settings): void => {
  const csvData = [
    ['Setting', 'Value', 'Category', 'Last Modified'],
    ['Theme', settings.theme, 'Appearance', '2024-03-15'],
    ['Language', settings.language, 'Localization', '2024-03-10'],
    ['Timezone', settings.timezone, 'Localization', '2024-03-08'],
    ['Currency', settings.currency, 'Localization', '2024-03-08'],
    ['Analytics', settings.analytics.toString(), 'Privacy', '2024-03-12'],
    ['Marketing', settings.marketing.toString(), 'Privacy', '2024-03-12'],
    ['Layout', settings.layout, 'Dashboard', '2024-03-14'],
    ['Auto Refresh', settings.autoRefresh.toString(), 'Dashboard', '2024-03-14'],
    ['Email Alerts', settings.emailAlerts.toString(), 'Notifications', '2024-03-13'],
    ['Conversion Threshold', settings.conversionThreshold.toString(), 'Alerts', '2024-03-11']
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'settings_export.csv';
  link.click();
  URL.revokeObjectURL(url);
};