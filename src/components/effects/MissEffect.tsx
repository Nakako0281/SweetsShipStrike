import React from 'react';
import { motion } from 'framer-motion';

interface MissEffectProps {
  position: { x: number; y: number };
  onComplete?: () => void;
}

/**
 * ミスエフェクトコンポーネント
 * 攻撃が外れた時のアニメーション
 */
export default function MissEffect({ position, onComplete }: MissEffectProps) {
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
        duration: 0.5,
        times: [0, 0.3, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {/* 水しぶきエフェクト */}
      <div className="relative">
        {/* 中心の波紋 */}
        <motion.div
          className="absolute w-12 h-12 bg-blue-300 rounded-full opacity-50"
          style={{ left: -24, top: -24 }}
          animate={{
            scale: [0, 2],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 0.5 }}
        />

        {/* 外側の波紋 */}
        <motion.div
          className="absolute w-16 h-16 border-2 border-blue-400 rounded-full"
          style={{ left: -32, top: -32 }}
          animate={{
            scale: [0, 2.5],
            opacity: [1, 0],
          }}
          transition={{ duration: 0.5 }}
        />

        {/* 水しぶき */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
            style={{
              left: -3,
              top: -3,
            }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * 30,
              y: Math.sin((angle * Math.PI) / 180) * 30 - 10,
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{ duration: 0.4 }}
          />
        ))}

        {/* 絵文字 */}
        <motion.div
          className="absolute text-3xl"
          style={{ left: -16, top: -16 }}
          animate={{
            scale: [0, 1.1, 1],
            y: [0, -5, 0],
          }}
          transition={{ duration: 0.5 }}
        >
          💧
        </motion.div>
      </div>
    </motion.div>
  );
}
