// components/settings/SettingsHeader.tsx
import { Download, RefreshCw } from 'lucide-react';

interface SettingsHeaderProps {
  onExport: () => void;
  onReset: () => void;
}

export default function SettingsHeader({ onExport, onReset }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your account preferences and dashboard configuration</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <button
          onClick={onExport}
          className="flex items-center px-3 sm:px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>

        <button
          onClick={onReset}
          className="flex items-center px-3 sm:px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 w-full sm:w-auto justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>
    </div>
  );
}