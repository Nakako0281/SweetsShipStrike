'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 画面向き案内コンポーネント
 * モバイルで縦向きの場合に横向き推奨を表示
 */
export default function OrientationGuide() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      const mobile = window.innerWidth < 768;
      setIsPortrait(portrait);
      setIsMobile(mobile);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const shouldShowGuide = isMobile && isPortrait;

  return (
    <AnimatePresence>
      {shouldShowGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-purple-900/95 z-[9999] flex items-center justify-center p-4"
        >
          <div className="text-center text-white">
            {/* 回転アイコン */}
            <motion.div
              animate={{ rotate: [0, 90, 90, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-8xl mb-6"
            >
              📱
            </motion.div>

            {/* メッセージ */}
            <h2 className="text-3xl font-bold mb-4">画面を横向きにしてください</h2>
            <p className="text-lg text-purple-200 mb-2">
              このゲームは横向き画面に最適化されています
            </p>
            <p className="text-sm text-purple-300">
              より快適なプレイのため、デバイスを横向きにしてください
            </p>

            {/* 矢印アニメーション */}
            <motion.div
              animate={{ x: [-10, 10, -10] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl mt-8"
            >
              ↻
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
