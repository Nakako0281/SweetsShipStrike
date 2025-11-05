'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Board from '@/components/game/Board';
import type { Ship, Position, InternalBoard, Direction } from '@/types/game';

interface MoveShipModalProps {
  isOpen: boolean;
  onClose: () => void;
  myBoard: InternalBoard;
  myShips: Ship[];
  onMoveShip: (shipId: string, newPosition: Position, newDirection: Direction) => void;
}

/**
 * 船移動モーダル
 * スイートエスケープスキル用
 */
export default function MoveShipModal({
  isOpen,
  onClose,
  myBoard,
  myShips,
  onMoveShip,
}: MoveShipModalProps) {
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [newDirection, setNewDirection] = useState<Direction>('horizontal');

  if (!isOpen) return null;

  const handleShipSelect = (ship: Ship) => {
    setSelectedShip(ship);
    setNewPosition(null);
  };

  const handleCellClick = (position: Position) => {
    if (selectedShip) {
      setNewPosition(position);
    }
  };

  const handleDirectionToggle = () => {
    setNewDirection(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const handleExecute = () => {
    if (selectedShip && newPosition) {
      onMoveShip(selectedShip.id, newPosition, newDirection);
      setSelectedShip(null);
      setNewPosition(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedShip(null);
    setNewPosition(null);
    onClose();
  };

  // 生存している船のみ選択可能
  const aliveShips = myShips.filter(ship => !ship.isSunk);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* ヘッダー */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">🍬</div>
                <h2 className="text-3xl font-bold text-purple-800 mb-2">スイートエスケープ</h2>
                <p className="text-purple-600">移動する船と新しい位置を選択してください</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左: 船選択 */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">1. 船を選択</h3>
                  <div className="space-y-2">
                    {aliveShips.map((ship) => (
                      <button
                        key={ship.id}
                        onClick={() => handleShipSelect(ship)}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          selectedShip?.id === ship.id
                            ? 'border-pink-500 bg-pink-100'
                            : 'border-purple-200 bg-white hover:border-purple-400'
                        }`}
                      >
                        <div className="font-semibold text-purple-800">{ship.name}</div>
                        <div className="text-sm text-purple-600">
                          サイズ: {ship.size}マス
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 中央: ボード */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">
                    2. 新しい位置を選択
                  </h3>
                  <div className="flex justify-center mb-4">
                    <Board
                      board={myBoard}
                      isOpponentBoard={false}
                      onCellClick={handleCellClick}
                      disabled={!selectedShip}
                    />
                  </div>

                  {/* 方向切り替え */}
                  {selectedShip && (
                    <div className="flex justify-center mb-4">
                      <Button
                        onClick={handleDirectionToggle}
                        variant="ghost"
                        size="md"
                      >
                        方向: {newDirection === 'horizontal' ? '横 →' : '縦 ↓'}
                      </Button>
                    </div>
                  )}

                  {/* 選択情報 */}
                  {selectedShip && newPosition && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-800 font-semibold">
                        {selectedShip.name} を ({newPosition.y + 1}, {newPosition.x + 1}) に
                        {newDirection === 'horizontal' ? '横向き' : '縦向き'}で配置
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ボタン */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleExecute}
                  variant="primary"
                  size="lg"
                  disabled={!selectedShip || !newPosition}
                  className="flex-1"
                >
                  移動実行
                </Button>
                <Button onClick={handleCancel} variant="ghost" size="lg" className="flex-1">
                  キャンセル
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
