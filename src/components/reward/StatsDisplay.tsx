'use client';

import { motion } from 'framer-motion';
import type { PlayerStats } from '@/types/ui';

interface StatsDisplayProps {
  stats: PlayerStats;
}

/**
 * 統計情報表示コンポーネント
 */
export default function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="space-y-4">
      {/* 基本統計 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="総対戦数"
          value={stats.totalGames}
          icon="🎮"
          delay={0}
        />
        <StatCard
          label="勝利数"
          value={stats.wins}
          icon="🏆"
          color="text-pink-600"
          delay={0.1}
        />
        <StatCard
          label="敗北数"
          value={stats.losses}
          icon="💧"
          color="text-purple-600"
          delay={0.2}
        />
        <StatCard
          label="勝率"
          value={`${stats.winRate.toFixed(1)}%`}
          icon="📊"
          color="text-orange-600"
          delay={0.3}
        />
      </div>

      {/* ターン統計 */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-purple-800 mb-3">ターン統計</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-purple-600 mb-1">平均ターン数</p>
            <p className="text-2xl font-bold text-purple-800">
              {stats.averageTurns.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-purple-600 mb-1">最速勝利</p>
            <p className="text-2xl font-bold text-pink-600">
              {stats.fastestWin !== null ? `${stats.fastestWin}ターン` : '-'}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-purple-600 mb-1">最長ゲーム</p>
            <p className="text-2xl font-bold text-purple-800">
              {stats.longestGame}ターン
            </p>
          </div>
        </div>
      </div>

      {/* 特殊勝利 */}
      <div className="bg-pink-50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-pink-800 mb-3">特殊勝利</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-purple-700">✨ 完全勝利</span>
            <span className="text-xl font-bold text-pink-600">
              {stats.perfectWins}回
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-700">👑 逆転勝利</span>
            <span className="text-xl font-bold text-pink-600">
              {stats.comebackWins}回
            </span>
          </div>
        </div>
      </div>

      {/* モード別統計 */}
      <div className="bg-orange-50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-orange-800 mb-3">モード別</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-purple-700">🌐 オンライン対戦</span>
            <span className="text-xl font-bold text-orange-600">
              {stats.onlineGames}回
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-700">🤖 CPU対戦</span>
            <span className="text-xl font-bold text-orange-600">
              {stats.cpuGames}回
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 統計カードコンポーネント
 */
function StatCard({
  label,
  value,
  icon,
  color = 'text-purple-800',
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-purple-600">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </motion.div>
  );
}
