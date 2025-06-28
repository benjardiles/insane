'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Notification({ 
  message, 
  type = 'success', 
  onClose,
  duration = 3000
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, duration]);
  
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md border ${getStyles()} max-w-xs animate-fadeIn`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button 
          onClick={onClose} 
          className="ml-4 text-sm font-bold hover:bg-opacity-20 hover:bg-gray-500 rounded-full h-6 w-6 flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// Hook para gestionar notificaciones
export function useNotification() {
  const [notification, setNotification] = React.useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showNotification = (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const NotificationComponent = notification.show ? (
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={hideNotification}
    />
  ) : null;

  return {
    showNotification,
    hideNotification,
    NotificationComponent
  };
}