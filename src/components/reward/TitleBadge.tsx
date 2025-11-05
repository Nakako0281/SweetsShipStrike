'use client';

import { motion } from 'framer-motion';
import type { Title } from '@/types/ui';

interface TitleBadgeProps {
  title: Title | null;
  size?: 'sm' | 'md' | 'lg';
  showUnlockCondition?: boolean;
}

/**
 * 称号バッジ表示コンポーネント
 */
export default function TitleBadge({
  title,
  size = 'md',
  showUnlockCondition = false,
}: TitleBadgeProps) {
  if (!title) {
    return (
      <div className="text-center text-gray-400">
        <p>称号未装備</p>
      </div>
    );
  }

  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'text-2xl',
      name: 'text-sm',
      description: 'text-xs',
    },
    md: {
      container: 'p-4',
      icon: 'text-4xl',
      name: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'p-6',
      icon: 'text-6xl',
      name: 'text-2xl',
      description: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl ${classes.container} ${
        !title.isUnlocked ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* アイコン */}
        <div className={`${classes.icon} ${!title.isUnlocked ? 'grayscale' : ''}`}>
          {title.isUnlocked ? title.icon : '🔒'}
        </div>

        {/* 情報 */}
        <div className="flex-1">
          <h3 className={`font-bold text-purple-800 ${classes.name}`}>
            {title.name}
          </h3>
          <p className={`text-purple-600 ${classes.description}`}>
            {title.description}
          </p>
          {showUnlockCondition && (
            <p className={`text-purple-500 mt-1 ${classes.description}`}>
              {title.isUnlocked ? '✓ 解放済み' : `🔒 ${title.unlockCondition}`}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
