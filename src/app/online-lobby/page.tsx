'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import { useP2PStore } from '@/store/p2pStore';
import { useUIStore } from '@/store/uiStore';
import { PeerManager } from '@/lib/p2p/peerManager';

/**
 * オンラインロビー画面
 * P2P接続のためのルーム作成・参加機能
 *
 * 実装済みコンポーネントとストアを統合:
 * - PeerManager: P2P接続管理
 * - useP2PStore: 接続状態管理
 * - useUIStore: 通知システム
 */
export default function OnlineLobbyPage() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState('');

  // P2Pストア
  const connectionState = useP2PStore((state) => state.connectionState);
  const isHost = useP2PStore((state) => state.isHost);
  const roomId = useP2PStore((state) => state.roomId);
  const setConnectionState = useP2PStore((state) => state.setConnectionState);
  const setHost = useP2PStore((state) => state.setHost);
  const setRoomId = useP2PStore((state) => state.setRoomId);
  const disconnect = useP2PStore((state) => state.disconnect);

  // UIストア
  const addNotification = useUIStore((state) => state.addNotification);

  // PeerManagerインスタンス
  const [peerManager, setPeerManager] = useState<PeerManager | null>(null);

  // 初期化
  useEffect(() => {
    const manager = PeerManager.getInstance();
    setPeerManager(manager);

    return () => {
      // クリーンアップ
      if (connectionState === 'disconnected') {
        manager.disconnect();
      }
    };
  }, []);

  // ルーム作成処理
  const handleCreateRoom = async () => {
    if (!peerManager) return;

    try {
      setConnectionState('connecting');
      addNotification({
        type: 'info',
        message: 'ルームを作成中...',
      });

      const createdRoomId = await peerManager.createRoom(
        (data) => {
          // メッセージ受信ハンドラー
          console.log('Received data:', data);
        },
        (err) => {
          // エラーハンドラー
          console.error('Connection error:', err);
          setConnectionState('disconnected');
          addNotification({
            type: 'error',
            message: '接続エラーが発生しました',
          });
        }
      );

      setHost(true);
      setRoomId(createdRoomId);
      setConnectionState('connected');

      addNotification({
        type: 'success',
        message: `ルームを作成しました: ${createdRoomId}`,
      });
    } catch (error) {
      setConnectionState('disconnected');
      addNotification({
        type: 'error',
        message: 'ルーム作成に失敗しました',
      });
      console.error('Failed to create room:', error);
    }
  };

  // ルーム参加処理
  const handleJoinRoom = async () => {
    if (!peerManager || !roomIdInput.trim()) {
      addNotification({
        type: 'warning',
        message: 'ルームIDを入力してください',
      });
      return;
    }

    try {
      setConnectionState('connecting');
      addNotification({
        type: 'info',
        message: 'ルームに接続中...',
      });

      await peerManager.joinRoom(
        roomIdInput.trim(),
        (data) => {
          // メッセージ受信ハンドラー
          console.log('Received data:', data);
        },
        (err) => {
          // エラーハンドラー
          console.error('Connection error:', err);
          setConnectionState('disconnected');
          addNotification({
            type: 'error',
            message: '接続エラーが発生しました',
          });
        }
      );

      setHost(false);
      setRoomId(roomIdInput.trim());
      setConnectionState('connected');

      addNotification({
        type: 'success',
        message: 'ルームに参加しました',
      });

      // キャラクター選択画面へ遷移
      setTimeout(() => {
        router.push('/character-select?mode=online');
      }, 1000);
    } catch (error) {
      setConnectionState('disconnected');
      addNotification({
        type: 'error',
        message: 'ルーム参加に失敗しました',
      });
      console.error('Failed to join room:', error);
    }
  };

  const handleBack = () => {
    if (connectionState === 'connected' && peerManager) {
      peerManager.disconnect();
      disconnect();
    }
    router.push('/mode-select');
  };

  // ルーム作成後、キャラクター選択へ遷移
  const handleProceedToCharacterSelect = () => {
    router.push('/character-select?mode=online');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* 通知システム */}
      <Notification />

      {/* タイトル */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-2 drop-shadow-lg">
          オンラインロビー
        </h1>
        <p className="text-md md:text-lg text-purple-600 font-semibold">
          ルームを作成するか、既存のルームに参加してください
        </p>
      </motion.div>

      {/* メインコンテンツ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md"
      >
        {/* ルーム作成セクション */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-3">ルームを作成</h2>
          {connectionState === 'connected' && isHost && roomId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4 mb-3"
            >
              <p className="text-sm text-purple-600 mb-2">あなたのルームID:</p>
              <p className="text-2xl font-bold text-pink-600 text-center tracking-wider font-mono">
                {roomId}
              </p>
              <p className="text-xs text-purple-500 mt-2 text-center">
                このIDを相手に伝えてください
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  addNotification({
                    type: 'success',
                    message: 'ルームIDをコピーしました',
                  });
                }}
                className="mt-3 w-full px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-semibold"
              >
                📋 IDをコピー
              </button>
            </motion.div>
          ) : (
            <Button
              onClick={handleCreateRoom}
              variant="primary"
              size="md"
              disabled={connectionState === 'connecting'}
              className="w-full"
            >
              {connectionState === 'connecting' ? '作成中...' : 'ルーム作成'}
            </Button>
          )}
        </div>

        {/* 区切り線 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-purple-500 font-semibold">または</span>
          </div>
        </div>

        {/* ルーム参加セクション */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-3">ルームに参加</h2>
          <input
            type="text"
            placeholder="ルームIDを入力"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-pink-500 focus:outline-none mb-3 text-center text-lg font-semibold tracking-wider font-mono"
            maxLength={16}
            disabled={connectionState === 'connecting' || connectionState === 'connected'}
          />
          <Button
            onClick={handleJoinRoom}
            variant="secondary"
            size="md"
            disabled={
              !roomIdInput.trim() ||
              connectionState === 'connecting' ||
              connectionState === 'connected'
            }
            className="w-full"
          >
            {connectionState === 'connecting' ? '接続中...' : '参加'}
          </Button>
        </div>

        {/* 接続完了時の表示 */}
        {connectionState === 'connected' && isHost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4"
          >
            <p className="text-green-700 font-semibold text-center mb-3">✓ ルーム作成完了！</p>
            <p className="text-sm text-green-600 text-center mb-3">
              相手の参加を待っています...
            </p>
            <Button
              onClick={handleProceedToCharacterSelect}
              variant="primary"
              size="md"
              className="w-full"
            >
              キャラクター選択へ
            </Button>
          </motion.div>
        )}

        {/* 接続状態インジケーター */}
        {connectionState === 'connecting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 py-4"
          >
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-200" />
          </motion.div>
        )}
      </motion.div>

      {/* 戻るボタン */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 w-full max-w-md"
      >
        <Button onClick={handleBack} variant="ghost" size="md" className="w-full">
          戻る
        </Button>
      </motion.div>
    </div>
  );
}
