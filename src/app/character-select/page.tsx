'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { CHARACTER_DEFINITIONS } from '@/lib/game/characters';
import type { CharacterType, GameMode } from '@/types/game';

/**
 * キャラクター選択画面
 * プレイアブルキャラクターの中から1体を選択
 *
 * UI要素:
 * - キャラクター一覧表示（4体のプレイアブルキャラクター）
 * - 各キャラクターのイラスト、名前、説明を表示
 * - 「決定」ボタン → 配置画面へ（mode=cpuの場合は/ship-placement?mode=cpu&character={selected}）
 * - 「戻る」ボタン → モード選択画面へ
 *
 * クエリパラメータ:
 * - mode: 'cpu' | 'online' (ゲームモード)
 */
export default function CharacterSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as GameMode | null;

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);

  // プレイアブルキャラクターのみを取得
  const playableCharacters = Object.values(CHARACTER_DEFINITIONS).filter(
    (char) => char.isPlayable
  );

  useEffect(() => {
    // modeパラメータがない、または不正な場合はモード選択画面へ戻す
    if (!mode || (mode !== 'cpu' && mode !== 'online')) {
      router.push('/mode-select');
    }
  }, [mode, router]);

  const handleConfirm = () => {
    if (!selectedCharacter || !mode) return;

    // CPU対戦の場合は配置画面へ
    if (mode === 'cpu') {
      router.push(`/ship-placement?mode=cpu&character=${selectedCharacter}`);
    }
    // オンライン対戦の場合もとりあえず配置画面へ（後でロビー経由に変更予定）
    else {
      router.push(`/ship-placement?mode=online&character=${selectedCharacter}`);
    }
  };

  const handleBack = () => {
    router.push('/mode-select');
  };

  if (!mode) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* タイトル */}
      <div className="text-center mb-8 animate-slideUp">
        <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-2 drop-shadow-lg">
          キャラクター選択
        </h1>
        <p className="text-md md:text-lg text-purple-600 font-semibold">
          使用するキャラクターを選んでください
        </p>
      </div>

      {/* キャラクター一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-4xl animate-fadeIn">
        {playableCharacters.map((character) => (
          <button
            key={character.id}
            onClick={() => setSelectedCharacter(character.id)}
            className={`
              relative p-4 rounded-lg border-4 transition-all duration-200
              ${
                selectedCharacter === character.id
                  ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md'
              }
            `}
          >
            {/* キャラクターイラスト（仮） */}
            <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-4xl">🍰</span>
            </div>

            {/* キャラクター名 */}
            <h3 className="text-lg font-bold text-purple-800 mb-1 text-center">
              {character.name}
            </h3>

            {/* 選択マーク */}
            {selectedCharacter === character.id && (
              <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 決定・戻るボタン */}
      <div className="flex flex-col gap-3 w-full max-w-sm animate-fadeIn">
        <Button
          onClick={handleConfirm}
          size="lg"
          variant="primary"
          disabled={!selectedCharacter}
        >
          決定
        </Button>

        <Button onClick={handleBack} size="md" variant="ghost">
          戻る
        </Button>
      </div>
    </div>
  );
}
