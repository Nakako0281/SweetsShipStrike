import type { Title } from '@/types/ui';

/**
 * 称号定義
 */

export const TITLE_DEFINITIONS: Record<string, Title> = {
  // 初期称号
  'first-victory': {
    id: 'first-victory',
    name: '初勝利',
    description: '初めての勝利を達成',
    icon: '🎉',
    unlockCondition: '1回勝利する',
    isUnlocked: false,
  },

  // 勝利数関連
  'winner-10': {
    id: 'winner-10',
    name: 'ビギナー提督',
    description: '10回勝利を達成',
    icon: '⭐',
    unlockCondition: '10回勝利する',
    isUnlocked: false,
  },

  'winner-50': {
    id: 'winner-50',
    name: 'ベテラン提督',
    description: '50回勝利を達成',
    icon: '🌟',
    unlockCondition: '50回勝利する',
    isUnlocked: false,
  },

  'winner-100': {
    id: 'winner-100',
    name: 'マスター提督',
    description: '100回勝利を達成',
    icon: '💫',
    unlockCondition: '100回勝利する',
    isUnlocked: false,
  },

  // 特殊勝利関連
  'perfect-win': {
    id: 'perfect-win',
    name: '完璧主義者',
    description: '無傷で勝利を達成',
    icon: '✨',
    unlockCondition: '無傷で勝利する',
    isUnlocked: false,
  },

  'speed-demon': {
    id: 'speed-demon',
    name: 'スピードマスター',
    description: '5ターン以内で勝利',
    icon: '⚡',
    unlockCondition: '5ターン以内で勝利する',
    isUnlocked: false,
  },

  'comeback-king': {
    id: 'comeback-king',
    name: '逆転王',
    description: 'HP30%以下から逆転勝利',
    icon: '👑',
    unlockCondition: 'HP30%以下から逆転勝利する',
    isUnlocked: false,
  },

  // オンライン対戦関連
  'online-veteran': {
    id: 'online-veteran',
    name: 'オンライン戦士',
    description: 'オンライン対戦で10回勝利',
    icon: '🌐',
    unlockCondition: 'オンライン対戦で10回勝利する',
    isUnlocked: false,
  },

  // スキル関連
  'skill-master': {
    id: 'skill-master',
    name: 'スキルマスター',
    description: '全スキルを使用して勝利',
    icon: '🎯',
    unlockCondition: '全スキルを使用して勝利する',
    isUnlocked: false,
  },
};

/**
 * 称号ID一覧
 */
export const TITLE_IDS = Object.keys(TITLE_DEFINITIONS);

/**
 * デフォルト称号（初期表示用）
 */
export const DEFAULT_TITLE_ID = 'first-victory';
