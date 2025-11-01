'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

/**
 * モード選択画面
 * オンライン対戦 or CPU対戦を選択
 *
 * UI要素:
 * - 「オンライン対戦」ボタン → オンラインロビー画面へ
 * - 「CPU対戦」ボタン → キャラクター選択画面へ
 * - 「戻る」ボタン → タイトル画面へ
 *
 * MVP版では、オンライン対戦とCPU対戦のみ実装
 */
export default function ModeSelectPage() {
  const router = useRouter();

  const handleOnlineBattle = () => {
    router.push('/online-lobby');
  };

  const handleCpuBattle = () => {
    router.push('/character-select?mode=cpu');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* タイトル */}
      <div className="text-center mb-12 animate-slideUp">
        <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4 drop-shadow-lg">
          モード選択
        </h1>
        <p className="text-lg md:text-xl text-purple-600 font-semibold">
          どちらのモードで遊びますか？
        </p>
      </div>

      {/* モード選択ボタン */}
      <div className="flex flex-col gap-4 w-full max-w-sm animate-fadeIn">
        <Button onClick={handleOnlineBattle} size="lg" variant="primary">
          オンライン対戦
        </Button>

        <Button onClick={handleCpuBattle} size="lg" variant="secondary">
          CPU対戦
        </Button>

        <Button onClick={handleBack} size="lg" variant="ghost">
          戻る
        </Button>
      </div>
    </div>
  );
}
