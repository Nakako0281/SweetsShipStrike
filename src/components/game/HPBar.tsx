import React from 'react';
import { motion } from 'framer-motion';

interface HPBarProps {
  current: number;
  max: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showNumbers?: boolean;
}

/**
 * HPバーコンポーネント
 * HP減少時にアニメーション付きで表示
 */
export default function HPBar({
  current,
  max,
  label,
  size = 'md',
  showNumbers = true,
}: HPBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  const sizeStyles = {
    sm: { height: 'h-2', text: 'text-xs' },
    md: { height: 'h-4', text: 'text-sm' },
    lg: { height: 'h-6', text: 'text-base' },
  };

  const getColor = () => {
    if (percentage > 60) return 'from-green-500 to-emerald-500';
    if (percentage > 30) return 'from-yellow-500 to-orange-500';
    return 'from-red-600 to-red-500';
  };

  return (
    <div className="w-full">
      {/* ラベル */}
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className={`font-bold text-purple-800 ${sizeStyles[size].text}`}>
            {label}
          </span>
          {showNumbers && (
            <span className={`font-bold text-purple-600 ${sizeStyles[size].text}`}>
              {current} / {max}
            </span>
          )}
        </div>
      )}

      {/* HPバー */}
      <div
        className={`relative w-full ${sizeStyles[size].height} bg-gray-200 rounded-full overflow-hidden shadow-inner`}
      >
        {/* HPゲージ */}
        <motion.div
          className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${getColor()} rounded-full shadow-lg`}
          initial={false}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        >
          {/* 光沢エフェクト */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-full"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* パルスエフェクト（HP低下時） */}
        {percentage <= 30 && (
          <motion.div
            className="absolute inset-0 bg-red-500/30 rounded-full"
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* ダメージフラッシュ */}
      <motion.div
        key={current}
        className="absolute inset-0 bg-red-500/50 rounded-full pointer-events-none"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
