'use client';

import { motion } from 'framer-motion';

interface ConsecutiveAttackIndicatorProps {
  show: boolean;
  hitCount: number;
}

export default function ConsecutiveAttackIndicator({
  show,
  hitCount,
}: ConsecutiveAttackIndicatorProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ repeat: Infinity, duration: 0.5, repeatType: 'reverse' }}
          className="text-center"
        >
          <div className="text-5xl font-bold mb-2">
            🎯 {hitCount} 連鎖！
          </div>
          <div className="text-xl font-semibold">
            連続攻撃可能！
          </div>
          <div className="text-sm mt-2 opacity-90">
            次のマスを選択してください
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
