'use client';

import { motion } from 'framer-motion';
import type { Position } from '@/types/game';

interface ShieldEffectProps {
  positions: Position[];
}

/**
 * シールドエフェクト
 * 防御された船の上に表示される
 */
export default function ShieldEffect({ positions }: ShieldEffectProps) {
  return (
    <>
      {positions.map((pos, index) => (
        <motion.div
          key={`shield-${pos.y}-${pos.x}-${index}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute pointer-events-none"
          style={{
            left: `${pos.x * 10}%`,
            top: `${pos.y * 10}%`,
            width: '10%',
            height: '10%',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg opacity-60 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🛡️</span>
          </div>
        </motion.div>
      ))}
    </>
  );
}
