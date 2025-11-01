import { useEffect, useCallback } from 'react';
import { SoundManager } from '@/lib/sound/soundManager';
import { useUIStore } from '@/store/uiStore';

/**
 * サウンド管理カスタムフック
 * サウンドマネージャーの初期化と操作を提供
 */
export function useSound() {
  const soundEnabled = useUIStore((state) => state.soundEnabled);
  const bgmEnabled = useUIStore((state) => state.bgmEnabled);

  const soundManager = SoundManager.getInstance();

  // サウンド設定の同期
  useEffect(() => {
    soundManager.setSEVolume(soundEnabled ? 0.7 : 0);
  }, [soundEnabled, soundManager]);

  useEffect(() => {
    soundManager.setBGMVolume(bgmEnabled ? 0.5 : 0);
  }, [bgmEnabled, soundManager]);

  // SEの再生
  const playSE = useCallback(
    (id: string) => {
      if (soundEnabled) {
        soundManager.playSE(id);
      }
    },
    [soundEnabled, soundManager]
  );

  // BGMの再生
  const playBGM = useCallback(
    (id: string, fadeIn: boolean = true) => {
      if (bgmEnabled) {
        soundManager.playBGM(id, fadeIn);
      }
    },
    [bgmEnabled, soundManager]
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
