import type { ShipDefinition, ShipType } from '@/types/game';

/**
 * 4種類の乗り物定義
 *
 * 固定編成（全プレイヤー共通）:
 * - イチゴボート（3マス）: ストロベリーシールド
 * - ココア潜水艇（5マス）: チョコレートボム
 * - マカロン円盤（2マス）: スイートエスケープ
 * - ワッフル艦（4マス）: 格子スキャン
 *
 * 合計マス数: 14マス
 */

export const SHIP_DEFINITIONS: Record<ShipType, ShipDefinition> = {
  strawberry_boat: {
    id: 'strawberry_boat',
    name: 'イチゴボート',
    size: 3,
    description: 'ストロベリーシールドで次の攻撃を1回無効化',
    image: '/assets/images/ships/strawberry_boat.png',
    skill: {
      id: 'strawberry_shield',
      name: 'ストロベリーシールド',
      description: '次に受ける攻撃を1回無効化',
      type: 'defense',
      icon: '/assets/images/skills/strawberry_shield.png',
    },
  },
  cocoa_submarine: {
    id: 'cocoa_submarine',
    name: 'ココア潜水艇',
    size: 5,
    description: 'チョコレートボムで3×3エリアを攻撃',
    image: '/assets/images/ships/cocoa_submarine.png',
    skill: {
      id: 'chocolate_bomb',
      name: 'チョコレートボム',
      description: '3×3エリア（9マス）を一気に攻撃',
      type: 'attack',
      icon: '/assets/images/skills/chocolate_bomb.png',
    },
  },
  macaron_ufo: {
    id: 'macaron_ufo',
    name: 'マカロン円盤',
    size: 2,
    description: 'スイートエスケープで乗り物を移動',
    image: '/assets/images/ships/macaron_ufo.png',
    skill: {
      id: 'sweet_escape',
      name: 'スイートエスケープ',
      description: '自分の乗り物を1隻だけ別の場所に移動',
      type: 'utility',
      icon: '/assets/images/skills/sweet_escape.png',
    },
  },
  waffle_ship: {
    id: 'waffle_ship',
    name: 'ワッフル艦',
    size: 4,
    description: '格子スキャンで縦1列or横1列をスキャン',
    image: '/assets/images/ships/waffle_ship.png',
    skill: {
      id: 'waffle_scan',
      name: '格子スキャン',
      description: '縦1列または横1列（10マス）を一気にスキャン',
      type: 'scan',
      icon: '/assets/images/skills/waffle_scan.png',
    },
  },
};

/**
 * 乗り物の配列（順序固定）
 */
export const SHIPS: ShipDefinition[] = [
  SHIP_DEFINITIONS.strawberry_boat,
  SHIP_DEFINITIONS.cocoa_submarine,
  SHIP_DEFINITIONS.macaron_ufo,
  SHIP_DEFINITIONS.waffle_ship,
];

/**
 * 乗り物タイプから定義を取得
 */
export function getShipDefinition(type: ShipType): ShipDefinition {
  return SHIP_DEFINITIONS[type];
}

/**
 * すべての乗り物定義を取得
 */
export function getAllShipDefinitions(): ShipDefinition[] {
  return SHIPS;
}
