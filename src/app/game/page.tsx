'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { BOARD_SIZE } from '@/lib/utils/constants';
import type { CharacterType, GameMode, CellState, Position } from '@/types/game';

/**
 * ゲーム画面
 * バトルシップのメインゲーム画面
 *
 * UI要素:
 * - 自分のボード（配置した船の状態確認）
 * - 相手のボード（攻撃対象）
 * - ターン表示
 * - 残りHP表示
 * - スキルボタン
 * - 降参ボタン
 *
 * MVP版では基本的な攻撃のみ実装
 * スキルシステムは後の週で実装
 */
export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as GameMode | null;
  const character = searchParams.get('character') as CharacterType | null;

  const [myBoard, setMyBoard] = useState<CellState[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill('empty'))
  );
  const [opponentBoard, setOpponentBoard] = useState<CellState[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill('empty'))
  );
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [myHP, setMyHP] = useState(14); // 合計14マス
  const [opponentHP, setOpponentHP] = useState(14);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [gamePhase, setGamePhase] = useState<'playing' | 'victory' | 'defeat'>('playing');

  // パラメータバリデーション
  useEffect(() => {
    if (!mode || !character) {
      router.push('/mode-select');
    }
  }, [mode, character, router]);

  // 攻撃処理（仮実装）
  const handleAttack = (row: number, col: number) => {
    if (!isMyTurn) return;
    if (opponentBoard[row][col] !== 'empty') return; // 既に攻撃済み

    // 仮のヒット判定（ランダム）
    const isHit = Math.random() > 0.7;
    const newBoard = [...opponentBoard];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = isHit ? 'hit' : 'miss';
    setOpponentBoard(newBoard);

    if (isHit) {
      const newHP = opponentHP - 1;
      setOpponentHP(newHP);
      if (newHP <= 0) {
        setGamePhase('victory');
      }
    }

    // ターン交代
    setIsMyTurn(false);

    // CPU/相手のターン（仮実装）
    setTimeout(() => {
      handleOpponentTurn();
    }, 1000);
  };

  // 相手のターン処理（仮実装）
  const handleOpponentTurn = () => {
    // ランダムに攻撃
    const availableCells: Position[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (myBoard[row][col] === 'empty' || myBoard[row][col] === 'ship') {
          availableCells.push({ row, col });
        }
      }
    }

    if (availableCells.length === 0) {
      setIsMyTurn(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const target = availableCells[randomIndex];

    // 仮のヒット判定
    const isHit = myBoard[target.row][target.col] === 'ship' || Math.random() > 0.7;
    const newBoard = [...myBoard];
    newBoard[target.row] = [...newBoard[target.row]];
    newBoard[target.row][target.col] = isHit ? 'hit' : 'miss';
    setMyBoard(newBoard);

    if (isHit) {
      const newHP = myHP - 1;
      setMyHP(newHP);
      if (newHP <= 0) {
        setGamePhase('defeat');
      }
    }

    setIsMyTurn(true);
  };

  // 降参処理
  const handleSurrender = () => {
    if (confirm('降参しますか？')) {
      setGamePhase('defeat');
    }
  };

  // リザルト画面へ
  const handleGoToResult = () => {
    router.push(`/result?mode=${mode}&result=${gamePhase}`);
  };

  if (!mode || !character) {
    return null;
  }

  // ゲーム終了時
  if (gamePhase !== 'playing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center animate-fadeIn">
          <h1
            className={`text-4xl font-bold mb-4 ${
              gamePhase === 'victory' ? 'text-pink-600' : 'text-purple-600'
            }`}
          >
            {gamePhase === 'victory' ? '勝利！' : '敗北...'}
          </h1>
          <p className="text-lg text-purple-700 mb-6">
            {gamePhase === 'victory'
              ? 'おめでとうございます！'
              : 'また挑戦してください！'}
          </p>
          <Button onClick={handleGoToResult} variant="primary" size="lg">
            リザルトへ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* ヘッダー */}
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-4xl font-bold text-pink-600 mb-2 drop-shadow-lg">
          バトル中
        </h1>
        <div className="flex items-center justify-center gap-6 text-purple-600 font-semibold">
          <span>あなた: HP {myHP} / 14</span>
          <span>|</span>
          <span>相手: HP {opponentHP} / 14</span>
        </div>
        <p className="text-lg font-bold mt-2" style={{ color: isMyTurn ? '#ec4899' : '#9333ea' }}>
          {isMyTurn ? 'あなたのターン' : '相手のターン'}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側: 相手のボード（攻撃対象） */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-purple-800 mb-4">相手のボード</h2>

          <div className="inline-block bg-purple-200 p-2 rounded-lg">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
              {opponentBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`opponent-${rowIndex}-${colIndex}`}
                    onClick={() => handleAttack(rowIndex, colIndex)}
                    disabled={!isMyTurn || cell !== 'empty'}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 rounded transition-all
                      ${cell === 'empty' && 'bg-blue-200 hover:bg-blue-300'}
                      ${cell === 'hit' && 'bg-red-500'}
                      ${cell === 'miss' && 'bg-gray-400'}
                      ${isMyTurn && cell === 'empty' ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                    title={cell === 'empty' ? '攻撃' : cell === 'hit' ? 'ヒット' : 'ミス'}
                  >
                    {cell === 'hit' && '💥'}
                    {cell === 'miss' && '○'}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 右側: 自分のボード */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-purple-800 mb-4">あなたのボード</h2>

          <div className="inline-block bg-purple-200 p-2 rounded-lg">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
              {myBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`my-${rowIndex}-${colIndex}`}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 rounded
                      ${cell === 'empty' && 'bg-blue-200'}
                      ${cell === 'ship' && 'bg-pink-400'}
                      ${cell === 'hit' && 'bg-red-500'}
                      ${cell === 'miss' && 'bg-gray-400'}
                    `}
                    title={
                      cell === 'ship'
                        ? '船'
                        : cell === 'hit'
                        ? '被弾'
                        : cell === 'miss'
                        ? 'ミス'
                        : '空'
                    }
                  >
                    {cell === 'hit' && '💥'}
                    {cell === 'miss' && '○'}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 降参ボタン */}
          <div className="mt-4">
            <Button onClick={handleSurrender} variant="danger" size="md" className="w-full">
              降参
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
