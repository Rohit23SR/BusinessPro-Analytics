// components/settings/ProfileTab.tsx
import { Settings } from '../../types/settings'

interface ProfileTabProps {
  settings: Settings
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export default function ProfileTab({ settings, onSettingChange }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile & Account</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme Preference
          </label>
          <select
            value={settings.theme}
            onChange={(e) => onSettingChange('theme', e.target.value as 'light' | 'dark')}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) =>
              onSettingChange('language', e.target.value as 'en' | 'es' | 'fr' | 'de')
            }
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => onSettingChange('timezone', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="UTC">UTC</option>
            <option value="UTC-5">Eastern Time</option>
            <option value="UTC-8">Pacific Time</option>
            <option value="UTC+1">Central European Time</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) =>
              onSettingChange('currency', e.target.value as 'USD' | 'EUR' | 'GBP' | 'JPY')
            }
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <h4 className="text-md mb-4 font-semibold text-gray-900 dark:text-gray-100">
          Privacy Settings
        </h4>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={(e) => onSettingChange('analytics', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Allow analytics data collection
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.marketing}
              onChange={(e) => onSettingChange('marketing', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Receive marketing communications
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sharing}
              onChange={(e) => onSettingChange('sharing', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Allow data sharing with partners
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
