import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

/**
 * 通知コンポーネント
 * 画面右上に表示される通知システム
 */
export default function Notification() {
  const notifications = useUIStore((state) => state.notifications);
  const removeNotification = useUIStore((state) => state.removeNotification);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`
              ${getNotificationStyle(notification.type)}
              text-white px-4 py-3 rounded-lg shadow-lg border-2
              max-w-sm pointer-events-auto
            `}
          >
            <div className="flex items-start gap-3">
              {/* アイコン */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold text-lg">
                {getNotificationIcon(notification.type)}
              </div>

              {/* メッセージ */}
              <p className="flex-1 text-sm font-semibold">{notification.message}</p>

              {/* 閉じるボタン */}
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
