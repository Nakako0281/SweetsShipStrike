import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * 汎用ボタンコンポーネント
 * Framer Motionでホバー/タップアニメーションを実装
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-lg transition-colors focus:outline-none focus:ring-4';

  const variantStyles = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-300 disabled:bg-pink-300',
    secondary: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-300 disabled:bg-purple-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 disabled:bg-red-300',
    ghost: 'bg-transparent text-pink-600 hover:bg-pink-100 focus:ring-pink-200 border-2 border-pink-500 disabled:text-pink-300 disabled:border-pink-300',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <motion.button
      className={combinedClassName}
      disabled={disabled}
      whileHover={
        !disabled
          ? {
              scale: 1.05,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              y: -2,
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.95, y: 0 } : {}}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
