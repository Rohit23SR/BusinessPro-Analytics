// components/settings/SettingsHeader.tsx
import { Download, RefreshCw } from 'lucide-react';

interface SettingsHeaderProps {
  onExport: () => void;
  onReset: () => void;
}

export default function SettingsHeader({ onExport, onReset }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and dashboard configuration</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>
    </div>
  );
}