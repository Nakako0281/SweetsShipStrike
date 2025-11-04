import { useState, useCallback } from 'react';
import type { Position } from '@/types/game';

export type EffectType = 'hit' | 'miss' | 'sink';

export interface ActiveEffect {
  id: string;
  type: EffectType;
  position: Position;
}

/**
 * ゲームエフェクト管理フック
 * 攻撃エフェクトの表示・管理を行う
 */
export function useGameEffects() {
  const [effects, setEffects] = useState<ActiveEffect[]>([]);

  const addEffect = useCallback((type: EffectType, position: Position) => {
    const id = `${type}-${position.x}-${position.y}-${Date.now()}`;
    const newEffect: ActiveEffect = { id, type, position };

    setEffects((prev) => [...prev, newEffect]);

    // エフェクト終了後に削除
    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== id));
    }, 1500); // エフェクト表示時間
  }, []);

  const clearEffects = useCallback(() => {
    setEffects([]);
  }, []);

  return {
    effects,
    addEffect,
    clearEffects,
  };
}
