'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/uiStore';
import { useSound } from '@/hooks/useSound';
import { getCoins } from '@/lib/reward/coinCalculator';
import { motion } from 'framer-motion';

/**
 * タイトル画面
 * ゲームのエントリーポイント
 *
 * UI要素:
 * - タイトルロゴ
 * - スタートボタン（モード選択へ）
 * - 設定ボタン（サウンド設定モーダル）
 *
 * MVP版では、ショップ・プロフィール・コイン表示は将来実装
 */
export default function TitlePage() {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [coins, setCoins] = useState(0);

  // UIストア
  const isMuted = useUIStore((state) => state.isMuted);
  const toggleMute = useUIStore((state) => state.toggleMute);

  // サウンド
  const { playSE, playBGM } = useSound();

  // コイン読み込み
  useEffect(() => {
    setCoins(getCoins());
  }, []);

  // BGM自動再生
  useEffect(() => {
    // タイトル画面BGMを再生（実際の音声ファイルがあれば）
    // playBGM('title');
  }, [playBGM]);

  const handleStart = () => {
    playSE('button');
    router.push('/mode-select');
  };

  const handleSettings = () => {
    playSE('button');
    setIsSettingsOpen(true);
  };

  const handleTutorial = () => {
    playSE('button');
    router.push('/tutorial');
  };

  const handleShop = () => {
    playSE('button');
    router.push('/shop');
  };

  const handleProfile = () => {
    playSE('button');
    router.push('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* 所持コイン表示 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-6 py-3 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">{coins}</span>
          <span className="text-white text-2xl">💰</span>
        </div>
      </motion.div>

      {/* タイトルロゴ */}
      <div className="text-center mb-12 animate-slideUp">
        <h1 className="text-6xl md:text-8xl font-bold text-pink-600 mb-4 drop-shadow-lg">
          SweetsShipStrike
        </h1>
        <p className="text-xl md:text-2xl text-purple-600 font-semibold">
          スイーツシップストライク
        </p>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          スイーツたちの海上バトル！
        </p>
      </div>

      {/* メニューボタン */}
      <div className="flex flex-col gap-4 w-full max-w-sm animate-fadeIn">
        <Button onClick={handleStart} size="lg" variant="primary">
          スタート
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleShop} size="md" variant="secondary">
            🛍️ ショップ
          </Button>

          <Button onClick={handleProfile} size="md" variant="secondary">
            👤 プロフィール
          </Button>
        </div>

        <Button onClick={handleTutorial} size="lg" variant="ghost">
          遊び方
        </Button>

        <Button onClick={handleSettings} size="lg" variant="ghost">
          設定
        </Button>
      </div>

      {/* バージョン表示 */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400">
        v1.0.0 MVP
      </div>

      {/* 設定モーダル */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="設定"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="text-lg font-semibold text-purple-800">サウンド</span>
              <button
                onClick={toggleMute}
                className={`w-16 h-8 rounded-full transition-colors ${
                  !isMuted ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                    !isMuted ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={() => setIsSettingsOpen(false)} variant="primary" size="md">
              閉じる
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
