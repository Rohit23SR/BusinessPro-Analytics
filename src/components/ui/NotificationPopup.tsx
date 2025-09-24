// components/ui/NotificationPopup.tsx
import { CheckCircle, X } from 'lucide-react';

interface NotificationPopupProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function NotificationPopup({ show, message, onClose }: NotificationPopupProps) {
  if (!show) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          pointerEvents: 'auto'
        }}
      >
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-lg flex items-center space-x-3 max-w-sm">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-green-800 truncate">{message}</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-100 rounded transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      </div>
    </div>
  );
}