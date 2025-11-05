'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

/**
 * ヘルプ/チュートリアル画面
 */
export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* タイトル */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center text-purple-800 mb-8"
        >
          📚 ゲームの遊び方
        </motion.h1>

        {/* セクション */}
        <div className="space-y-6">
          {/* ゲーム概要 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              🎮 ゲーム概要
            </h2>
            <p className="text-purple-700 leading-relaxed">
              スイーツシップストライクは、バトルシップをベースにした海戦ゲームです。
              スイーツキャラクターたちが乗り物を配置して、相手の乗り物をすべて撃沈させることを目指します。
            </p>
          </motion.section>

          {/* 基本ルール */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              📜 基本ルール
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-purple-700">
              <li>
                <strong>配置フェーズ</strong>: 4種類の乗り物を10×10のボードに配置します
              </li>
              <li>
                <strong>攻撃フェーズ</strong>: ターン制で相手のボードを攻撃します
              </li>
              <li>
                <strong>連続攻撃</strong>: ヒットすると同じターンでもう一度攻撃できます
              </li>
              <li>
                <strong>勝利条件</strong>: 相手の乗り物をすべて撃沈させると勝利です
              </li>
            </ol>
          </motion.section>

          {/* 乗り物の種類 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              🚢 乗り物の種類
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-lg p-4">
                <h3 className="font-bold text-pink-600 mb-2">🍓 イチゴボート（4マス）</h3>
                <p className="text-sm text-purple-700">
                  最大の乗り物。配置は慎重に！
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <h3 className="font-bold text-pink-600 mb-2">🍫 ココア潜水艇（3マス）</h3>
                <p className="text-sm text-purple-700">
                  中型の乗り物。バランス型です。
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <h3 className="font-bold text-pink-600 mb-2">🧁 マカロン円盤（3マス）</h3>
                <p className="text-sm text-purple-700">
                  中型の乗り物。素早い動きが特徴です。
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <h3 className="font-bold text-pink-600 mb-2">🧇 ワッフル艦（2マス）</h3>
                <p className="text-sm text-purple-700">
                  最小の乗り物。見つかりにくい！
                </p>
              </div>
            </div>
          </motion.section>

          {/* スキルシステム */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              ✨ スキルシステム
            </h2>
            <div className="space-y-3">
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-bold text-purple-600 mb-2">🛡️ ストロベリーシールド</h3>
                <p className="text-sm text-purple-700">
                  次の1回の攻撃を無効化します。緊急回避に使おう！
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-bold text-purple-600 mb-2">💣 チョコレートボム</h3>
                <p className="text-sm text-purple-700">
                  2×2の範囲を一度に攻撃します。広範囲攻撃！
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-bold text-purple-600 mb-2">🌀 スイートエスケープ</h3>
                <p className="text-sm text-purple-700">
                  乗り物を別の場所に移動させます。ピンチの脱出に！
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-bold text-purple-600 mb-2">📡 格子スキャン</h3>
                <p className="text-sm text-purple-700">
                  十字範囲の情報を取得します。索敵に便利！
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-purple-600 bg-purple-50 rounded-lg p-3">
              ⚠️ 各スキルは1回のみ使用可能です。乗り物が撃沈されるとそのスキルは使えなくなります！
            </p>
          </motion.section>

          {/* 報酬システム */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              💰 報酬システム
            </h2>
            <div className="space-y-3 text-purple-700">
              <p>
                <strong>コイン獲得</strong>: 勝利すると条件に応じてコインを獲得できます
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>基本報酬: 100コイン（勝利時）</li>
                <li>オンライン勝利ボーナス: +50コイン</li>
                <li>速攻勝利ボーナス: +30コイン（10ターン以内）</li>
                <li>完全勝利ボーナス: +50コイン（無傷）</li>
                <li>逆転勝利ボーナス: +40コイン（HP劣勢から）</li>
              </ul>
              <p>
                <strong>称号システム</strong>: 条件を達成すると称号を獲得できます
              </p>
              <p>
                <strong>ショップ</strong>: コインを使ってキャラクタースキンを購入できます
              </p>
            </div>
          </motion.section>

          {/* ゲームモード */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              🎯 ゲームモード
            </h2>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-blue-600 mb-2">🌐 オンライン対戦</h3>
                <p className="text-sm text-purple-700">
                  友達とオンラインで対戦できます。ルームコードを共有して遊ぼう！
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-blue-600 mb-2">🤖 CPU対戦</h3>
                <p className="text-sm text-purple-700">
                  3段階の難易度でCPUと対戦できます。練習に最適！
                </p>
              </div>
            </div>
          </motion.section>

          {/* 操作方法 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              🖱️ 操作方法
            </h2>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-pink-500">►</span>
                <span>マウスでマスをクリックして攻撃</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500">►</span>
                <span>配置フェーズでは乗り物を選択してボードに配置</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500">►</span>
                <span>スキルボタンをクリックして特殊攻撃を使用</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500">►</span>
                <span>ESCキーまたはポーズボタンでポーズメニューを開く</span>
              </li>
            </ul>
          </motion.section>

          {/* Tips */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-yellow-300"
          >
            <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              💡 攻略のヒント
            </h2>
            <ul className="space-y-2 text-orange-800">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>乗り物は端や角に配置すると見つかりにくい</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>ヒット後は隣接マスを狙うと効率的</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>スキルは温存せず、効果的なタイミングで使おう</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>格子スキャンで索敵してからチョコレートボムが強力！</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>小さい乗り物ほど見つかりにくいが、HPも低い</span>
              </li>
            </ul>
          </motion.section>
        </div>

        {/* 戻るボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex justify-center"
        >
          <Button onClick={() => router.push('/')} variant="primary" size="lg">
            タイトルに戻る
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
