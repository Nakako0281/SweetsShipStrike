import React from 'react';
import { motion } from 'framer-motion';

interface HitEffectProps {
  position: { x: number; y: number };
  onComplete?: () => void;
}

/**
 * ヒットエフェクトコンポーネント
 * 攻撃が命中した時のアニメーション
 */
export default function HitEffect({ position, onComplete }: HitEffectProps) {
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
        scale: [0, 1.5, 1],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 0.6,
        times: [0, 0.5, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {/* 爆発エフェクト */}
      <div className="relative">
        {/* 中心の爆発 */}
        <motion.div
          className="absolute w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full blur-sm"
          style={{ left: -32, top: -32 }}
          animate={{
            scale: [0, 2, 0],
            opacity: [1, 0.8, 0],
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* 外側の波紋 */}
        <motion.div
          className="absolute w-20 h-20 border-4 border-orange-500 rounded-full"
          style={{ left: -40, top: -40 }}
          animate={{
            scale: [0, 2.5],
            opacity: [1, 0],
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* 第2波紋 */}
        <motion.div
          className="absolute w-24 h-24 border-2 border-red-400 rounded-full"
          style={{ left: -48, top: -48 }}
          animate={{
            scale: [0, 3],
            opacity: [0.8, 0],
          }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        />

        {/* 火花 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: -4,
              top: -4,
            }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * 40,
              y: Math.sin((angle * Math.PI) / 180) * 40,
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* 絵文字 */}
        <motion.div
          className="absolute text-4xl"
          style={{ left: -20, top: -20 }}
          animate={{
            scale: [0, 1.2, 1],
            rotate: [0, 15, -15, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 0.6 }}
        >
          💥
        </motion.div>
      </div>
    </motion.div>
  );
}
