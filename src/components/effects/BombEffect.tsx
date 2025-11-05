import React from 'react';
import { motion } from 'framer-motion';

interface BombEffectProps {
  position: { x: number; y: number };
  onComplete?: () => void;
}

/**
 * ボムエフェクトコンポーネント
 * チョコレートボムスキル使用時のアニメーション
 */
export default function BombEffect({ position, onComplete }: BombEffectProps) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.2, 1],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        times: [0, 0.3, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <div className="relative">
        {/* 広範囲爆発 */}
        <motion.div
          className="absolute w-40 h-40 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-lg opacity-70"
          style={{ left: -80, top: -80 }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0.7, 0.5, 0],
            rotate: [0, 90],
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* 十字の衝撃波 */}
        {[0, 90, 180, 270].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-32 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-60"
            style={{
              left: -16,
              top: -4,
              transformOrigin: 'left center',
              rotate: angle,
            }}
            animate={{
              scaleX: [0, 3],
              opacity: [0.6, 0],
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}

        {/* チョコレート粒子 */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i * 360) / 20;
          const distance = 40 + Math.random() * 40;
          return (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-br from-amber-700 to-amber-900 rounded-sm"
              style={{
                left: -8,
                top: -8,
              }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * distance,
                y: Math.sin((angle * Math.PI) / 180) * distance,
                opacity: [1, 0],
                rotate: [0, 360],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 1,
                delay: i * 0.02,
                ease: 'easeOut',
              }}
            />
          );
        })}

        {/* 絵文字 */}
        <motion.div
          className="absolute text-6xl"
          style={{ left: -36, top: -36 }}
          animate={{
            scale: [0, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 1.2 }}
        >
          🍫💣
        </motion.div>
      </div>
    </motion.div>
  );
}
