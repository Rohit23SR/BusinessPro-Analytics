// components/ui/NotificationPopup.tsx
import { CheckCircle, X } from 'lucide-react'

interface NotificationPopupProps {
  show: boolean
  message: string
  onClose: () => void
}

export default function NotificationPopup({ show, message, onClose }: NotificationPopupProps) {
  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          pointerEvents: 'auto',
        }}
      >
        <div className="flex max-w-sm items-center space-x-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow-lg">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
          <span className="truncate text-sm font-medium text-green-800">{message}</span>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded p-1 transition-colors hover:bg-green-100"
            aria-label="Close notification"
          >
            <X className="h-4 w-4 text-green-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
