import { Howl, Howler } from 'howler';

/**
 * サウンド管理システム
 * Howler.jsを使用したBGM・SE管理
 */

type SoundType = 'bgm' | 'se';

interface Sound {
  id: string;
  type: SoundType;
  howl: Howl;
}

export class SoundManager {
  private sounds: Map<string, Sound> = new Map();
  private currentBGM: string | null = null;
  private bgmVolume: number = 0.5;
  private seVolume: number = 0.7;
  private isMuted: boolean = false;

  /**
   * サウンドファイルをロード
   */
  loadSound(id: string, src: string, type: SoundType, options?: {
    loop?: boolean;
    volume?: number;
  }): void {
    const howl = new Howl({
      src: [src],
      loop: options?.loop || false,
      volume: options?.volume || (type === 'bgm' ? this.bgmVolume : this.seVolume),
    });

    this.sounds.set(id, { id, type, howl });
  }

  /**
   * BGMを再生
   */
  playBGM(id: string, fadeIn: boolean = true): void {
    // 現在のBGMを停止
    if (this.currentBGM && this.currentBGM !== id) {
      this.stopBGM(true);
    }

    const sound = this.sounds.get(id);
    if (!sound || sound.type !== 'bgm') {
      console.warn(`BGM not found: ${id}`);
      return;
    }

    if (fadeIn) {
      sound.howl.fade(0, this.bgmVolume, 1000);
    }

    sound.howl.play();
    this.currentBGM = id;
  }

  /**
   * BGMを停止
   */
  stopBGM(fadeOut: boolean = true): void {
    if (!this.currentBGM) return;

    const sound = this.sounds.get(this.currentBGM);
    if (!sound) return;

    if (fadeOut) {
      sound.howl.fade(this.bgmVolume, 0, 1000);
      setTimeout(() => {
        sound.howl.stop();
      }, 1000);
    } else {
      sound.howl.stop();
    }

    this.currentBGM = null;
  }

  /**
   * SEを再生
   */
  playSE(id: string): void {
    const sound = this.sounds.get(id);
    if (!sound || sound.type !== 'se') {
      console.warn(`SE not found: ${id}`);
      return;
    }

    sound.howl.play();
  }

  /**
   * BGM音量設定
   */
  setBGMVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume));

    // 全BGMの音量を更新
    this.sounds.forEach((sound) => {
      if (sound.type === 'bgm') {
        sound.howl.volume(this.bgmVolume);
      }
    });
  }

  /**
   * SE音量設定
   */
  setSEVolume(volume: number): void {
    this.seVolume = Math.max(0, Math.min(1, volume));

    // 全SEの音量を更新
    this.sounds.forEach((sound) => {
      if (sound.type === 'se') {
        sound.howl.volume(this.seVolume);
      }
    });
  }

  /**
   * マスター音量設定
   */
  setMasterVolume(volume: number): void {
    Howler.volume(Math.max(0, Math.min(1, volume)));
  }

  /**
   * ミュート切り替え
   */
  toggleMute(): void {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
  }

  /**
   * ミュート設定
   */
  setMute(mute: boolean): void {
    this.isMuted = mute;
    Howler.mute(mute);
  }

  /**
   * すべてのサウンドを停止
   */
  stopAll(): void {
    this.sounds.forEach((sound) => {
      sound.howl.stop();
    });
    this.currentBGM = null;
  }

  /**
   * サウンドをアンロード
   */
  unload(id: string): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.howl.unload();
      this.sounds.delete(id);

      if (this.currentBGM === id) {
        this.currentBGM = null;
      }
    }
  }

  /**
   * すべてのサウンドをアンロード
   */
  unloadAll(): void {
    this.sounds.forEach((sound) => {
      sound.howl.unload();
    });
    this.sounds.clear();
    this.currentBGM = null;
  }

  /**
   * 現在のBGM取得
   */
  getCurrentBGM(): string | null {
    return this.currentBGM;
  }

  /**
   * ミュート状態取得
   */
  isMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * BGM音量取得
   */
  getBGMVolume(): number {
    return this.bgmVolume;
  }

  /**
   * SE音量取得
   */
  getSEVolume(): number {
    return this.seVolume;
  }
}

// シングルトンインスタンス
let soundManagerInstance: SoundManager | null = null;

/**
 * SoundManagerのシングルトンインスタンス取得
 */
export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

/**
 * SoundManagerのリセット（テスト用）
 */
export function resetSoundManager(): void {
  if (soundManagerInstance) {
    soundManagerInstance.unloadAll();
    soundManagerInstance = null;
  }
}

/**
 * サウンドIDの定義（定数）
 */
export const SOUND_IDS = {
  // BGM
  BGM_TITLE: 'bgm_title',
  BGM_BATTLE: 'bgm_battle',

  // SE
  SE_CLICK: 'se_click',
  SE_HIT: 'se_hit',
  SE_MISS: 'se_miss',
  SE_SINK: 'se_sink',
  SE_SKILL: 'se_skill',
  SE_WIN: 'se_win',
  SE_LOSE: 'se_lose',
} as const;

/**
 * サウンドの初期化（アプリ起動時に呼び出す）
 */
export function initializeSounds(): void {
  const manager = getSoundManager();

  // BGM（仮のパス、実際の音源ファイルは後で配置）
  manager.loadSound(SOUND_IDS.BGM_TITLE, '/sounds/bgm/title.mp3', 'bgm', { loop: true });
  manager.loadSound(SOUND_IDS.BGM_BATTLE, '/sounds/bgm/battle.mp3', 'bgm', { loop: true });

  // SE（仮のパス、実際の音源ファイルは後で配置）
  manager.loadSound(SOUND_IDS.SE_CLICK, '/sounds/se/click.mp3', 'se');
  manager.loadSound(SOUND_IDS.SE_HIT, '/sounds/se/hit.mp3', 'se');
  manager.loadSound(SOUND_IDS.SE_MISS, '/sounds/se/miss.mp3', 'se');
  manager.loadSound(SOUND_IDS.SE_SINK, '/sounds/se/sink.mp3', 'se');
  manager.loadSound(SOUND_IDS.SE_SKILL, '/sounds/se/skill.mp3', 'se');
  manager.loadSound(SOUND_IDS.SE_WIN, '/sounds/se/win.mp3', 'se');
  manager.loadSound(SOUND_IDS.SE_LOSE, '/sounds/se/lose.mp3', 'se');
}
