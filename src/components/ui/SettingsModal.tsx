'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 設定モーダルコンポーネント
 * サウンド設定などを管理
 */
export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [bgmVolume, setBgmVolume] = useState(70);
  const [seVolume, setSeVolume] = useState(70);
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const [isSeMuted, setIsSeMuted] = useState(false);

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBgmVolume = localStorage.getItem('bgmVolume');
      const savedSeVolume = localStorage.getItem('seVolume');
      const savedBgmMuted = localStorage.getItem('bgmMuted');
      const savedSeMuted = localStorage.getItem('seMuted');

      if (savedBgmVolume) setBgmVolume(parseInt(savedBgmVolume, 10));
      if (savedSeVolume) setSeVolume(parseInt(savedSeVolume, 10));
      if (savedBgmMuted) setIsBgmMuted(savedBgmMuted === 'true');
      if (savedSeMuted) setIsSeMuted(savedSeMuted === 'true');
    }
  }, []);

  // 設定を保存
  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgmVolume', bgmVolume.toString());
      localStorage.setItem('seVolume', seVolume.toString());
      localStorage.setItem('bgmMuted', isBgmMuted.toString());
      localStorage.setItem('seMuted', isSeMuted.toString());
    }
    onClose();
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

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              {/* タイトル */}
              <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">
                ⚙️ 設定
              </h2>

              {/* BGM設定 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-purple-800">BGM音量</h3>
                  <button
                    onClick={() => setIsBgmMuted(!isBgmMuted)}
                    className={`px-4 py-1 rounded-full font-bold transition-colors ${
                      !isBgmMuted
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {!isBgmMuted ? '🔊 ON' : '🔇 OFF'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bgmVolume}
                  onChange={(e) => setBgmVolume(parseInt(e.target.value, 10))}
                  disabled={isBgmMuted}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
                <div className="text-right text-sm text-purple-600 mt-1">
                  {bgmVolume}%
                </div>
              </div>

              {/* SE設定 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-purple-800">SE音量</h3>
                  <button
                    onClick={() => setIsSeMuted(!isSeMuted)}
                    className={`px-4 py-1 rounded-full font-bold transition-colors ${
                      !isSeMuted
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {!isSeMuted ? '🔊 ON' : '🔇 OFF'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={seVolume}
                  onChange={(e) => setSeVolume(parseInt(e.target.value, 10))}
                  disabled={isSeMuted}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
                <div className="text-right text-sm text-purple-600 mt-1">
                  {seVolume}%
                </div>
              </div>

              {/* バージョン情報 */}
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-700 text-center">
                  SweetsShipStrike v1.0.0
                </p>
                <p className="text-xs text-purple-500 text-center mt-1">
                  © 2025 All Rights Reserved
                </p>
              </div>

              {/* ボタン */}
              <div className="flex gap-3">
                <Button onClick={onClose} variant="ghost" size="md" className="flex-1">
                  キャンセル
                </Button>
                <Button onClick={handleSave} variant="primary" size="md" className="flex-1">
                  保存
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
