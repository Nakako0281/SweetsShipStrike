import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  createGame,
  setupPlayerShips,
  processAction,
  getGameStats,
  getOpponentId,
} from '@/lib/game/gameLogic';
import type {
  GameState,
  GameAction,
  CharacterType,
  GameMode,
  PlayerId,
  Ship,
  Position,
} from '@/types/game';

/**
 * ゲーム状態管理用Zustandストア
 * ゲームの状態と操作を一元管理
 */

interface GameStore {
  // 状態
  gameState: GameState | null;
  localPlayerId: PlayerId | null;
  isLoading: boolean;
  error: string | null;

  // アクション
  initializeGame: (mode: GameMode, player1Char: CharacterType, player2Char: CharacterType) => void;
  setLocalPlayer: (playerId: PlayerId) => void;
  placeShips: (playerId: PlayerId, ships: Ship[]) => void;
  attack: (position: Position) => void;
  useSkill: (skillId: string, position?: Position) => void;
  surrender: () => void;
  resetGame: () => void;
  setError: (error: string | null) => void;

  // ゲッター
  getLocalPlayer: () => PlayerId | null;
  getOpponentPlayer: () => PlayerId | null;
  isMyTurn: () => boolean;
  getStats: () => ReturnType<typeof getGameStats> | null;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // 初期状態
      gameState: null,
      localPlayerId: null,
      isLoading: false,
      error: null,

      // ゲーム初期化
      initializeGame: (mode, player1Char, player2Char) => {
        try {
          const newGameState = createGame(mode, player1Char, player2Char);
          set({
            gameState: newGameState,
            error: null,
          });
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      // ローカルプレイヤー設定
      setLocalPlayer: (playerId) => {
        set({ localPlayerId: playerId });
      },

      // 船を配置
      placeShips: (playerId, ships) => {
        const { gameState } = get();
        if (!gameState) {
          set({ error: 'Game not initialized' });
          return;
        }

        try {
          const newGameState = setupPlayerShips(gameState, playerId, ships);
          set({
            gameState: newGameState,
            error: null,
          });
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      // 攻撃
      attack: (position) => {
        const { gameState, localPlayerId } = get();
        if (!gameState || !localPlayerId) {
          set({ error: 'Game not initialized or local player not set' });
          return;
        }

        try {
          const action: GameAction = {
            type: 'attack',
            playerId: localPlayerId,
            position,
            timestamp: Date.now(),
          };

          const newGameState = processAction(gameState, action);
          set({
            gameState: newGameState,
            error: null,
          });
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      // スキル使用
      useSkill: (skillId, position) => {
        const { gameState, localPlayerId } = get();
        if (!gameState || !localPlayerId) {
          set({ error: 'Game not initialized or local player not set' });
          return;
        }

        try {
          const action: GameAction = {
            type: 'use_skill',
            playerId: localPlayerId,
            skillId,
            position,
            timestamp: Date.now(),
          };

          const newGameState = processAction(gameState, action);
          set({
            gameState: newGameState,
            error: null,
          });
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      // 降参
      surrender: () => {
        const { gameState, localPlayerId } = get();
        if (!gameState || !localPlayerId) {
          set({ error: 'Game not initialized or local player not set' });
          return;
        }

        try {
          const action: GameAction = {
            type: 'surrender',
            playerId: localPlayerId,
            timestamp: Date.now(),
          };

          const newGameState = processAction(gameState, action);
          set({
            gameState: newGameState,
            error: null,
          });
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      // ゲームリセット
      resetGame: () => {
        set({
          gameState: null,
          localPlayerId: null,
          isLoading: false,
          error: null,
        });
      },

      // エラー設定
      setError: (error) => {
        set({ error });
      },

      // ローカルプレイヤー取得
      getLocalPlayer: () => {
        return get().localPlayerId;
      },

      // 対戦相手取得
      getOpponentPlayer: () => {
        const { localPlayerId } = get();
        if (!localPlayerId) return null;
        return getOpponentId(localPlayerId);
      },

      // 自分のターンかチェック
      isMyTurn: () => {
        const { gameState, localPlayerId } = get();
        if (!gameState || !localPlayerId) return false;
        return gameState.currentTurn === localPlayerId;
      },

      // 統計情報取得
      getStats: () => {
        const { gameState, localPlayerId } = get();
        if (!gameState || !localPlayerId) return null;
        return getGameStats(gameState, localPlayerId);
      },
    }),
    { name: 'GameStore' }
  )
);
