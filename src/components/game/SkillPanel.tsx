import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import type { SkillUseData } from '@/types/game';

interface SkillPanelProps {
  availableSkills: SkillUseData[];
  onSkillClick?: (skill: SkillUseData) => void;
  disabled?: boolean;
}

/**
 * スキルパネルコンポーネント
 * 使用可能なスキルを表示し、選択可能にする
 *
 * Props:
 * - availableSkills: 使用可能なスキルの配列
 * - onSkillClick: スキルクリック時のコールバック
 * - disabled: クリック無効化
 */
export default function SkillPanel({ availableSkills, onSkillClick, disabled = false }: SkillPanelProps) {
  const getSkillIcon = (skillId: string): string => {
    switch (skillId) {
      case 'strawberry_shield':
        return '🛡️';
      case 'chocolate_bomb':
        return '💣';
      case 'sweet_escape':
        return '🌀';
      case 'waffle_scan':
        return '🔍';
      default:
        return '✨';
    }
  };

  const getSkillTypeLabel = (type: string): string => {
    switch (type) {
      case 'defense':
        return '防御';
      case 'attack':
        return '攻撃';
      case 'utility':
        return '補助';
      default:
        return '';
    }
  };

  const getSkillTypeColor = (type: string): string => {
    switch (type) {
      case 'defense':
        return 'bg-blue-100 text-blue-700';
      case 'attack':
        return 'bg-red-100 text-red-700';
      case 'utility':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-purple-800 mb-4">スキル</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableSkills.map((skill) => (
          <motion.button
            key={skill.id}
            className={`
              relative p-3 rounded-lg border-2 text-left transition-all
              ${
                skill.isUsed
                  ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                  : disabled
                  ? 'border-purple-200 bg-white cursor-not-allowed'
                  : 'border-purple-300 bg-white hover:border-purple-400 hover:shadow-md cursor-pointer'
              }
            `}
            onClick={() => !skill.isUsed && !disabled && onSkillClick && onSkillClick(skill)}
            disabled={skill.isUsed || disabled}
            whileHover={!skill.isUsed && !disabled ? { scale: 1.03 } : {}}
            whileTap={!skill.isUsed && !disabled ? { scale: 0.97 } : {}}
          >
            {/* スキルアイコンと名前 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getSkillIcon(skill.id)}</span>
              <h3 className="text-sm font-bold text-purple-800 flex-1">{skill.name}</h3>
            </div>

            {/* スキルタイプバッジ */}
            <div className="mb-2">
              <span className={`text-xs px-2 py-1 rounded ${getSkillTypeColor(skill.type)}`}>
                {getSkillTypeLabel(skill.type)}
              </span>
            </div>

            {/* スキルの説明（簡易版） */}
            <p className="text-xs text-purple-600 mb-2">
              {skill.id === 'strawberry_shield' && '次の攻撃を無効化'}
              {skill.id === 'chocolate_bomb' && '3×3エリアを攻撃'}
              {skill.id === 'sweet_escape' && '船を移動させる'}
              {skill.id === 'waffle_scan' && '格子状にスキャン'}
            </p>

            {/* 使用済みマーク */}
            {skill.isUsed && (
              <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
                使用済み
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* スキル使用状況 */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex justify-between text-sm">
          <span className="text-purple-700">使用可能:</span>
          <span className="font-bold text-green-600">
            {availableSkills.filter((s) => !s.isUsed).length} / {availableSkills.length}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-purple-700">使用済み:</span>
          <span className="font-bold text-gray-600">
            {availableSkills.filter((s) => s.isUsed).length} / {availableSkills.length}
          </span>
        </div>
      </div>
    </div>
  );
}
