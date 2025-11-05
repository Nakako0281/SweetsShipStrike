'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import StatsDisplay from '@/components/reward/StatsDisplay';
import TitleBadge from '@/components/reward/TitleBadge';
import { loadPlayerStats } from '@/lib/reward/statsManager';
import { getEquippedTitle, getAllTitles, equipTitle } from '@/lib/reward/titleManager';
import type { PlayerStats, Title } from '@/types/ui';

/**
 * プロフィール画面
 */
export default function ProfilePage() {
  const router = useRouter();

  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [equippedTitle, setEquippedTitle] = useState<Title | null>(null);
  const [allTitles, setAllTitles] = useState<Title[]>([]);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

  // 初期データ読み込み
  useEffect(() => {
    setStats(loadPlayerStats());
    setEquippedTitle(getEquippedTitle());
    setAllTitles(getAllTitles());
  }, []);

  // 称号装備
  const handleEquipTitle = (titleId: string) => {
    const success = equipTitle(titleId);
    if (success) {
      setEquippedTitle(getEquippedTitle());
      setIsTitleModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-purple-800">プロフィール</h1>
          <Button onClick={() => router.push('/')} variant="ghost" size="md">
            ← 戻る
          </Button>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* キャラクター＆称号カード */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* キャラクター画像 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center text-6xl">
                👤
              </div>
            </div>

            {/* 称号エリア */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-bold text-purple-800 mb-3">装備中の称号</h2>
              <TitleBadge title={equippedTitle} size="md" />
              <div className="mt-3">
                <Button
                  onClick={() => setIsTitleModalOpen(true)}
                  variant="ghost"
                  size="sm"
                >
                  称号を変更
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 統計表示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-purple-800 mb-4">戦績</h2>
          {stats ? (
            <StatsDisplay stats={stats} />
          ) : (
            <p className="text-center text-gray-500 py-8">
              まだ対戦記録がありません
            </p>
          )}
        </motion.div>
      </div>

      {/* 称号変更モーダル */}
      <Modal
        isOpen={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        title="称号を選択"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {allTitles.map((title, index) => (
            <motion.div
              key={title.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => title.isUnlocked && handleEquipTitle(title.id)}
                disabled={!title.isUnlocked}
                className="w-full text-left hover:bg-purple-50 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <TitleBadge title={title} size="sm" showUnlockCondition />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-purple-200">
          <Button
            onClick={() => setIsTitleModalOpen(false)}
            variant="ghost"
            size="md"
            className="w-full"
          >
            閉じる
          </Button>
        </div>
      </Modal>
    </div>
  );
}
