'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { GameMode } from '@/types/game';

/**
 * リザルト画面
 * ゲーム終了後の結果表示画面
 *
 * UI要素:
 * - 勝敗表示
 * - 獲得コイン表示（MVP拡張版で実装予定）
 * - 戦績サマリー（ヒット数、ミス数など）
 * - 「タイトルへ戻る」ボタン
 * - 「もう一度対戦」ボタン
 *
 * クエリパラメータ:
 * - mode: 'cpu' | 'online' (ゲームモード)
 * - result: 'victory' | 'defeat' (勝敗)
 */
export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as GameMode | null;
  const result = searchParams.get('result') as 'victory' | 'defeat' | null;

  // ゲームストアから統計データを取得
  const gameState = useGameStore((state) => state.gameState);
  const resetGame = useGameStore((state) => state.resetGame);

  // パラメータバリデーション
  useEffect(() => {
    if (!mode || !result) {
      router.push('/');
    }
  }, [mode, result, router]);

  const isVictory = result === 'victory';

  // 統計データの計算
  const stats = useMemo(() => {
    if (!gameState) {
      return {
        hitCount: 0,
        missCount: 0,
        skillCount: 0,
        remainingHP: 0,
        totalTurns: 0,
      };
    }

    const myPlayer = gameState.players.find((p) => p.id === gameState.myPlayerId);
    if (!myPlayer) {
      return {
        hitCount: 0,
        missCount: 0,
        skillCount: 0,
        remainingHP: 0,
        totalTurns: 0,
      };
    }

    // 攻撃履歴からヒット数とミス数を計算
    const myAttacks = gameState.turnHistory.filter((turn) => turn.playerId === gameState.myPlayerId);
    const hitCount = myAttacks.filter((turn) => turn.result === 'hit' || turn.result === 'sunk').length;
    const missCount = myAttacks.filter((turn) => turn.result === 'miss').length;

    return {
      hitCount,
      missCount,
      skillCount: myPlayer.skillsUsed.length,
      remainingHP: myPlayer.totalHP,
      totalTurns: gameState.turnHistory.length,
    };
  }, [gameState]);

  // タイトルへ戻る
  const handleBackToTitle = () => {
    resetGame();
    router.push('/');
  };

  // もう一度対戦
  const handleRematch = () => {
    resetGame();
    if (mode === 'cpu') {
      router.push('/character-select?mode=cpu');
    } else {
      router.push('/online-lobby');
    }
  };

  if (!mode || !result) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* リザルトカード */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* 勝敗表示 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg ${
              isVictory ? 'text-pink-600' : 'text-purple-600'
            }`}
          >
            {isVictory ? '勝利！' : '敗北...'}
          </h1>
          <p className="text-xl md:text-2xl text-purple-700 mb-8">
            {isVictory ? 'おめでとうございます！' : 'また挑戦してください！'}
          </p>
        </motion.div>

        {/* 戦績サマリー */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-purple-50 rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-purple-800 mb-4">戦績</h2>
          <div className="grid grid-cols-2 gap-6 text-left">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <p className="text-sm text-purple-600 mb-1 flex items-center gap-2">
                <span>💥</span> ヒット数
              </p>
              <p className="text-3xl font-bold text-pink-600">{stats.hitCount}</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <p className="text-sm text-purple-600 mb-1 flex items-center gap-2">
                <span>💧</span> ミス数
              </p>
              <p className="text-3xl font-bold text-purple-600">{stats.missCount}</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <p className="text-sm text-purple-600 mb-1 flex items-center gap-2">
                <span>✨</span> スキル使用回数
              </p>
              <p className="text-3xl font-bold text-purple-600">{stats.skillCount}</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <p className="text-sm text-purple-600 mb-1 flex items-center gap-2">
                <span>❤️</span> 残りHP
              </p>
              <p className="text-3xl font-bold text-pink-600">{stats.remainingHP}</p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            className="mt-4 pt-4 border-t border-purple-200"
          >
            <p className="text-sm text-purple-600">
              総ターン数: <span className="font-bold text-purple-800">{stats.totalTurns}</span>
            </p>
            <p className="text-sm text-purple-600 mt-1">
              命中率:{' '}
              <span className="font-bold text-pink-600">
                {stats.hitCount + stats.missCount > 0
                  ? ((stats.hitCount / (stats.hitCount + stats.missCount)) * 100).toFixed(1)
                  : '0.0'}
                %
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* 獲得コイン（MVP拡張版用、仮表示） */}
        {isVictory && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-6 mb-8 border-2 border-yellow-400"
          >
            <p className="text-lg text-yellow-800 mb-2">獲得コイン</p>
            <p className="text-4xl font-bold text-yellow-600">+100 🪙</p>
            <p className="text-xs text-yellow-700 mt-2">※MVP拡張版で実装予定</p>
          </motion.div>
        )}

        {/* ボタン */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <Button onClick={handleRematch} variant="primary" size="lg">
            もう一度対戦
          </Button>
          <Button onClick={handleBackToTitle} variant="ghost" size="md">
            タイトルへ戻る
          </Button>
        </motion.div>
      </motion.div>

      {/* 装飾的な要素 */}
      {isVictory && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 0 }}
              animate={{
                y: window.innerHeight + 100,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 5,
              }}
              className="absolute text-4xl"
            >
              {['🍓', '🍫', '🍰', '🧁'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
