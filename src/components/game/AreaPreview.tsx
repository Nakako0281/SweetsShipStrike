'use client';

import { motion } from 'framer-motion';
import type { Position } from '@/types/game';

interface AreaPreviewProps {
  centerPosition: Position | null;
  size: number; // エリアのサイズ（例: 3なら3x3）
  type: 'attack' | 'scan';
}

/**
 * エリアプレビュー
 * スキル使用時に影響範囲を表示
 */
export default function AreaPreview({ centerPosition, size, type }: AreaPreviewProps) {
  if (!centerPosition) return null;

  const halfSize = Math.floor(size / 2);
  const positions: Position[] = [];

  // 中心位置から範囲内の全マスを計算
  for (let dy = -halfSize; dy <= halfSize; dy++) {
    for (let dx = -halfSize; dx <= halfSize; dx++) {
      const y = centerPosition.y + dy;
      const x = centerPosition.x + dx;

      // ボード範囲内のみ追加
      if (y >= 0 && y < 10 && x >= 0 && x < 10) {
        positions.push({ y, x });
      }
    }
  }

  const color = type === 'attack'
    ? 'from-red-500 to-orange-500'
    : 'from-yellow-400 to-green-400';

  return (
    <>
      {positions.map((pos) => (
        <motion.div
          key={`area-${pos.y}-${pos.x}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute pointer-events-none z-10"
          style={{
            left: `${pos.x * 10}%`,
            top: `${pos.y * 10}%`,
            width: '10%',
            height: '10%',
          }}
        >
          <div className={`w-full h-full bg-gradient-to-br ${color} rounded border-2 border-white opacity-50`} />
        </motion.div>
      ))}
    </>
  );
}
