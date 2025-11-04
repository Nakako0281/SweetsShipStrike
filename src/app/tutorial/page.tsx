'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

/**
 * チュートリアル/遊び方画面
 * ゲームの基本ルールと操作方法を説明
 */
export default function TutorialPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4 drop-shadow-lg">
            遊び方
          </h1>
          <p className="text-lg text-purple-600 font-semibold">
            SweetsShipStrikeの基本ルール
          </p>
        </motion.div>

        {/* コンテンツ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* ゲームの目的 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span>🎯</span> ゲームの目的
            </h2>
            <p className="text-purple-700 text-lg">
              相手の船をすべて撃沈したら勝利！10×10のマス目で繰り広げられる、スイーツたちの海上バトルです。
            </p>
          </div>

          {/* 基本ルール */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span>📜</span> 基本ルール
            </h2>
            <div className="space-y-3 text-purple-700">
              <div className="flex gap-3">
                <span className="font-bold text-pink-600">1.</span>
                <p>
                  <strong>船の配置:</strong> 4種類の船（合計14マス）を10×10のボードに配置します
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-pink-600">2.</span>
                <p>
                  <strong>攻撃ターン:</strong> 交互に相手のマス目を攻撃します
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-pink-600">3.</span>
                <p>
                  <strong>ヒット判定:</strong> 船があれば「命中」、なければ「外れ」
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-pink-600">4.</span>
                <p>
                  <strong>撃沈:</strong> 船のすべてのマスに攻撃が命中すると撃沈！
                </p>
              </div>
            </div>
          </div>

          {/* 船の種類 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span>🚢</span> 船の種類
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-pink-50 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-2">🍰 ストロベリーケーキ</h3>
                <p className="text-sm text-purple-600">サイズ: 5マス</p>
                <p className="text-sm text-purple-600">スキル: ストロベリーシールド (防御)</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-2">🍫 チョコレートバー</h3>
                <p className="text-sm text-purple-600">サイズ: 4マス</p>
                <p className="text-sm text-purple-600">スキル: チョコレートボム (攻撃)</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-2">🍬 キャンディボート</h3>
                <p className="text-sm text-purple-600">サイズ: 3マス</p>
                <p className="text-sm text-purple-600">スキル: スイートエスケープ (移動)</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-2">🧇 ワッフルシップ</h3>
                <p className="text-sm text-purple-600">サイズ: 2マス</p>
                <p className="text-sm text-purple-600">スキル: ワッフルスキャン (偵察)</p>
              </div>
            </div>
          </div>

          {/* スキルシステム */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span>✨</span> スキルシステム
            </h2>
            <p className="text-purple-700 mb-3">
              各船は1回だけ使える特殊スキルを持っています：
            </p>
            <div className="space-y-2 text-purple-700">
              <div className="flex gap-3">
                <span>🍓</span>
                <p>
                  <strong>ストロベリーシールド:</strong> 選択した船を1ターン防御
                </p>
              </div>
              <div className="flex gap-3">
                <span>🍫</span>
                <p>
                  <strong>チョコレートボム:</strong> 3×3エリアを一度に攻撃
                </p>
              </div>
              <div className="flex gap-3">
                <span>🍬</span>
                <p>
                  <strong>スイートエスケープ:</strong> 船を別の位置に移動
                </p>
              </div>
              <div className="flex gap-3">
                <span>🧇</span>
                <p>
                  <strong>ワッフルスキャン:</strong> 3×3エリアをスキャンして船を発見
                </p>
              </div>
            </div>
          </div>

          {/* 勝利条件 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span>🏆</span> 勝利条件
            </h2>
            <p className="text-purple-700 text-lg">
              相手の船をすべて撃沈すれば勝利！戦略的に攻撃してスキルを活用しましょう。
            </p>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-pink-200">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span>💡</span> 攻略のコツ
            </h2>
            <ul className="space-y-2 text-purple-700 list-disc list-inside">
              <li>端や角を狙うより、中央付近を狙うと効率的</li>
              <li>船を撃沈したら、その周辺を集中的に攻撃</li>
              <li>スキルは温存せず、有利な状況で積極的に使用</li>
              <li>自分の船は広く分散させると見つかりにくい</li>
            </ul>
          </div>
        </motion.div>

        {/* 戻るボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button onClick={() => router.push('/')} variant="primary" size="lg">
            タイトルへ戻る
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
