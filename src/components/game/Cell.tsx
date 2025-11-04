import React from 'react';
import { motion } from 'framer-motion';
import type { CellState, Position, InternalCellState } from '@/types/game';

interface CellProps {
  state: InternalCellState;
  position: Position;
  onClick?: () => void;
  disabled?: boolean;
  isHighlighted?: boolean;
  isOpponentBoard?: boolean;
}

/**
 * ゲームボードのセルコンポーネント
 * セルの状態に応じた表示とクリックイベントを処理
 *
 * Props:
 * - state: セルの状態（empty, ship, hit, miss）
 * - position: セルの位置
 * - onClick: クリック時のコールバック
 * - disabled: クリック無効化
 * - isHighlighted: ハイライト表示（スキル使用時など）
 * - isOpponentBoard: 相手のボードかどうか
 */
export default function Cell({
  state,
  position,
  onClick,
  disabled = false,
  isHighlighted = false,
  isOpponentBoard = false,
}: CellProps) {
  const getCellClassName = (): string => {
    const baseClass = 'w-8 h-8 md:w-10 md:h-10 rounded transition-all flex items-center justify-center text-lg';

    // ハイライト
    if (isHighlighted) {
      return `${baseClass} bg-yellow-300 border-2 border-yellow-500 animate-pulse`;
    }

    // 状態別スタイル
    switch (state) {
      case 'empty':
        return `${baseClass} bg-blue-200 hover:bg-blue-300 ${!disabled && onClick ? 'cursor-pointer' : 'cursor-default'}`;

      case 'ship':
        // 相手のボードでは船を表示しない（未攻撃として扱う）
        if (isOpponentBoard) {
          return `${baseClass} bg-blue-200 hover:bg-blue-300 ${!disabled && onClick ? 'cursor-pointer' : 'cursor-default'}`;
        }
        return `${baseClass} bg-pink-400 cursor-default`;

      case 'hit':
        return `${baseClass} bg-red-500 cursor-default`;

      case 'miss':
        return `${baseClass} bg-gray-400 cursor-default`;

      case 'sunk':
        return `${baseClass} bg-purple-600 cursor-default`;

      default:
        return `${baseClass} bg-blue-200`;
    }
  };

  const getCellContent = (): string => {
    switch (state) {
      case 'ship':
        // 相手のボードでは船を表示しない
        return isOpponentBoard ? '' : '🍓';
      case 'hit':
        return '💥';
      case 'miss':
        return '○';
      case 'sunk':
        return '💀';
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (disabled || !onClick) return;

    // 既に攻撃済みのセルはクリック不可
    if (state === 'hit' || state === 'miss') return;

    onClick();
  };

  return (
    <motion.button
      className={getCellClassName()}
      onClick={handleClick}
      disabled={disabled || state === 'hit' || state === 'miss'}
      whileHover={!disabled && onClick && state !== 'hit' && state !== 'miss' ? { scale: 1.1 } : {}}
      whileTap={!disabled && onClick && state !== 'hit' && state !== 'miss' ? { scale: 0.95 } : {}}
      transition={{ duration: 0.1 }}
      aria-label={`Cell at row ${position.y}, column ${position.x}, state: ${state}`}
    >
      {getCellContent()}
    </motion.button>
  );
}
