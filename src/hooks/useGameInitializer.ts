import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import type { CharacterType, GameMode } from '@/types/game';

/**
 * ゲーム初期化フック
 * URLパラメータからゲーム設定を読み取り、ゲームを初期化
 */
export function useGameInitializer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameState = useGameStore((state) => state.gameState);
  const initializeGame = useGameStore((state) => state.initializeGame);
  const resetGame = useGameStore((state) => state.resetGame);

  // URLパラメータ
  const mode = searchParams.get('mode') as GameMode | null;
  const character = searchParams.get('character') as CharacterType | null;
  const difficulty = searchParams.get('difficulty') as 'easy' | 'normal' | 'hard' | null;

  // パラメータ検証
  useEffect(() => {
    if (!mode || !character) {
      router.push('/mode-select');
      return;
    }

    // ゲームが既に初期化されていない場合のみ初期化
    if (!gameState) {
      // 船配置画面へリダイレクト
      if (mode === 'cpu') {
        if (!difficulty) {
          router.push(`/cpu-difficulty`);
        } else {
          router.push(`/ship-placement?mode=${mode}&character=${character}&difficulty=${difficulty}`);
        }
      } else {
        router.push(`/ship-placement?mode=${mode}&character=${character}`);
      }
    }
  }, [mode, character, difficulty, gameState, router]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      // ゲーム終了時のクリーンアップは必要に応じて
    };
  }, []);

  return {
    mode,
    character,
    difficulty,
    gameState,
    isInitialized: !!gameState,
    resetGame,
  };
}
