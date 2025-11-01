import type { Position, ShipType, CharacterType } from './game';

// ========================================
// UI状態
// ========================================

/** UI状態 */
export interface UIState {
  isLoading: boolean;
  currentModal: ModalType | null;
  notification: Notification | null;
  selectedCell: Position | null;
  selectedShipForPlacement: ShipType | null;
  hoveredCell: Position | null;
}

export type ModalType = 'pause' | 'settings' | 'skillConfirm' | 'rematch';

export interface Notification {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  duration: number; // ms
}

// ========================================
// サウンド
// ========================================

/** サウンド設定 */
export interface SoundSettings {
  bgmVolume: number; // 0-1
  seVolume: number; // 0-1
  bgmEnabled: boolean;
  seEnabled: boolean;
}

// ========================================
// 報酬システム
// ========================================

/** 称号 */
export interface Title {
  id: string;
  name: string;
  description: string;
  condition: string; // 条件の説明
  icon?: string; // アイコン画像パス
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
}

/** キャラクタースキン */
export interface CharacterSkin {
  id: string;
  characterType: CharacterType;
  name: string;
  description: string;
  price: number; // スイーツコイン
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageFullBody: string; // 全身画像パス
  imageTopView: string; // 真上画像パス
  isOwned: boolean;
}

/** 乗り物スキン（将来実装用） */
export interface ShipSkin {
  id: string;
  shipType: string;
  name: string;
  description: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  isOwned: boolean;
}

/** ボードテーマ（将来実装用） */
export interface BoardTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  bgImage: string; // 背景画像
  cellColor: string; // マスの色
  hitEffectColor: string; // ヒットエフェクトの色
  missEffectColor: string; // ミスエフェクトの色
  isOwned: boolean;
}

/** プレイヤー統計 */
export interface PlayerStats {
  // 基本統計
  totalGames: number; // 総対戦数
  totalWins: number; // 総勝利数
  totalLosses: number; // 総敗北数
  winRate: number; // 勝率
  currentWinStreak: number; // 現在の連勝数
  maxWinStreak: number; // 最高連勝数

  // モード別統計
  onlineWins: number;
  onlineLosses: number;
  cpuWins: number;
  cpuLosses: number;

  // 詳細統計（将来実装用）
  totalAttacks: number; // 総攻撃回数
  totalHits: number; // 総ヒット数
  hitRate: number; // 命中率
  totalShipsSunk: number; // 総撃沈数
  totalSkillsUsed: number; // 総スキル使用回数

  // 特殊記録
  fastestWin: number; // 最速勝利（ターン数）
  perfectWins: number; // 完全勝利回数（被弾0）
  comebackWins: number; // 逆転勝利回数（HP30%以下から）

  // キャラクター別統計（将来実装用）
  characterStats: {
    [key in CharacterType]: {
      gamesPlayed: number;
      wins: number;
      losses: number;
    };
  };

  // 経済
  totalCoinsEarned: number; // 累計獲得コイン
  totalCoinsSpent: number; // 累計使用コイン
  currentCoins: number; // 現在の所持コイン

  // 所持品
  ownedSkins: string[]; // 所持スキンID配列
  ownedThemes: string[]; // 所持テーマID配列（将来実装用）
  ownedEffects: string[]; // 所持エフェクトID配列（将来実装用）
  unlockedTitles: string[]; // 解放済み称号ID配列

  // 装備中
  selectedTitle: string | null; // 装備中の称号ID
  selectedSkin: {
    // 装備中のスキンID（キャラごと）
    [key in CharacterType]?: string;
  };
  selectedTheme: string; // 装備中のテーマID（将来実装用）
  selectedEffect: string; // 装備中のエフェクトID（将来実装用）
}

/** コイン獲得報酬 */
export interface CoinReward {
  baseReward: number; // 基本報酬
  bonuses: {
    type: string; // ボーナス種類
    amount: number; // ボーナス額
    description: string; // 説明
  }[];
  total: number; // 合計
}
