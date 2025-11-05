import React from 'react';
import { motion } from 'framer-motion';

interface ScanEffectProps {
  position: { x: number; y: number };
  onComplete?: () => void;
}

/**
 * スキャンエフェクトコンポーネント
 * 格子スキャンスキル使用時のアニメーション
 */
export default function ScanEffect({ position, onComplete }: ScanEffectProps) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      onAnimationComplete={onComplete}
    >
      <div className="relative">
        {/* 十字のスキャンライン */}
        {[
          { width: 200, height: 4, left: -100, top: -2, rotate: 0 },
          { width: 4, height: 200, left: -2, top: -100, rotate: 0 },
        ].map((line, index) => (
          <motion.div
            key={index}
            className="absolute bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              width: line.width,
              height: line.height,
              left: line.left,
              top: line.top,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              boxShadow: [
                '0 0 0px rgba(0, 255, 255, 0)',
                '0 0 20px rgba(0, 255, 255, 0.8)',
                '0 0 20px rgba(0, 255, 255, 0.8)',
                '0 0 0px rgba(0, 255, 255, 0)',
              ],
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        ))}

        {/* 拡大するグリッド */}
        <motion.div
          className="absolute border-2 border-cyan-400"
          style={{ left: -50, top: -50 }}
          animate={{
            width: [0, 100],
            height: [0, 100],
            opacity: [1, 0],
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* パルス */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 border-2 border-cyan-400 rounded-full"
            style={{ left: -40, top: -40 }}
            animate={{
              scale: [0, 3],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* データパーティクル */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-300 rounded-full"
              style={{
                left: -4,
                top: -4,
              }}
              animate={{
                x: [
                  0,
                  Math.cos((angle * Math.PI) / 180) * 30,
                  Math.cos((angle * Math.PI) / 180) * 60,
                ],
                y: [
                  0,
                  Math.sin((angle * Math.PI) / 180) * 30,
                  Math.sin((angle * Math.PI) / 180) * 60,
                ],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                ease: 'easeOut',
              }}
            />
          );
        })}

        {/* 絵文字 */}
        <motion.div
          className="absolute text-5xl"
          style={{ left: -28, top: -28 }}
          animate={{
            scale: [0, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 1.5 }}
        >
          📡
        </motion.div>
      </div>
    </motion.div>
  );
}
