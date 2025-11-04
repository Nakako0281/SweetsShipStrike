import React from 'react';
import { motion } from 'framer-motion';
import type { PlayerState, CharacterType } from '@/types/game';

interface HUDProps {
  player: PlayerState;
  opponent: PlayerState;
  isPlayerTurn: boolean;
  turnCount: number;
}

/**
 * HUD（ヘッドアップディスプレイ）コンポーネント
 * ゲーム中の重要情報を表示
 *
 * Props:
 * - player: 自分のプレイヤー状態
 * - opponent: 相手のプレイヤー状態
 * - isPlayerTurn: 自分のターンかどうか
 * - turnCount: ターン数
 */
export default function HUD({ player, opponent, isPlayerTurn, turnCount }: HUDProps) {
  // HP割合計算
  const playerHPPercentage = player.hp;
  const opponentHPPercentage = opponent.hp;

  // 残存艦数計算
  const playerShipsAlive = player.ships.filter((s) => !s.sunk).length;
  const opponentShipsAlive = opponent.ships.filter((s) => !s.sunk).length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      {/* ターン表示 */}
      <div className="text-center mb-4">
        <motion.div
          className={`inline-block px-6 py-2 rounded-full font-bold text-lg ${
            isPlayerTurn ? 'bg-pink-500 text-white' : 'bg-purple-500 text-white'
          }`}
          animate={{ scale: isPlayerTurn ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isPlayerTurn ? Infinity : 0, repeatDelay: 1 }}
        >
          {isPlayerTurn ? 'あなたのターン' : '相手のターン'}
        </motion.div>
        <p className="text-sm text-purple-600 mt-2">ターン {turnCount}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 自分の情報 */}
        <div className="border-2 border-pink-300 rounded-lg p-3 bg-pink-50">
          <h3 className="text-sm font-bold text-pink-600 mb-2">あなた</h3>

          {/* HP */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-purple-700">HP</span>
              <span className="font-bold text-pink-600">
                {player.remainingMasses} / {player.totalMasses}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  playerHPPercentage > 60
                    ? 'bg-green-500'
                    : playerHPPercentage > 30
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${playerHPPercentage}%` }}
              />
            </div>
          </div>

          {/* 残存艦 */}
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-purple-700">残存艦:</span>
            <span className="font-bold text-pink-600">{playerShipsAlive} / 4</span>
          </div>

          {/* 使用済みスキル */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-purple-700">使用スキル:</span>
            <span className="font-bold text-pink-600">{player.activeSkills.length} / 4</span>
          </div>
        </div>

        {/* 相手の情報 */}
        <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50">
          <h3 className="text-sm font-bold text-purple-600 mb-2">相手</h3>

          {/* HP */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-purple-700">HP</span>
              <span className="font-bold text-purple-600">
                {opponent.remainingMasses} / {opponent.totalMasses}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  opponentHPPercentage > 60
                    ? 'bg-green-500'
                    : opponentHPPercentage > 30
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${opponentHPPercentage}%` }}
              />
            </div>
          </div>

          {/* 残存艦 */}
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-purple-700">残存艦:</span>
            <span className="font-bold text-purple-600">{opponentShipsAlive} / 4</span>
          </div>

          {/* 使用済みスキル */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-purple-700">使用スキル:</span>
            <span className="font-bold text-purple-600">{opponent.activeSkills.length} / 4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
