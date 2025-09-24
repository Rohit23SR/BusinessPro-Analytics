// components/settings/SettingsSidebar.tsx
import { Tab } from '../../types/settings';

interface SettingsSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function SettingsSidebar({ tabs, activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3 text-base">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}