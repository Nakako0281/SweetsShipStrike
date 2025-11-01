'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

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

  const handleStart = () => {
    router.push('/mode-select');
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
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

        <Button onClick={handleSettings} size="lg" variant="secondary">
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
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            サウンド設定機能は今後実装予定です
          </p>

          {/* 将来実装予定 */}
          {/*
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BGM音量
            </label>
            <input type="range" min="0" max="100" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SE音量
            </label>
            <input type="range" min="0" max="100" className="w-full" />
          </div>
          */}

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
