import type { Title } from '@/types/ui';
import { TITLE_DEFINITIONS, TITLE_IDS } from './definitions/titles';
import { loadPlayerStats } from './statsManager';

/**
 * 称号管理
 */

const STORAGE_KEY_TITLES = 'unlockedTitles';
const STORAGE_KEY_EQUIPPED = 'equippedTitle';

/**
 * 解放済み称号ID一覧取得
 */
export function getUnlockedTitles(): string[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY_TITLES);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as string[];
  } catch {
    return [];
  }
}

/**
 * 解放済み称号ID一覧保存
 */
export function saveUnlockedTitles(titleIds: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_TITLES, JSON.stringify(titleIds));
}

/**
 * 称号解放
 */
export function unlockTitle(titleId: string): boolean {
  const unlocked = getUnlockedTitles();

  // すでに解放済みの場合
  if (unlocked.includes(titleId)) {
    return false;
  }

  // 新しく解放
  unlocked.push(titleId);
  saveUnlockedTitles(unlocked);
  return true;
}

/**
 * 装備中の称号ID取得
 */
export function getEquippedTitleId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_EQUIPPED);
}

/**
 * 称号装備
 */
export function equipTitle(titleId: string): boolean {
  const unlocked = getUnlockedTitles();

  // 解放済みでない場合は装備不可
  if (!unlocked.includes(titleId)) {
    return false;
  }

  if (typeof window === 'undefined') return false;
  localStorage.setItem(STORAGE_KEY_EQUIPPED, titleId);
  return true;
}

/**
 * 称号装備解除
 */
export function unequipTitle(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_EQUIPPED);
}

/**
 * 装備中の称号取得
 */
export function getEquippedTitle(): Title | null {
  const titleId = getEquippedTitleId();
  if (!titleId) return null;

  const title = TITLE_DEFINITIONS[titleId];
  if (!title) return null;

  return {
    ...title,
    isUnlocked: true,
  };
}

/**
 * 全称号取得（解放状態付き）
 */
export function getAllTitles(): Title[] {
  const unlocked = getUnlockedTitles();

  return TITLE_IDS.map((id) => {
    const title = TITLE_DEFINITIONS[id];
    return {
      ...title,
      isUnlocked: unlocked.includes(id),
    };
  });
}

/**
 * 称号解放チェック（ゲーム終了時に呼ぶ）
 */
export function checkTitleUnlocks(): string[] {
  const stats = loadPlayerStats();
  const newlyUnlocked: string[] = [];

  // 初勝利
  if (stats.wins >= 1) {
    if (unlockTitle('first-victory')) {
      newlyUnlocked.push('first-victory');
    }
  }

  // ビギナー提督
  if (stats.wins >= 10) {
    if (unlockTitle('winner-10')) {
      newlyUnlocked.push('winner-10');
    }
  }

  // ベテラン提督
  if (stats.wins >= 50) {
    if (unlockTitle('winner-50')) {
      newlyUnlocked.push('winner-50');
    }
  }

  // マスター提督
  if (stats.wins >= 100) {
    if (unlockTitle('winner-100')) {
      newlyUnlocked.push('winner-100');
    }
  }

  // 完璧主義者
  if (stats.perfectWins >= 1) {
    if (unlockTitle('perfect-win')) {
      newlyUnlocked.push('perfect-win');
    }
  }

  // スピードマスター（最速勝利が5ターン以内）
  if (stats.fastestWin !== null && stats.fastestWin <= 5) {
    if (unlockTitle('speed-demon')) {
      newlyUnlocked.push('speed-demon');
    }
  }

  // 逆転王
  if (stats.comebackWins >= 1) {
    if (unlockTitle('comeback-king')) {
      newlyUnlocked.push('comeback-king');
    }
  }

  // オンライン戦士（オンライン勝利10回）
  // 注: この判定には追加の統計が必要なため、今後実装
  // if (stats.onlineWins >= 10) { ... }

  return newlyUnlocked;
}
