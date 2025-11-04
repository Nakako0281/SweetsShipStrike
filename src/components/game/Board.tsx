import React from 'react';
import { BOARD_SIZE } from '@/lib/utils/constants';
import Cell from './Cell';
import type { CellState, Position, InternalBoard, InternalCellState } from '@/types/game';

interface BoardProps {
  board: InternalBoard;
  isOpponentBoard?: boolean;
  onCellClick?: (position: Position) => void;
  disabled?: boolean;
  highlightedCells?: Position[];
}

/**
 * ゲームボードコンポーネント
 * 10×10のグリッドを表示し、セルのクリックイベントを処理
 *
 * Props:
 * - board: ボードの状態
 * - isOpponentBoard: 相手のボードかどうか（相手の船を非表示にする）
 * - onCellClick: セルクリック時のコールバック
 * - disabled: クリック無効化
 * - highlightedCells: ハイライトするセルの配列（スキル使用時など）
 */
export default function Board({
  board,
  isOpponentBoard = false,
  onCellClick,
  disabled = false,
  highlightedCells = [],
}: BoardProps) {
  const handleCellClick = (row: number, col: number) => {
    if (disabled || !onCellClick) return;
    onCellClick({ x: col, y: row });
  };

  const isCellHighlighted = (row: number, col: number): boolean => {
    return highlightedCells.some((pos) => pos.x === col && pos.y === row);
  };

  const getCellState = (row: number, col: number): InternalCellState => {
    return board[row]?.[col]?.state || 'empty';
  };

  return (
    <div className="inline-block bg-purple-200 p-2 rounded-lg shadow-lg">
      {/* 列番号ヘッダー */}
      <div className="flex mb-1">
        <div className="w-6 h-6" /> {/* 左上の空白 */}
        {Array.from({ length: BOARD_SIZE }, (_, i) => (
          <div
            key={`col-header-${i}`}
            className="w-8 h-6 md:w-10 md:h-6 flex items-center justify-center text-xs font-bold text-purple-700"
          >
            {i}
          </div>
        ))}
      </div>

      {/* ボードグリッド */}
      {board.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {/* 行番号ヘッダー */}
          <div className="w-6 h-8 md:h-10 flex items-center justify-center text-xs font-bold text-purple-700">
            {rowIndex}
          </div>

          {/* セル */}
          {row.map((_, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              state={getCellState(rowIndex, colIndex)}
              position={{ x: colIndex, y: rowIndex }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={disabled}
              isHighlighted={isCellHighlighted(rowIndex, colIndex)}
              isOpponentBoard={isOpponentBoard}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
