'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ShopItem from '@/components/reward/ShopItem';
import { getShopItems, purchaseSkin } from '@/lib/reward/shopManager';
import { getCoins } from '@/lib/reward/coinCalculator';
import { useUIStore } from '@/store/uiStore';
import type { CharacterSkin } from '@/types/ui';

/**
 * ショップ画面
 */
export default function ShopPage() {
  const router = useRouter();
  const addNotification = useUIStore((state) => state.addNotification);

  const [coins, setCoins] = useState(0);
  const [shopItems, setShopItems] = useState<CharacterSkin[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<CharacterSkin | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // 初期データ読み込み
  useEffect(() => {
    setCoins(getCoins());
    setShopItems(getShopItems());
  }, []);

  // 購入処理
  const handlePurchase = (skinId: string) => {
    const skin = shopItems.find((s) => s.id === skinId);
    if (!skin) return;

    setSelectedSkin(skin);
    setIsConfirmModalOpen(true);
  };

  // 購入確定
  const handleConfirmPurchase = () => {
    if (!selectedSkin) return;

    const result = purchaseSkin(selectedSkin.id);

    if (result.success) {
      // 成功通知
      addNotification({
        type: 'success',
        message: result.message,
      });

      // データ更新
      setCoins(getCoins());
      setShopItems(getShopItems());
    } else {
      // 失敗通知
      addNotification({
        type: 'error',
        message: result.message,
      });
    }

    setIsConfirmModalOpen(false);
    setSelectedSkin(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-purple-800">ショップ</h1>
          <Button onClick={() => router.push('/')} variant="ghost" size="md">
            ← 戻る
          </Button>
        </div>

        {/* 所持コイン表示 */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-xl font-semibold">所持コイン</span>
            <div className="flex items-center gap-2">
              <span className="text-white text-4xl font-bold">{coins}</span>
              <span className="text-white text-3xl">💰</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* アイテムリスト */}
      <div className="max-w-6xl mx-auto">
        {shopItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-purple-600">現在販売中のアイテムはありません</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {shopItems.map((skin, index) => (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ShopItem
                  skin={skin}
                  onPurchase={handlePurchase}
                  disabled={coins < skin.price && !skin.isPurchased}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 購入確認モーダル */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="購入確認"
      >
        {selectedSkin && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedSkin.imageUrl || '🎨'}</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">
                {selectedSkin.name}
              </h3>
              <p className="text-gray-600">{selectedSkin.description}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">価格</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-600">
                    {selectedSkin.price}
                  </span>
                  <span className="text-orange-600">💰</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">購入後の残高</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-purple-600">
                    {coins - selectedSkin.price}
                  </span>
                  <span className="text-purple-600">💰</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleConfirmPurchase}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                購入する
              </Button>
              <Button
                onClick={() => setIsConfirmModalOpen(false)}
                variant="ghost"
                size="lg"
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
