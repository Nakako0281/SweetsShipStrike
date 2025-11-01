// ========================================
// ボード設定
// ========================================

/** ボードのサイズ（10×10マス） */
export const BOARD_SIZE = 10;

/** 総マス数（全乗り物のサイズ合計） */
export const TOTAL_MASSES = 14; // 3 + 5 + 2 + 4

// ========================================
// タイマー設定
// ========================================

/** 配置フェーズのタイマー（秒） */
export const SETUP_TIMER_SECONDS = 60;

/** ターンタイマー（将来実装用、秒） */
export const TURN_TIMER_SECONDS = 30;

// ========================================
// ゲーム設定
// ========================================

/** 速攻ボーナスの基準ターン数 */
export const FAST_WIN_TURN_THRESHOLD = 10;

/** 逆転勝利の基準HP */
export const COMEBACK_WIN_HP_THRESHOLD = 30;

// ========================================
// コイン報酬設定
// ========================================

/** 基本報酬 */
export const BASE_COIN_REWARD = 100;

/** オンライン対戦ボーナス */
export const ONLINE_BONUS = 50;

/** 速攻ボーナス */
export const FAST_WIN_BONUS = 50;

/** 完全勝利ボーナス */
export const PERFECT_WIN_BONUS = 100;

/** 逆転勝利ボーナス */
export const COMEBACK_WIN_BONUS = 80;

/** 全スキル使用ボーナス */
export const ALL_SKILLS_BONUS = 30;

// ========================================
// アセットパス
// ========================================

/** 画像アセットのベースパス */
export const ASSETS_PATH = {
  CHARACTERS: '/assets/images/characters',
  CHARACTERS_TOPVIEW: '/assets/images/characters_topview',
  SHIPS: '/assets/images/ships',
  EFFECTS: '/assets/images/effects',
  UI: '/assets/images/ui',
  BACKGROUNDS: '/assets/images/backgrounds',
} as const;

/** サウンドアセットのベースパス */
export const SOUNDS_PATH = {
  BGM: '/assets/sounds/bgm',
  SE: '/assets/sounds/se',
  VOICE: '/assets/sounds/voice',
} as const;

// ========================================
// LocalStorage キー
// ========================================

/** プレイヤー統計データのキー */
export const STORAGE_KEY_PLAYER_STATS = 'sweets_ship_strike_player_stats';

/** サウンド設定のキー */
export const STORAGE_KEY_SOUND_SETTINGS = 'sweets_ship_strike_sound_settings';
