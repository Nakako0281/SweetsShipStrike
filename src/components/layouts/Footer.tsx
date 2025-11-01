import React from 'react';

/**
 * フッターコンポーネント
 * コピーライト情報を表示
 */
export default function Footer() {
  return (
    <footer className="w-full bg-pink-100 border-t-4 border-pink-300 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-sm text-pink-600">
          © 2025 SweetsShipStrike. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
