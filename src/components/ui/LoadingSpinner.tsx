import React from 'react';
import { motion } from 'framer-motion';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

/**
 * ローディングスピナーコンポーネント
 * Framer Motionで回転アニメーションを実装
 */
export default function LoadingSpinner({ size = 'md', color = 'pink' }: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const colorStyles = {
    pink: 'border-pink-500',
    purple: 'border-purple-500',
    white: 'border-white',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeStyles[size]} border-4 ${colorStyles[color as keyof typeof colorStyles] || colorStyles.pink} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
