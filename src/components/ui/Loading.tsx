import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
}

/**
 * ローディング画面コンポーネント
 * ゲーム初期化やデータ読み込み中に表示
 */
export default function Loading({ message = '読み込み中...' }: LoadingProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-100 to-purple-100 flex flex-col items-center justify-center z-50">
      {/* ローディングアニメーション */}
      <div className="relative mb-8">
        {/* 回転するスイーツアイコン */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-8xl"
        >
          🍰
        </motion.div>

        {/* パルスエフェクト */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-pink-300 rounded-full blur-xl -z-10"
        />
      </div>

      {/* メッセージ */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-purple-800 mb-4"
      >
        {message}
      </motion.p>

      {/* ドット */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-pink-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
