import type { SkillDefinition } from '@/types/game';

/**
 * 4種類のスキル定義
 *
 * 各乗り物は1試合に1回のみ使用可能なスキルを持つ:
 * 1. ストロベリーシールド（イチゴボート）: 防御
 * 2. チョコレートボム（ココア潜水艇）: 攻撃
 * 3. スイートエスケープ（マカロン円盤）: ユーティリティ
 * 4. 格子スキャン（ワッフル艦）: スキャン
 */

export const SKILL_DEFINITIONS: Record<string, SkillDefinition> = {
  strawberry_shield: {
    id: 'strawberry_shield',
    name: 'ストロベリーシールド',
    description: '次に自分が受ける攻撃を1回だけ無効化する防御スキル',
    type: 'defense',
    icon: '/assets/images/skills/strawberry_shield.png',
  },
  chocolate_bomb: {
    id: 'chocolate_bomb',
    name: 'チョコレートボム',
    description: '指定した3×3エリア（9マス）を一気に攻撃する強力なスキル',
    type: 'attack',
    icon: '/assets/images/skills/chocolate_bomb.png',
  },
  sweet_escape: {
    id: 'sweet_escape',
    name: 'スイートエスケープ',
    description: '自分の乗り物を1隻だけ別の場所に移動させるスキル',
    type: 'utility',
    icon: '/assets/images/skills/sweet_escape.png',
  },
  waffle_scan: {
    id: 'waffle_scan',
    name: '格子スキャン',
    description: '縦1列または横1列（10マス）を一気にスキャンして敵の位置を確認',
    type: 'scan',
    icon: '/assets/images/skills/waffle_scan.png',
  },
};

/**
 * スキルIDから定義を取得
 */
export function getSkillDefinition(skillId: string): SkillDefinition | undefined {
  return SKILL_DEFINITIONS[skillId];
}

/**
 * すべてのスキル定義を取得
 */
export function getAllSkillDefinitions(): SkillDefinition[] {
  return Object.values(SKILL_DEFINITIONS);
}

/**
 * タイプ別にスキルを取得
 */
export function getSkillsByType(
  type: 'attack' | 'defense' | 'utility' | 'scan'
): SkillDefinition[] {
  return Object.values(SKILL_DEFINITIONS).filter((skill) => skill.type === type);
}
