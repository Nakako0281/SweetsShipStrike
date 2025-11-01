import React from 'react';

/**
 * ヘッダーコンポーネント
 * 現在はシンプルな構成
 * 将来的にナビゲーションやユーザー情報表示を追加予定
 */
export default function Header() {
  return (
    <header className="w-full bg-pink-100 border-b-4 border-pink-300">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-2xl font-bold text-pink-600">
          SweetsShipStrike
        </h1>
      </div>
    </header>
  );
}
