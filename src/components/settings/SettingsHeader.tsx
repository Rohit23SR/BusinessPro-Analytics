// components/settings/SettingsHeader.tsx
import { Download, RefreshCw } from 'lucide-react'

interface SettingsHeaderProps {
  onExport: () => void
  onReset: () => void
}

export default function SettingsHeader({ onExport, onReset }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Manage your account preferences and dashboard configuration
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
        <button
          onClick={onExport}
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:w-auto sm:px-4"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>

        <button
          onClick={onReset}
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:w-auto sm:px-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  )
}
