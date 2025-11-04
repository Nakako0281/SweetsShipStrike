'use client';

import { PlayerId } from '@/types/game';

interface TurnIndicatorProps {
  currentTurn: PlayerId;
  localPlayerId: PlayerId;
  turnCount: number;
  isMyTurn: boolean;
}

export default function TurnIndicator({
  currentTurn,
  localPlayerId,
  turnCount,
  isMyTurn,
}: TurnIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white/90 rounded-lg shadow-lg">
      {/* ターン数表示 */}
      <div className="text-sm text-gray-600">
        ターン {turnCount}
      </div>

      {/* 現在のターン表示 */}
      <div className={`text-2xl font-bold transition-colors ${
        isMyTurn ? 'text-blue-600' : 'text-red-600'
      }`}>
        {isMyTurn ? 'あなたのターン' : '相手のターン'}
      </div>

      {/* ターンインジケーター */}
      <div className="flex gap-2 items-center">
        <div className={`w-3 h-3 rounded-full transition-all ${
          currentTurn === 'player1'
            ? 'bg-blue-600 scale-125'
            : 'bg-gray-300'
        }`} />
        <span className="text-xs text-gray-500">vs</span>
        <div className={`w-3 h-3 rounded-full transition-all ${
          currentTurn === 'player2'
            ? 'bg-red-600 scale-125'
            : 'bg-gray-300'
        }`} />
      </div>

      {/* アクション指示 */}
      {isMyTurn && (
        <div className="text-sm text-gray-600 animate-pulse">
          攻撃するマスを選択してください
        </div>
      )}
    </div>
  );
}
