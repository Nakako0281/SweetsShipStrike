'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import type { CharacterSkin } from '@/types/ui';

interface ShopItemProps {
  skin: CharacterSkin;
  onPurchase: (skinId: string) => void;
  disabled?: boolean;
}

/**
 * ショップアイテムカード
 */
export default function ShopItem({ skin, onPurchase, disabled = false }: ShopItemProps) {
  const isPurchased = skin.isPurchased;

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      {/* スキンプレビュー */}
      <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 h-48 flex items-center justify-center">
        <div className="text-7xl">{skin.imageUrl || '🎨'}</div>

        {/* 購入済みバッジ */}
        {isPurchased && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            ✓ 所持中
          </div>
        )}
      </div>

      {/* 情報エリア */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-800 mb-2">{skin.name}</h3>
        <p className="text-sm text-gray-600 mb-4 h-12">{skin.description}</p>

        {/* 価格と購入ボタン */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">{skin.price}</span>
            <span className="text-orange-600">💰</span>
          </div>

          {isPurchased ? (
            <Button variant="ghost" size="sm" disabled>
              購入済み
            </Button>
          ) : (
            <Button
              onClick={() => onPurchase(skin.id)}
              variant="primary"
              size="sm"
              disabled={disabled}
            >
              購入する
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
