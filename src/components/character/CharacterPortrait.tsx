'use client';

import { motion } from 'framer-motion';
import type { CharacterType } from '@/types/game';
import { CHARACTER_DEFINITIONS } from '@/lib/game/characters';

interface CharacterPortraitProps {
  character: CharacterType;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

/**
 * キャラクター立ち絵表示コンポーネント
 */
export default function CharacterPortrait({
  character,
  position = 'left',
  size = 'md',
  showName = true,
}: CharacterPortraitProps) {
  const characterData = CHARACTER_DEFINITIONS[character];

  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-32 h-48',
    lg: 'w-48 h-64',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  // キャラクターアイコン（実際の画像がある場合は画像を使用）
  const getCharacterIcon = (charType: CharacterType): string => {
    const icons: Record<CharacterType, string> = {
      'shortcake': '🍰',
      'chocolate': '🍫',
      'macaron': '🧁',
      'pudding': '🍮',
      'cookie': '🍪',
      'cheesecake': '🧀',
      'donut': '🍩',
    };
    return icons[charType] || '🍰';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col items-center ${
        position === 'right' ? 'flex-row-reverse' : ''
      }`}
    >
      {/* キャラクター画像エリア */}
      <div
        className={`${sizeClasses[size]} relative bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden shadow-lg`}
      >
        {/* キャラクターアイコン（画像の代わり） */}
        <div className="text-6xl">{getCharacterIcon(character)}</div>

        {/* 装飾エフェクト */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      </div>

      {/* キャラクター名 */}
      {showName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-2 text-center ${textSizeClasses[size]}`}
        >
          <div className="font-bold text-purple-800">{characterData.name}</div>
          <div className="text-xs text-purple-600">{characterData.description}</div>
        </motion.div>
      )}
    </motion.div>
  );
}
