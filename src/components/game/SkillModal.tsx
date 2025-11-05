import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Board from '@/components/game/Board';
import AreaPreview from '@/components/game/AreaPreview';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import type { Ship, Position, InternalBoard } from '@/types/game';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkill: Ship | null;
  opponentBoard: InternalBoard;
  onExecuteSkill: (position: Position) => void;
}

/**
 * スキル実行モーダル
 * スキルの対象位置を選択するためのモーダル
 */
export default function SkillModal({
  isOpen,
  onClose,
  selectedSkill,
  opponentBoard,
  onExecuteSkill,
}: SkillModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  if (!isOpen || !selectedSkill) return null;

  const handleCellClick = (position: Position) => {
    setSelectedPosition(position);
  };

  const handleExecute = () => {
    if (selectedPosition) {
      onExecuteSkill(selectedPosition);
      setSelectedPosition(null);
      onClose();
    }
  };

  const skillInfo = {
    'strawberry-shield': {
      name: 'ストロベリーシールド',
      description: '選択した船を1ターン防御します',
      icon: '🍓',
    },
    'chocolate-bomb': {
      name: 'チョコレートボム',
      description: '3×3エリアを攻撃します',
      icon: '🍫',
    },
    'sweet-escape': {
      name: 'スイートエスケープ',
      description: '船を別の位置に移動します',
      icon: '🍬',
    },
    'waffle-scan': {
      name: 'ワッフルスキャン',
      description: '3×3エリアをスキャンします',
      icon: '🧇',
    },
  };

  // 船の定義からスキル情報を取得
  const shipDef = SHIP_DEFINITIONS[selectedSkill.type];
  const skillId = shipDef.skill.id;
  const skill = skillInfo[skillId as keyof typeof skillInfo] || {
    name: shipDef.skill.name,
    description: shipDef.skill.description,
    icon: '✨',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* ヘッダー */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">{skill.icon}</div>
                <h2 className="text-3xl font-bold text-purple-800 mb-2">{skill.name}</h2>
                <p className="text-purple-600">{skill.description}</p>
              </div>

              {/* ボード */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-purple-800 mb-3 text-center">
                  対象位置を選択してください
                </h3>
                <div className="flex justify-center relative">
                  <Board
                    board={opponentBoard}
                    isOpponentBoard={true}
                    onCellClick={handleCellClick}
                    disabled={false}
                  />
                  {/* エリアプレビュー表示 */}
                  {(skillId === 'chocolate-bomb' || skillId === 'waffle-scan') && selectedPosition && (
                    <AreaPreview
                      centerPosition={selectedPosition}
                      size={3}
                      type={skillId === 'chocolate-bomb' ? 'attack' : 'scan'}
                    />
                  )}
                </div>
                {selectedPosition && (
                  <p className="text-center mt-3 text-purple-600 font-semibold">
                    選択: ({selectedPosition.y + 1}, {selectedPosition.x + 1})
                  </p>
                )}
              </div>

              {/* ボタン */}
              <div className="flex gap-3">
                <Button
                  onClick={handleExecute}
                  variant="primary"
                  size="lg"
                  disabled={!selectedPosition}
                  className="flex-1"
                >
                  スキル実行
                </Button>
                <Button onClick={onClose} variant="ghost" size="lg" className="flex-1">
                  キャンセル
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
