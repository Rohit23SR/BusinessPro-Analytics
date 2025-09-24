// components/settings/IntegrationsTab.tsx
import { Download, Upload } from 'lucide-react';
import { Integration, Settings } from '../../types/settings';

interface IntegrationsTabProps {
  integrations: Integration[];
  settings: Settings;
  onIntegrationToggle: (name: string) => void;
  onApiKeyGenerate: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportData: () => void;
}

export default function IntegrationsTab({ 
  integrations, 
  settings,
  onIntegrationToggle, 
  onApiKeyGenerate,
  onExportCSV,
  onExportJSON,
  onImportData
}: IntegrationsTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Integrations & Data Sources</h3>
      
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-4">{integration.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{integration.name}</div>
                <div className={`text-sm ${
                  integration.connected ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {integration.connected ? 'Connected' : 'Not connected'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => onIntegrationToggle(integration.name)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                integration.connected 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">API Configuration</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">API Key</span>
            <button 
              onClick={onApiKeyGenerate}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Generate New
            </button>
          </div>
          <div className="font-mono text-sm bg-white p-3 rounded border">
            {settings.apiKey}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Data Export</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onExportCSV}
            className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors"
          >
            <Download className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-sm font-medium">Export CSV</span>
          </button>
          <button 
            onClick={onExportJSON}
            className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors"
          >
            <Download className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-sm font-medium">Export JSON</span>
          </button>
          <button 
            onClick={onImportData}
            className="flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-sm font-medium">Import Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}