'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { useGameEffects } from '@/hooks/useGameEffects';
import { useUIStore } from '@/store/uiStore';
import Board from '@/components/game/Board';
import HUD from '@/components/game/HUD';
import ShipList from '@/components/game/ShipList';
import SkillPanel from '@/components/game/SkillPanel';
import SkillModal from '@/components/game/SkillModal';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import HitEffect from '@/components/effects/HitEffect';
import MissEffect from '@/components/effects/MissEffect';
import SinkEffect from '@/components/effects/SinkEffect';
import type { CharacterType, GameMode, Position, Ship } from '@/types/game';

/**
 * ゲーム画面
 * バトルシップのメインゲーム画面
 *
 * 実装済みコンポーネントとフックを統合:
 * - useGame: ゲームロジック管理
 * - Board: ボード表示
 * - HUD: ターン・HP表示
 * - ShipList: 船一覧
 * - SkillPanel: スキルボタン
 * - Notification: 通知システム
 */
export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as GameMode | null;
  const character = searchParams.get('character') as CharacterType | null;

  // UIストア
  const addNotification = useUIStore((state) => state.addNotification);

  // エフェクト管理
  const { effects, addEffect } = useGameEffects();

  // スキルモーダル
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Ship | null>(null);

  // ゲームロジック
  const {
    gameState,
    myBoard,
    opponentBoard,
    myShips,
    opponentShips,
    isMyTurn,
    handleAttack,
    handleSkill,
    surrender,
  } = useGame();

  // パラメータバリデーション
  useEffect(() => {
    if (!mode || !character) {
      router.push('/mode-select');
    }
  }, [mode, character, router]);

  // ゲーム終了時のリダイレクト
  useEffect(() => {
    if (gameState?.phase === 'finished') {
      const isVictory = gameState.winner === gameState.myPlayerId;
      setTimeout(() => {
        router.push(`/result?mode=${mode}&result=${isVictory ? 'victory' : 'defeat'}`);
      }, 2000);
    }
  }, [gameState, mode, router]);

  // 降参処理
  const handleSurrender = () => {
    addNotification({
      type: 'warning',
      message: '降参しますか？',
    });

    if (confirm('降参しますか？')) {
      surrender();
      addNotification({
        type: 'info',
        message: '降参しました',
      });
    }
  };

  // 攻撃ハンドラー
  const handleCellClick = (position: Position) => {
    handleAttack(position);
  };

  if (!mode || !character || !gameState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* 通知システム */}
      <Notification />

      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-4 drop-shadow-lg">
          バトル中
        </h1>

        {/* HUD */}
        <HUD
          isMyTurn={isMyTurn()}
          myHP={gameState.players.find((p) => p.id === gameState.myPlayerId)?.totalHP || 0}
          opponentHP={gameState.players.find((p) => p.id !== gameState.myPlayerId)?.totalHP || 0}
          myShipCount={myShips.filter((s) => !s.isSunk).length}
          opponentShipCount={opponentShips.filter((s) => !s.isSunk).length}
          skillsUsed={gameState.players.find((p) => p.id === gameState.myPlayerId)?.skillsUsed || []}
        />
      </motion.div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 左側: 相手のボード（攻撃対象） */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">相手のボード</h2>
              <div className="relative">
                <Board
                  board={opponentBoard}
                  ships={[]} // 相手の船は表示しない
                  onCellClick={handleCellClick}
                  isInteractive={isMyTurn()}
                  showShips={false}
                />
                {/* 攻撃エフェクト */}
                {effects.map((effect) => {
                  const Component =
                    effect.type === 'hit'
                      ? HitEffect
                      : effect.type === 'miss'
                      ? MissEffect
                      : SinkEffect;
                  return <Component key={effect.id} position={effect.position} />;
                })}
              </div>
            </div>
          </motion.div>

          {/* 右側: 情報パネル */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* スキルパネル */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">スキル</h2>
              <SkillPanel
                ships={myShips}
                onSkillClick={(skillId) => {
                  const ship = myShips.find((s) => s.skill.id === skillId);
                  if (ship) {
                    setSelectedSkill(ship);
                    setIsSkillModalOpen(true);
                  }
                }}
                disabled={!isMyTurn()}
              />
            </div>

            {/* 自分の船一覧 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">あなたの船</h2>
              <ShipList ships={myShips} />
            </div>

            {/* 降参ボタン */}
            <Button onClick={handleSurrender} variant="danger" size="lg" className="w-full">
              降参
            </Button>
          </motion.div>
        </div>

        {/* 自分のボード（下部） */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">あなたのボード</h2>
            <Board
              board={myBoard}
              ships={myShips}
              onCellClick={() => {}} // 自分のボードはクリック不可
              isInteractive={false}
              showShips={true}
            />
          </div>
        </motion.div>
      </div>

      {/* ゲーム終了アニメーション */}
      <AnimatePresence>
        {gameState.phase === 'finished' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-xl shadow-2xl p-12 text-center max-w-md"
            >
              <h1
                className={`text-6xl font-bold mb-4 ${
                  gameState.winner === gameState.myPlayerId ? 'text-pink-600' : 'text-purple-600'
                }`}
              >
                {gameState.winner === gameState.myPlayerId ? '勝利！' : '敗北...'}
              </h1>
              <p className="text-2xl text-purple-700 mb-6">
                {gameState.winner === gameState.myPlayerId
                  ? 'おめでとうございます！'
                  : 'また挑戦してください！'}
              </p>
              <p className="text-gray-600">リザルト画面へ移動します...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* スキル実行モーダル */}
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        selectedSkill={selectedSkill}
        opponentBoard={opponentBoard}
        onExecuteSkill={(position) => {
          if (selectedSkill) {
            handleSkill(selectedSkill.skill.id, position);
            addNotification({
              type: 'success',
              message: `${selectedSkill.name}のスキルを使用しました！`,
            });
          }
        }}
      />
    </div>
  );
}
