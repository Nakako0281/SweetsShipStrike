'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

type CPUDifficulty = 'easy' | 'normal' | 'hard';

/**
 * CPU難易度選択画面
 * CPU対戦時の難易度を選択
 */
export default function CPUDifficultyPage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<CPUDifficulty | null>(null);

  const difficulties: Array<{
    level: CPUDifficulty;
    name: string;
    description: string;
    icon: string;
  }> = [
    {
      level: 'easy',
      name: 'かんたん',
      description: '初心者におすすめ。CPUはランダムに攻撃します。',
      icon: '🍰',
    },
    {
      level: 'normal',
      name: 'ふつう',
      description: 'ほどよい挑戦。CPUは基本的な戦略を使います。',
      icon: '🧁',
    },
    {
      level: 'hard',
      name: 'むずかしい',
      description: '上級者向け。CPUは高度な戦略で攻めてきます。',
      icon: '🎂',
    },
  ];

  const handleConfirm = () => {
    if (!selectedDifficulty) return;
    router.push(`/character-select?mode=cpu&difficulty=${selectedDifficulty}`);
  };

  const handleBack = () => {
    router.push('/mode-select');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4 drop-shadow-lg">
          難易度選択
        </h1>
        <p className="text-lg md:text-xl text-purple-600 font-semibold">
          CPUの強さを選んでください
        </p>
      </motion.div>

      <div className="w-full max-w-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficulties.map((difficulty, index) => (
            <motion.button
              key={difficulty.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedDifficulty(difficulty.level)}
              className={`p-6 rounded-xl border-4 transition-all duration-200 ${
                selectedDifficulty === difficulty.level
                  ? 'border-pink-500 bg-pink-50 shadow-xl scale-105'
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-lg'
              }`}
            >
              <div className="text-6xl mb-4">{difficulty.icon}</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">{difficulty.name}</h3>
              <p className="text-sm text-purple-600">{difficulty.description}</p>
              {selectedDifficulty === difficulty.level && (
                <div className="mt-4 text-pink-500 font-bold text-lg">✓ 選択中</div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <Button
          onClick={handleConfirm}
          variant="primary"
          size="lg"
          disabled={!selectedDifficulty}
        >
          決定
        </Button>
        <Button onClick={handleBack} variant="ghost" size="md">
          戻る
        </Button>
      </motion.div>
    </div>
  );
}
