import React from 'react';
import { CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  };
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose
}) => {
  if (!notification.show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-lg animate-slide-in-right ${
      notification.type === 'success' 
        ? 'bg-black/20 backdrop-blur-2xl border-white/15 text-white'
        : notification.type === 'error'
          ? 'bg-black/20 backdrop-blur-2xl border-white/15 text-white'
          : 'bg-black/20 backdrop-blur-2xl border-white/15 text-white'
    }`}>
      <div className="flex items-center space-x-3">
        {notification.type === 'success' && (
          <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
        )}
        {notification.type === 'error' && (
          <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
        )}
        {notification.type === 'info' && (
          <Shield className="w-5 h-5 text-white flex-shrink-0" />
        )}
        <span className="font-medium">{notification.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};
