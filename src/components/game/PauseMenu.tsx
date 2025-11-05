'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface PauseMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSurrender?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

/**
 * ポーズメニューコンポーネント
 */
export default function PauseMenu({
  isOpen,
  onClose,
  onSurrender,
  isMuted = false,
  onToggleMute,
}: PauseMenuProps) {
  const router = useRouter();

  const handleBackToTitle = () => {
    if (window.confirm('タイトルに戻りますか？ゲームの進行は失われます。')) {
      router.push('/');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* メニュー */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              {/* タイトル */}
              <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">
                ⏸️ ポーズ
              </h2>

              {/* メニューオプション */}
              <div className="space-y-4">
                {/* 再開 */}
                <Button onClick={onClose} variant="primary" size="lg" className="w-full">
                  ゲームに戻る
                </Button>

                {/* サウンド設定 */}
                {onToggleMute && (
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <span className="text-lg font-semibold text-purple-800">サウンド</span>
                    <button
                      onClick={onToggleMute}
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
                )}

                {/* 操作説明 */}
                <div className="bg-pink-50 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-purple-800 mb-2">操作方法</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>・マスをクリックして攻撃</li>
                    <li>・スキルボタンで特殊攻撃</li>
                    <li>・ターン制で交互に行動</li>
                  </ul>
                </div>

                {/* 降参 */}
                {onSurrender && (
                  <Button onClick={onSurrender} variant="danger" size="md" className="w-full">
                    降参する
                  </Button>
                )}

                {/* タイトルへ戻る */}
                <Button
                  onClick={handleBackToTitle}
                  variant="ghost"
                  size="md"
                  className="w-full"
                >
                  タイトルへ戻る
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
