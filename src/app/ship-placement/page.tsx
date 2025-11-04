'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import Board from '@/components/game/Board';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { createEmptyBoard, canPlaceShip, placeShip, randomPlaceShips } from '@/lib/game/board';
import { BOARD_SIZE, SETUP_TIMER_SECONDS } from '@/lib/utils/constants';
import { SHIPS } from '@/lib/game/ships';
import type { CharacterType, GameMode, Ship, Position, CellState } from '@/types/game';

type BoardType = CellState[][];

export default function ShipPlacementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as GameMode | null;
  const character = searchParams.get('character') as CharacterType | null;

  const initializeGame = useGameStore((state) => state.initializeGame);
  const placeShips = useGameStore((state) => state.placeShips);
  const addNotification = useUIStore((state) => state.addNotification);

  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [placedShips, setPlacedShips] = useState<Ship[]>([]);
  const [selectedShipIndex, setSelectedShipIndex] = useState<number | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(SETUP_TIMER_SECONDS);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleAutoPlace();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  useEffect(() => {
    if (!mode || !character) {
      router.push('/mode-select');
    }
  }, [mode, character, router]);

  const availableShips = SHIPS.map((ship, index) => ({
    ...ship,
    isPlaced: placedShips.some((s) => s.id === ship.id),
    index,
  }));

  const handleCellClick = (position: Position) => {
    if (selectedShipIndex === null) {
      addNotification({ type: 'warning', message: '配置する船を選択してください' });
      return;
    }

    const ship = SHIPS[selectedShipIndex];
    const newShip: Ship = {
      id: `player1_${ship.id}`,
      type: ship.id,
      size: ship.size,
      position: position,
      direction: isHorizontal ? 'horizontal' : 'vertical',
      hits: Array(ship.size).fill(false),
      sunk: false,
      skillUsed: false,
    };

    if (!canPlaceShip(board, newShip)) {
      addNotification({ type: 'error', message: '船を配置できません' });
      return;
    }

    const newBoard = placeShip(board, newShip);
    if (newBoard) {
      setBoard(newBoard);
      setPlacedShips([...placedShips, newShip]);
      setSelectedShipIndex(null);
      addNotification({ type: 'success', message: `${ship.name}を配置しました` });
    }
  };

  const handleSelectShip = (index: number) => {
    if (availableShips[index].isPlaced) {
      addNotification({ type: 'warning', message: 'この船は既に配置されています' });
      return;
    }
    setSelectedShipIndex(index);
  };

  const handleRotate = () => {
    setIsHorizontal(!isHorizontal);
    addNotification({ type: 'info', message: `方向: ${!isHorizontal ? '横' : '縦'}` });
  };

  const handleReset = () => {
    setBoard(createEmptyBoard());
    setPlacedShips([]);
    setSelectedShipIndex(null);
    addNotification({ type: 'info', message: '配置をリセットしました' });
  };

  const handleAutoPlace = () => {
    const ships = randomPlaceShips();
    const newBoard = createEmptyBoard();

    // 船をボードに配置
    ships.forEach((ship) => {
      if (ship.position) {
        const { x, y } = ship.position;
        for (let i = 0; i < ship.size; i++) {
          if (ship.direction === 'horizontal') {
            // TODO: ボードに船の状態を設定
          } else {
            // TODO: ボードに船の状態を設定
          }
        }
      }
    });

    setBoard(newBoard);
    setPlacedShips(ships);
    setSelectedShipIndex(null);
    addNotification({ type: 'success', message: '自動配置が完了しました' });
  };

  const handleStartGame = () => {
    if (placedShips.length !== SHIPS.length) {
      addNotification({ type: 'error', message: 'すべての船を配置してください' });
      return;
    }

    // ゲーム初期化（プレイヤー1とプレイヤー2のキャラクターを指定）
    const player2Char: CharacterType = mode === 'cpu' ? 'cpu_normal' : character!;
    initializeGame(mode!, character!, player2Char);

    // プレイヤー1の船を配置
    placeShips('player1', placedShips);

    addNotification({ type: 'success', message: 'ゲームを開始します！' });
    router.push(`/game?mode=${mode}&character=${character}`);
  };

  if (!mode || !character) {
    return null;
  }

  const allShipsPlaced = placedShips.length === SHIPS.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      <Notification />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-2 drop-shadow-lg">船の配置</h1>
        <div className="flex items-center justify-center gap-4 text-purple-600 font-semibold">
          <span>残り時間: {timeRemaining}秒</span>
          <span>|</span>
          <span>配置済み: {placedShips.length}/{SHIPS.length}</span>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">配置ボード</h2>
            <Board board={board} onCellClick={handleCellClick} disabled={false} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">船を選択</h2>
            <div className="space-y-3">
              {availableShips.map((ship) => (
                <button key={ship.id} onClick={() => handleSelectShip(ship.index)} disabled={ship.isPlaced}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedShipIndex === ship.index ? 'bg-pink-500 text-white shadow-lg scale-105' :
                    ship.isPlaced ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
                    'bg-purple-50 hover:bg-purple-100 text-purple-800'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{ship.name}</p>
                      <p className="text-sm opacity-75">サイズ: {ship.size}</p>
                    </div>
                    {ship.isPlaced && <span className="text-2xl">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
            <Button onClick={handleRotate} variant="secondary" size="md" className="w-full">
              🔄 回転 ({isHorizontal ? '横' : '縦'})
            </Button>
            <Button onClick={handleAutoPlace} variant="ghost" size="md" className="w-full">
              ✨ 自動配置
            </Button>
            <Button onClick={handleReset} variant="danger" size="md" className="w-full">
              🔄 リセット
            </Button>
          </div>

          {allShipsPlaced && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Button onClick={handleStartGame} variant="primary" size="lg" className="w-full">
                ゲーム開始！
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
