// components/settings/NotificationsTab.tsx
import { useState, useEffect, useRef } from 'react'
import { Settings } from '../../types/settings'
import { DEBOUNCE_DELAY_MS } from '../../constants/appConstants'

interface NotificationsTabProps {
  settings: Settings
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export default function NotificationsTab({ settings, onSettingChange }: NotificationsTabProps) {
  // Local state for threshold inputs to enable debouncing
  const [conversionValue, setConversionValue] = useState(settings.conversionThreshold)
  const [trafficValue, setTrafficValue] = useState(settings.trafficThreshold)
  const conversionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const trafficTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync local state with props when settings change from backend
  useEffect(() => {
    setConversionValue(settings.conversionThreshold)
    setTrafficValue(settings.trafficThreshold)
  }, [settings.conversionThreshold, settings.trafficThreshold])

  // Debounced save for conversion threshold
  const handleConversionChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setConversionValue(numValue)

    if (conversionTimeoutRef.current) {
      clearTimeout(conversionTimeoutRef.current)
    }

    conversionTimeoutRef.current = setTimeout(() => {
      onSettingChange('conversionThreshold', numValue)
    }, DEBOUNCE_DELAY_MS)
  }

  // Debounced save for traffic threshold
  const handleTrafficChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setTrafficValue(numValue)

    if (trafficTimeoutRef.current) {
      clearTimeout(trafficTimeoutRef.current)
    }

    trafficTimeoutRef.current = setTimeout(() => {
      onSettingChange('trafficThreshold', numValue)
    }, DEBOUNCE_DELAY_MS)
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (conversionTimeoutRef.current) clearTimeout(conversionTimeoutRef.current)
      if (trafficTimeoutRef.current) clearTimeout(trafficTimeoutRef.current)
    }
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Notification Preferences
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Control how and when you receive notifications about your business metrics
        </p>
      </div>

      {/* Email Notifications Section */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <span className="text-xl">📧</span>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Email Notifications
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Receive updates in your inbox
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-600">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Critical Alerts
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Get notified about urgent issues immediately
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={(e) => onSettingChange('emailAlerts', e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-600">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekly Reports</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Summary of your weekly performance metrics
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailReports}
              onChange={(e) => onSettingChange('emailReports', e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Push Notifications Section */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <span className="text-xl">🔔</span>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Push Notifications
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time alerts on your device
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-600">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Real-time Alerts
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Instant notifications for important events
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushAlerts}
              onChange={(e) => onSettingChange('pushAlerts', e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-600">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">System Updates</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                New features and platform updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushReports}
              onChange={(e) => onSettingChange('pushReports', e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Alert Thresholds Section */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Alert Thresholds
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Set when you want to be notified about metric changes
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-600">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Conversion Rate Drop
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={conversionValue}
                onChange={(e) => handleConversionChange(e.target.value)}
                min="1"
                max="100"
                className="w-20 rounded-lg border border-gray-300 bg-white p-2 text-center text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">%</span>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Alert when conversion drops by this percentage
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-600">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Traffic Drop
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={trafficValue}
                onChange={(e) => handleTrafficChange(e.target.value)}
                min="1"
                max="100"
                className="w-20 rounded-lg border border-gray-300 bg-white p-2 text-center text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">%</span>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Alert when traffic drops by this percentage
            </p>
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                Notification History
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View your recent notifications
              </p>
            </div>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            View All
          </button>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-600">
          <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No recent notifications
          </p>
        </div>
      </div>
    </div>
  )
}
