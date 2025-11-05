'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import type { Title } from '@/types/ui';

interface TitleUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: Title | null;
}

/**
 * 称号獲得モーダル
 */
export default function TitleUnlockModal({ isOpen, onClose, title }: TitleUnlockModalProps) {
  if (!isOpen || !title) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              {/* 称号獲得演出 */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="text-7xl mb-4"
                >
                  {title.icon}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-sm text-purple-600 font-semibold mb-2">
                    🎉 称号獲得！
                  </div>
                  <h2 className="text-3xl font-bold text-purple-800 mb-2">
                    {title.name}
                  </h2>
                  <p className="text-purple-600">{title.description}</p>
                </motion.div>
              </motion.div>

              {/* 解放条件 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-purple-50 rounded-lg p-4 mb-6"
              >
                <div className="text-sm text-purple-700 text-center">
                  <span className="font-semibold">解放条件: </span>
                  {title.unlockCondition}
                </div>
              </motion.div>

              {/* 閉じるボタン */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button onClick={onClose} variant="primary" size="lg" className="w-full">
                  閉じる
                </Button>
              </motion.div>

              {/* キラキラエフェクト */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: Math.random() * 400,
                      y: -10,
                      opacity: 0,
                    }}
                    animate={{
                      y: 500,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 1,
                      repeat: Infinity,
                    }}
                    className="absolute text-2xl"
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
