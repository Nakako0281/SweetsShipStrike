import type { CharacterSkin } from '@/types/ui';
import { SKIN_DEFINITIONS, SKIN_IDS, DEFAULT_SKIN_ID, MVP_SHOP_SKINS } from './definitions/skins';
import { getCoins, spendCoins } from './coinCalculator';

/**
 * ショップ管理
 */

const STORAGE_KEY_PURCHASED = 'purchasedSkins';
const STORAGE_KEY_EQUIPPED = 'equippedSkin';

/**
 * 購入済みスキンID一覧取得
 */
export function getPurchasedSkins(): string[] {
  if (typeof window === 'undefined') return [DEFAULT_SKIN_ID];

  const stored = localStorage.getItem(STORAGE_KEY_PURCHASED);
  if (!stored) return [DEFAULT_SKIN_ID];

  try {
    const skins = JSON.parse(stored) as string[];
    // デフォルトスキンは必ず含める
    if (!skins.includes(DEFAULT_SKIN_ID)) {
      skins.push(DEFAULT_SKIN_ID);
    }
    return skins;
  } catch {
    return [DEFAULT_SKIN_ID];
  }
}

/**
 * 購入済みスキンID一覧保存
 */
export function savePurchasedSkins(skinIds: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PURCHASED, JSON.stringify(skinIds));
}

/**
 * スキン購入
 */
export function purchaseSkin(skinId: string): { success: boolean; message: string } {
  const skin = SKIN_DEFINITIONS[skinId];
  if (!skin) {
    return { success: false, message: 'スキンが見つかりません' };
  }

  // すでに購入済みかチェック
  const purchased = getPurchasedSkins();
  if (purchased.includes(skinId)) {
    return { success: false, message: 'すでに購入済みです' };
  }

  // コイン残高チェック
  const currentCoins = getCoins();
  if (currentCoins < skin.price) {
    return {
      success: false,
      message: `コインが不足しています（必要: ${skin.price}, 所持: ${currentCoins}）`,
    };
  }

  // コイン消費
  const spent = spendCoins(skin.price);
  if (!spent) {
    return { success: false, message: 'コインの消費に失敗しました' };
  }

  // 購入済みリストに追加
  purchased.push(skinId);
  savePurchasedSkins(purchased);

  return { success: true, message: `${skin.name}を購入しました！` };
}

/**
 * 装備中のスキンID取得
 */
export function getEquippedSkinId(): string {
  if (typeof window === 'undefined') return DEFAULT_SKIN_ID;

  const equipped = localStorage.getItem(STORAGE_KEY_EQUIPPED);
  if (!equipped) return DEFAULT_SKIN_ID;

  // 購入済みでなければデフォルトに戻す
  const purchased = getPurchasedSkins();
  if (!purchased.includes(equipped)) {
    return DEFAULT_SKIN_ID;
  }

  return equipped;
}

/**
 * スキン装備
 */
export function equipSkin(skinId: string): boolean {
  const purchased = getPurchasedSkins();

  // 購入済みでない場合は装備不可
  if (!purchased.includes(skinId)) {
    return false;
  }

  if (typeof window === 'undefined') return false;
  localStorage.setItem(STORAGE_KEY_EQUIPPED, skinId);
  return true;
}

/**
 * 装備中のスキン取得
 */
export function getEquippedSkin(): CharacterSkin {
  const skinId = getEquippedSkinId();
  const skin = SKIN_DEFINITIONS[skinId];

  if (!skin) {
    return { ...SKIN_DEFINITIONS[DEFAULT_SKIN_ID], isPurchased: true };
  }

  return {
    ...skin,
    isPurchased: true,
  };
}

/**
 * ショップアイテム一覧取得
 */
export function getShopItems(): CharacterSkin[] {
  const purchased = getPurchasedSkins();

  // MVP版はサマースキンのみ表示
  return MVP_SHOP_SKINS.map((id) => {
    const skin = SKIN_DEFINITIONS[id];
    return {
      ...skin,
      isPurchased: purchased.includes(id),
    };
  });
}

/**
 * 全スキン一覧取得（購入状態付き）
 */
export function getAllSkins(): CharacterSkin[] {
  const purchased = getPurchasedSkins();

  return SKIN_IDS.map((id) => {
    const skin = SKIN_DEFINITIONS[id];
    return {
      ...skin,
      isPurchased: purchased.includes(id),
    };
  });
}
