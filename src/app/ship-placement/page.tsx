'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import { BOARD_SIZE, TOTAL_MASSES, SETUP_TIMER_SECONDS } from '@/lib/utils/constants';
import type { CharacterType, GameMode, ShipType, Direction, Position } from '@/types/game';

interface PlacedShip {
  shipType: ShipType;
  position: Position;
  direction: Direction;
}

/**
 * 配置画面
 * 4隻の船を10×10のボードに配置
 *
 * UI要素:
 * - 10×10のグリッドボード表示
 * - 配置可能な船のリスト（4種類）
 * - 船の向き選択（縦/横）
 * - タイマー表示（60秒）
 * - 「配置完了」ボタン → ゲーム画面へ
 * - 「戻る」ボタン → キャラクター選択画面へ
 *
 * ルール:
 * - 合計14マス分の船を配置
 * - 船同士は重ならない
 * - ボード外にはみ出さない
 */
export default function ShipPlacementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as GameMode | null;
  const character = searchParams.get('character') as CharacterType | null;

  const [placedShips, setPlacedShips] = useState<PlacedShip[]>([]);
  const [selectedShipType, setSelectedShipType] = useState<ShipType | null>(null);
  const [direction, setDirection] = useState<Direction>('horizontal');
  const [timeRemaining, setTimeRemaining] = useState(SETUP_TIMER_SECONDS);
  const [board, setBoard] = useState<(ShipType | null)[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null))
  );

  const ships = Object.values(SHIP_DEFINITIONS);

  // タイマー処理
  useEffect(() => {
    if (timeRemaining <= 0) {
      // タイマー切れ → ランダム配置して次へ
      handleAutoPlacement();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // パラメータバリデーション
  useEffect(() => {
    if (!mode || !character) {
      router.push('/mode-select');
    }
  }, [mode, character, router]);

  // セルクリック処理
  const handleCellClick = (row: number, col: number) => {
    if (!selectedShipType) return;

    const ship = SHIP_DEFINITIONS[selectedShipType];
    const newPlacement: PlacedShip = {
      shipType: selectedShipType,
      position: { row, col },
      direction,
    };

    // 配置可能かチェック
    if (canPlaceShip(newPlacement, ship.size)) {
      // 既に配置済みの同じ船があれば削除
      const filteredShips = placedShips.filter((s) => s.shipType !== selectedShipType);
      setPlacedShips([...filteredShips, newPlacement]);
      updateBoard([...filteredShips, newPlacement]);
      setSelectedShipType(null); // 配置後は選択解除
    }
  };

  // 配置可能かチェック
  const canPlaceShip = (placement: PlacedShip, size: number): boolean => {
    const { row, col } = placement.position;
    const dir = placement.direction;

    // ボード外チェック
    if (dir === 'horizontal' && col + size > BOARD_SIZE) return false;
    if (dir === 'vertical' && row + size > BOARD_SIZE) return false;

    // 重複チェック（既存の配置済み船と重ならないか）
    const otherShips = placedShips.filter((s) => s.shipType !== placement.shipType);
    for (let i = 0; i < size; i++) {
      const checkRow = dir === 'vertical' ? row + i : row;
      const checkCol = dir === 'horizontal' ? col + i : col;

      for (const otherShip of otherShips) {
        const otherDef = SHIP_DEFINITIONS[otherShip.shipType];
        for (let j = 0; j < otherDef.size; j++) {
          const otherRow = otherShip.direction === 'vertical' ? otherShip.position.row + j : otherShip.position.row;
          const otherCol = otherShip.direction === 'horizontal' ? otherShip.position.col + j : otherShip.position.col;

          if (checkRow === otherRow && checkCol === otherCol) {
            return false;
          }
        }
      }
    }

    return true;
  };

  // ボード更新
  const updateBoard = (ships: PlacedShip[]) => {
    const newBoard: (ShipType | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(null)
    );

    ships.forEach((ship) => {
      const size = SHIP_DEFINITIONS[ship.shipType].size;
      for (let i = 0; i < size; i++) {
        const row = ship.direction === 'vertical' ? ship.position.row + i : ship.position.row;
        const col = ship.direction === 'horizontal' ? ship.position.col + i : ship.position.col;
        newBoard[row][col] = ship.shipType;
      }
    });

    setBoard(newBoard);
  };

  // 自動配置（タイマー切れ時）
  const handleAutoPlacement = () => {
    // TODO: ランダム配置ロジック実装
    console.log('Auto placement triggered');
    handleConfirm();
  };

  // 配置完了
  const handleConfirm = () => {
    if (placedShips.length < ships.length) {
      alert('すべての船を配置してください');
      return;
    }

    // ゲーム画面へ遷移（仮）
    router.push(`/game?mode=${mode}&character=${character}`);
  };

  // 戻る
  const handleBack = () => {
    router.push(`/character-select?mode=${mode}`);
  };

  // 配置済みかどうか
  const isShipPlaced = (shipType: ShipType) => {
    return placedShips.some((s) => s.shipType === shipType);
  };

  if (!mode || !character) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* ヘッダー */}
      <div className="text-center mb-6 animate-slideUp">
        <h1 className="text-2xl md:text-4xl font-bold text-pink-600 mb-2 drop-shadow-lg">
          船の配置
        </h1>
        <div className="flex items-center justify-center gap-4 text-purple-600 font-semibold">
          <span>残り時間: {timeRemaining}秒</span>
          <span>|</span>
          <span>配置済み: {placedShips.length} / {ships.length}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側: 船リスト */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold text-purple-800 mb-4">船を選択</h2>

            {/* 向き選択 */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-purple-600 mb-2">向き:</p>
              <div className="flex gap-2">
                <Button
                  variant={direction === 'horizontal' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDirection('horizontal')}
                >
                  横
                </Button>
                <Button
                  variant={direction === 'vertical' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDirection('vertical')}
                >
                  縦
                </Button>
              </div>
            </div>

            {/* 船リスト */}
            <div className="space-y-2">
              {ships.map((ship) => (
                <button
                  key={ship.id}
                  onClick={() => setSelectedShipType(ship.id)}
                  className={`
                    w-full p-3 rounded-lg border-2 text-left transition-all
                    ${
                      selectedShipType === ship.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-purple-200 bg-white hover:border-purple-300'
                    }
                    ${isShipPlaced(ship.id) ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-purple-800">{ship.name}</p>
                      <p className="text-sm text-purple-600">{ship.size}マス</p>
                    </div>
                    {isShipPlaced(ship.id) && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右側: ボード */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold text-purple-800 mb-4">配置ボード</h2>

            {/* グリッド */}
            <div className="inline-block bg-purple-200 p-2 rounded-lg">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`
                        w-8 h-8 md:w-10 md:h-10 rounded transition-all
                        ${cell ? 'bg-pink-400 hover:bg-pink-500' : 'bg-blue-200 hover:bg-blue-300'}
                        ${selectedShipType ? 'cursor-pointer' : 'cursor-not-allowed'}
                      `}
                      title={cell ? SHIP_DEFINITIONS[cell].name : ''}
                    />
                  ))
                )}
              </div>
            </div>

            {/* 操作ボタン */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={handleConfirm}
                variant="primary"
                size="lg"
                disabled={placedShips.length < ships.length}
              >
                配置完了
              </Button>
              <Button onClick={handleBack} variant="ghost" size="md">
                戻る
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
