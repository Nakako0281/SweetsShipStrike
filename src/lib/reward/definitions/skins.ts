import type { CharacterSkin } from '@/types/ui';

/**
 * キャラクタースキン定義
 */

export const SKIN_DEFINITIONS: Record<string, CharacterSkin> = {
  // デフォルトスキン（無料）
  'default': {
    id: 'default',
    name: 'デフォルト',
    description: '通常のキャラクター',
    price: 0,
    imageUrl: '/images/characters/default.png',
    isPurchased: true,
  },

  // サマーバージョン（MVP版で実装）
  'summer': {
    id: 'summer',
    name: 'サマーバージョン',
    description: '夏らしい装いのキャラクター',
    price: 500,
    imageUrl: '/images/characters/summer.png',
    isPurchased: false,
  },

  // 将来拡張用のスキン定義例
  'halloween': {
    id: 'halloween',
    name: 'ハロウィンバージョン',
    description: 'ハロウィン仕様のキャラクター',
    price: 600,
    imageUrl: '/images/characters/halloween.png',
    isPurchased: false,
  },

  'christmas': {
    id: 'christmas',
    name: 'クリスマスバージョン',
    description: 'クリスマス仕様のキャラクター',
    price: 700,
    imageUrl: '/images/characters/christmas.png',
    isPurchased: false,
  },

  'valentine': {
    id: 'valentine',
    name: 'バレンタインバージョン',
    description: 'バレンタイン仕様のキャラクター',
    price: 650,
    imageUrl: '/images/characters/valentine.png',
    isPurchased: false,
  },

  'new-year': {
    id: 'new-year',
    name: '正月バージョン',
    description: '正月仕様のキャラクター',
    price: 800,
    imageUrl: '/images/characters/new-year.png',
    isPurchased: false,
  },
};

/**
 * スキンID一覧
 */
export const SKIN_IDS = Object.keys(SKIN_DEFINITIONS);

/**
 * デフォルトスキンID
 */
export const DEFAULT_SKIN_ID = 'default';

/**
 * MVP版で販売するスキンID一覧
 */
export const MVP_SHOP_SKINS = ['summer'];
