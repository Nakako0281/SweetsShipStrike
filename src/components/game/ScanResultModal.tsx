'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import type { Position } from '@/types/game';

interface ScanResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  scannedArea: Position[];
  hitCount: number;
}

/**
 * スキャン結果モーダル
 * ワッフルスキャンの結果を表示
 */
export default function ScanResultModal({
  isOpen,
  onClose,
  scannedArea,
  hitCount,
}: ScanResultModalProps) {
  if (!isOpen) return null;

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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              {/* ヘッダー */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🧇</div>
                <h2 className="text-3xl font-bold text-purple-800 mb-2">スキャン結果</h2>
              </div>

              {/* 結果表示 */}
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-600 mb-2">
                    {hitCount}
                  </div>
                  <div className="text-xl text-orange-800 font-semibold">
                    マスに船が存在
                  </div>
                  <div className="text-sm text-orange-600 mt-2">
                    スキャンエリア: {scannedArea.length}マス
                  </div>
                </div>
              </div>

              {/* メッセージ */}
              <div className="text-center mb-6">
                {hitCount > 0 ? (
                  <p className="text-purple-700">
                    スキャンエリア内に船を発見しました！<br />
                    次の攻撃の参考にしてください。
                  </p>
                ) : (
                  <p className="text-purple-700">
                    スキャンエリア内に船は見つかりませんでした。
                  </p>
                )}
              </div>

              {/* 閉じるボタン */}
              <Button onClick={onClose} variant="primary" size="lg" className="w-full">
                閉じる
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
