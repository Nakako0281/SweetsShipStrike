import type { Character, CharacterType } from '@/types/game';

/**
 * 7種類のキャラクター定義
 *
 * プレイヤー選択可能（4人）:
 * - ショートケーキちゃん (strawberry)
 * - チョコレートちゃん (chocolate)
 * - マカロンちゃん (macaron)
 * - プリンちゃん (pudding)
 *
 * CPU専用（3人）:
 * - よわい (cpu_easy)
 * - ふつう (cpu_normal)
 * - つよい (cpu_hard)
 *
 * MVP版では見た目のみの違い（能力差なし）
 */

export const CHARACTER_DEFINITIONS: Record<CharacterType, Character> = {
  strawberry: {
    id: 'strawberry',
    name: 'ショートケーキちゃん',
    description: '元気で明るいムードメーカー。イチゴの甘酸っぱさが特徴。',
    imageFullBody: '/assets/images/characters/strawberry_fullbody.png',
    imageTopView: '/assets/images/characters_topview/strawberry_topview.png',
    isPlayable: true,
  },
  chocolate: {
    id: 'chocolate',
    name: 'チョコレートちゃん',
    description: 'クールでミステリアス。ビターな大人の魅力がある。',
    imageFullBody: '/assets/images/characters/chocolate_fullbody.png',
    imageTopView: '/assets/images/characters_topview/chocolate_topview.png',
    isPlayable: true,
  },
  macaron: {
    id: 'macaron',
    name: 'マカロンちゃん',
    description: 'おしゃれで優雅。カラフルで華やかな雰囲気。',
    imageFullBody: '/assets/images/characters/macaron_fullbody.png',
    imageTopView: '/assets/images/characters_topview/macaron_topview.png',
    isPlayable: true,
  },
  pudding: {
    id: 'pudding',
    name: 'プリンちゃん',
    description: 'おっとりマイペース。なめらかで優しい性格。',
    imageFullBody: '/assets/images/characters/pudding_fullbody.png',
    imageTopView: '/assets/images/characters_topview/pudding_topview.png',
    isPlayable: true,
  },
  cpu_easy: {
    id: 'cpu_easy',
    name: 'クッキーくん',
    description: 'まだまだ修行中の新人さん。',
    imageFullBody: '/assets/images/characters/cpu_easy_fullbody.png',
    imageTopView: '/assets/images/characters_topview/cpu_easy_topview.png',
    isPlayable: false,
    difficulty: 'easy',
  },
  cpu_normal: {
    id: 'cpu_normal',
    name: 'ドーナツさん',
    description: 'ほどよい実力の対戦相手。',
    imageFullBody: '/assets/images/characters/cpu_normal_fullbody.png',
    imageTopView: '/assets/images/characters_topview/cpu_normal_topview.png',
    isPlayable: false,
    difficulty: 'normal',
  },
  cpu_hard: {
    id: 'cpu_hard',
    name: 'ティラミス先生',
    description: '手ごわい強敵。覚悟して挑もう！',
    imageFullBody: '/assets/images/characters/cpu_hard_fullbody.png',
    imageTopView: '/assets/images/characters_topview/cpu_hard_topview.png',
    isPlayable: false,
    difficulty: 'hard',
  },
};

/**
 * プレイヤー選択可能なキャラクター一覧
 */
export const PLAYABLE_CHARACTERS: Character[] = [
  CHARACTER_DEFINITIONS.strawberry,
  CHARACTER_DEFINITIONS.chocolate,
  CHARACTER_DEFINITIONS.macaron,
  CHARACTER_DEFINITIONS.pudding,
];

/**
 * CPU専用キャラクター一覧
 */
export const CPU_CHARACTERS: Character[] = [
  CHARACTER_DEFINITIONS.cpu_easy,
  CHARACTER_DEFINITIONS.cpu_normal,
  CHARACTER_DEFINITIONS.cpu_hard,
];

/**
 * すべてのキャラクター一覧
 */
export const ALL_CHARACTERS: Character[] = [
  ...PLAYABLE_CHARACTERS,
  ...CPU_CHARACTERS,
];

/**
 * キャラクタータイプから定義を取得
 */
export function getCharacterDefinition(type: CharacterType): Character {
  return CHARACTER_DEFINITIONS[type];
}

/**
 * プレイヤー選択可能なキャラクターを取得
 */
export function getPlayableCharacters(): Character[] {
  return PLAYABLE_CHARACTERS;
}

/**
 * CPU専用キャラクターを取得
 */
export function getCPUCharacters(): Character[] {
  return CPU_CHARACTERS;
}

/**
 * すべてのキャラクターを取得
 */
export function getAllCharacters(): Character[] {
  return ALL_CHARACTERS;
}
