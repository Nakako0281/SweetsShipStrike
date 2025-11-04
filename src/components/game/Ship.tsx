import React from 'react';
import { motion } from 'framer-motion';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import type { Ship as ShipType, Direction } from '@/types/game';

interface ShipProps {
  ship: ShipType;
  isPlacing?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * 船コンポーネント
 * 船の表示と選択状態の管理
 *
 * Props:
 * - ship: 船のデータ
 * - isPlacing: 配置中かどうか
 * - isSelected: 選択されているかどうか
 * - onClick: クリック時のコールバック
 */
export default function Ship({ ship, isPlacing = false, isSelected = false, onClick }: ShipProps) {
  const shipDef = SHIP_DEFINITIONS[ship.type];
  const isHorizontal = ship.direction === 'horizontal';

  // HPバーの計算 (被弾していない部分の割合)
  const remainingHits = ship.hits.filter((hit) => !hit).length;
  const hpPercentage = (remainingHits / ship.size) * 100;

  return (
    <motion.div
      className={`
        relative p-3 rounded-lg border-2 transition-all
        ${isSelected ? 'border-pink-500 bg-pink-50 shadow-lg' : 'border-purple-200 bg-white hover:border-purple-300'}
        ${ship.sunk ? 'opacity-50 grayscale' : ''}
        ${onClick && !ship.sunk ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={onClick && !ship.sunk ? onClick : undefined}
      whileHover={onClick && !ship.sunk ? { scale: 1.05 } : {}}
      whileTap={onClick && !ship.sunk ? { scale: 0.95 } : {}}
    >
      {/* 船の名前 */}
      <h3 className="text-sm font-bold text-purple-800 mb-1">{shipDef.name}</h3>

      {/* 船のサイズ */}
      <p className="text-xs text-purple-600 mb-2">{shipDef.size}マス</p>

      {/* 船の視覚表現 */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: shipDef.size }, (_, i) => (
          <div
            key={i}
            className={`
              w-6 h-6 rounded flex items-center justify-center
              ${!ship.hits[i] ? 'bg-pink-400' : 'bg-red-600'}
            `}
          >
            {ship.hits[i] && '💥'}
          </div>
        ))}
      </div>

      {/* HPバー */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${
            hpPercentage > 60 ? 'bg-green-500' : hpPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>

      {/* HP表示 */}
      <p className="text-xs text-center text-purple-700 font-semibold">
        HP: {remainingHits} / {ship.size}
      </p>

      {/* 撃沈マーク */}
      {ship.sunk && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          撃沈
        </div>
      )}

      {/* 選択マーク */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
          ✓
        </div>
      )}

      {/* スキル情報 */}
      <div className="mt-2 pt-2 border-t border-purple-200">
        <p className="text-xs text-purple-600 mb-1">スキル:</p>
        <p className="text-xs font-semibold text-pink-600">{shipDef.skill.name}</p>
      </div>
    </motion.div>
  );
}
