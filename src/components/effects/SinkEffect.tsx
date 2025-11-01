import React from 'react';
import { motion } from 'framer-motion';

interface SinkEffectProps {
  position: { x: number; y: number };
  onComplete?: () => void;
}

/**
 * 撃沈エフェクトコンポーネント
 * 船が撃沈された時のアニメーション
 */
export default function SinkEffect({ position, onComplete }: SinkEffectProps) {
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
        duration: 1,
        times: [0, 0.4, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {/* 大爆発エフェクト */}
      <div className="relative">
        {/* 中心の大爆発 */}
        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
          style={{ left: -48, top: -48 }}
          animate={{
            scale: [0, 2.5, 0],
            opacity: [1, 0.7, 0],
          }}
          transition={{ duration: 1 }}
        />

        {/* 衝撃波 */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-28 h-28 border-4 border-red-500 rounded-full"
            style={{ left: -56, top: -56 }}
            animate={{
              scale: [0, 3],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1,
              delay: i * 0.1,
            }}
          />
        ))}

        {/* 火花（多数） */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                left: -6,
                top: -6,
              }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 60,
                y: Math.sin((angle * Math.PI) / 180) * 60,
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.02,
              }}
            />
          );
        })}

        {/* 煙エフェクト */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={`smoke-${i}`}
            className="absolute w-16 h-16 bg-gray-500 rounded-full opacity-40"
            style={{
              left: -32 + (i * 10 - 15),
              top: -32,
            }}
            animate={{
              y: [-20, -80],
              scale: [0.5, 2],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
            }}
          />
        ))}

        {/* 絵文字 */}
        <motion.div
          className="absolute text-5xl"
          style={{ left: -28, top: -28 }}
          animate={{
            scale: [0, 1.3, 1],
            rotate: [0, 20, -20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 1 }}
        >
          💥
        </motion.div>

        {/* テキスト */}
        <motion.div
          className="absolute text-2xl font-bold text-red-600"
          style={{ left: -40, top: 40 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -20],
            scale: [0.8, 1.2, 1, 0.8],
          }}
          transition={{ duration: 1 }}
        >
          撃沈！
        </motion.div>
      </div>
    </motion.div>
  );
}
