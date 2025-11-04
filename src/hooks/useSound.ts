import { useEffect, useCallback, useMemo } from 'react';
import { SoundManager } from '@/lib/sound/soundManager';
import { useUIStore } from '@/store/uiStore';

/**
 * サウンド管理カスタムフック
 * サウンドマネージャーの初期化と操作を提供
 */
export function useSound() {
  const isMuted = useUIStore((state) => state.isMuted);

  const soundManager = useMemo(() => new SoundManager(), []);

  // サウンド設定の同期
  useEffect(() => {
    soundManager.setSEVolume(isMuted ? 0 : 0.7);
    soundManager.setBGMVolume(isMuted ? 0 : 0.5);
  }, [isMuted, soundManager]);

  // SEの再生
  const playSE = useCallback(
    (id: string) => {
      if (!isMuted) {
        soundManager.playSE(id);
      }
    },
    [isMuted, soundManager]
  );

  // BGMの再生
  const playBGM = useCallback(
    (id: string, fadeIn: boolean = true) => {
      if (!isMuted) {
        soundManager.playBGM(id, fadeIn);
      }
    },
    [isMuted, soundManager]
  );

  // BGM停止
  const stopBGM = useCallback(
    (fadeOut: boolean = true) => {
      soundManager.stopBGM(fadeOut);
    },
    [soundManager]
  );

  return {
    playSE,
    playBGM,
    stopBGM,
    soundManager,
  };
}
