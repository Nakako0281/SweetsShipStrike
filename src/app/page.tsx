'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/uiStore';
import { useSound } from '@/hooks/useSound';

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

  // UIストア
  const soundEnabled = useUIStore((state) => state.soundEnabled);
  const bgmEnabled = useUIStore((state) => state.bgmEnabled);
  const toggleSound = useUIStore((state) => state.toggleSound);
  const toggleBGM = useUIStore((state) => state.toggleBGM);

  // サウンド
  const { playSE, playBGM } = useSound();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
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

        <Button onClick={handleTutorial} size="lg" variant="secondary">
          遊び方
        </Button>

        <Button onClick={handleSettings} size="lg" variant="ghost">
          設定
        </Button>

        {/* 将来実装予定のボタン */}
        {/*
        <Button onClick={handleShop} size="lg" variant="ghost">
          ショップ
        </Button>

        <Button onClick={handleProfile} size="lg" variant="ghost">
          プロフィール
        </Button>
        */}
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
              <span className="text-lg font-semibold text-purple-800">BGM</span>
              <button
                onClick={toggleBGM}
                className={`w-16 h-8 rounded-full transition-colors ${
                  bgmEnabled ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                    bgmEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="text-lg font-semibold text-purple-800">効果音</span>
              <button
                onClick={toggleSound}
                className={`w-16 h-8 rounded-full transition-colors ${
                  soundEnabled ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-9' : 'translate-x-1'
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
