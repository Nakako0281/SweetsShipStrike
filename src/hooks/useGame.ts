import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { getCPUAttackPosition, getDifficultyFromCharacter, getCPUThinkingTime } from '@/lib/ai/cpuAI';
import { toDisplayBoard } from '@/lib/game/board';
import type { Position, CharacterType, GameMode } from '@/types/game';

/**
 * ゲームロジックを統合するカスタムフック
 * ゲーム状態の管理、攻撃処理、CPU AI、通知などを統合
 */
export function useGame() {
  const gameState = useGameStore((state) => state.gameState);
  const localPlayerId = useGameStore((state) => state.localPlayerId);
  const isMyTurn = useGameStore((state) => state.isMyTurn);
  const attack = useGameStore((state) => state.attack);
  const surrender = useGameStore((state) => state.surrender);
  const addNotification = useUIStore((state) => state.addNotification);

  /**
   * 攻撃処理（通知付き）
   */
  const handleAttack = useCallback((position: Position) => {
    if (!gameState || !isMyTurn()) {
      addNotification({
        type: 'error',
        message: 'あなたのターンではありません',
      });
      return;
    }

    try {
      attack(position);

      // TODO: 攻撃結果に応じた通知
      // const result = ... から取得
      // if (result.isHit) {
      //   addNotification({ type: 'success', message: 'ヒット！' });
      // } else {
      //   addNotification({ type: 'info', message: 'ミス...' });
      // }
    } catch (error) {
      addNotification({
        type: 'error',
        message: (error as Error).message,
      });
    }
  }, [gameState, isMyTurn, attack, addNotification]);

  /**
   * 降参処理（確認付き）
   */
  const handleSurrender = useCallback(() => {
    const confirmed = window.confirm('降参しますか？');
    if (confirmed) {
      surrender();
      addNotification({
        type: 'info',
        message: '降参しました',
      });
    }
  }, [surrender, addNotification]);

  /**
   * CPU のターン処理
   */
  const processCPUTurn = useCallback(() => {
    if (!gameState || !localPlayerId) return;

    const opponentId = localPlayerId === 'player1' ? 'player2' : 'player1';
    const opponent = gameState.players[opponentId];

    // CPU キャラクターかチェック
    if (!opponent.character.startsWith('cpu_')) return;

    // 自分のターンでない = CPUのターン
    if (gameState.currentTurn !== localPlayerId) {
      const difficulty = getDifficultyFromCharacter(opponent.character);
      const thinkingTime = getCPUThinkingTime(difficulty);

      // CPU思考時間後に攻撃
      setTimeout(() => {
        const myBoard = gameState.players[localPlayerId].board;
        const displayBoard = toDisplayBoard(myBoard); // CPU AIには表示用ボードを渡す
        const attackPosition = getCPUAttackPosition(difficulty, displayBoard, opponent.character);

        if (attackPosition) {
          // CPUの攻撃を実行
          // TODO: CPUの攻撃処理を実装
          addNotification({
            type: 'warning',
            message: 'CPUが攻撃してきました！',
          });
        }
      }, thinkingTime);
    }
  }, [gameState, localPlayerId, addNotification]);

  /**
   * ゲーム状態の変化を監視してCPUターンを処理
   */
  useEffect(() => {
    if (gameState?.mode === 'cpu' && gameState.phase === 'battle') {
      processCPUTurn();
    }
  }, [gameState?.currentTurn, gameState?.mode, gameState?.phase, processCPUTurn]);

  /**
   * ゲーム終了時の処理
   */
  useEffect(() => {
    if (gameState?.phase === 'finished') {
      const winner = gameState.winner;
      const isWinner = winner === localPlayerId;

      addNotification({
        type: isWinner ? 'success' : 'error',
        message: isWinner ? '勝利！' : '敗北...',
        duration: 5000,
      });
    }
  }, [gameState?.phase, gameState?.winner, localPlayerId, addNotification]);

  return {
    gameState,
    localPlayerId,
    isMyTurn: isMyTurn(),
    handleAttack,
    handleSurrender,
  };
}

/**
 * ゲーム初期化用カスタムフック
 */
export function useGameInitializer(
  mode: GameMode,
  player1Char: CharacterType,
  player2Char: CharacterType
) {
  const initializeGame = useGameStore((state) => state.initializeGame);
  const setLocalPlayer = useGameStore((state) => state.setLocalPlayer);

  useEffect(() => {
    initializeGame(mode, player1Char, player2Char);
    setLocalPlayer('player1');
  }, [mode, player1Char, player2Char, initializeGame, setLocalPlayer]);
}
