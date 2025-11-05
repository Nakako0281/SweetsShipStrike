'use client';

import { motion } from 'framer-motion';
import type { CoinReward } from '@/types/ui';

interface CoinRewardDisplayProps {
  reward: CoinReward;
  show: boolean;
}

/**
 * コイン獲得表示コンポーネント
 */
export default function CoinRewardDisplay({ reward, show }: CoinRewardDisplayProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg"
    >
      {/* ヘッダー */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">💰</div>
        <h3 className="text-2xl font-bold text-orange-800">コイン獲得</h3>
      </div>

      {/* 基本報酬 */}
      <div className="mb-4">
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-700">基本報酬</span>
          <span className="text-xl font-bold text-orange-600">
            +{reward.baseAmount}
          </span>
        </div>
      </div>

      {/* ボーナス報酬 */}
      {reward.bonuses.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="text-sm font-semibold text-orange-800 mb-2">
            🎁 ボーナス
          </div>
          {reward.bonuses.map((bonus, index) => (
            <motion.div
              key={bonus.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex justify-between items-center p-2 bg-orange-50 rounded-lg"
            >
              <span className="text-sm text-gray-700">{bonus.reason}</span>
              <span className="text-lg font-bold text-orange-600">
                +{bonus.amount}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* 合計 */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.0, type: 'spring' }}
        className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg"
      >
        <div className="flex justify-between items-center">
          <span className="text-white font-bold text-lg">合計</span>
          <span className="text-white font-bold text-3xl">
            {reward.totalAmount} 💰
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
