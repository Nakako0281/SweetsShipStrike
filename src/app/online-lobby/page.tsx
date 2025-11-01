'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

/**
 * オンラインロビー画面
 * P2P接続のためのルーム作成・参加機能
 *
 * UI要素:
 * - 「ルーム作成」ボタン → 自分がホストとしてルームを作成
 * - 「ルームID入力欄」→ 既存のルームに参加
 * - 「参加」ボタン → 入力されたルームIDのルームに参加
 * - 接続状態の表示（接続中、接続完了、エラー）
 * - 「戻る」ボタン → モード選択画面へ
 *
 * MVP版では基本的なP2P接続のみ実装
 * 接続完了後はキャラクター選択画面へ遷移
 */
export default function OnlineLobbyPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'creating' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // ルーム作成処理（仮実装）
  const handleCreateRoom = () => {
    setConnectionStatus('creating');
    setErrorMessage('');

    // 仮のルームID生成（後でPeerJS実装時に置き換え）
    const generatedRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMyPeerId(generatedRoomId);
    setConnectionStatus('connected');

    // TODO: 実際のPeerJS接続処理
    // const peer = new Peer();
    // peer.on('open', (id) => {
    //   setMyPeerId(id);
    //   setConnectionStatus('connected');
    // });
  };

  // ルーム参加処理（仮実装）
  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setErrorMessage('ルームIDを入力してください');
      return;
    }

    setConnectionStatus('connecting');
    setErrorMessage('');

    // TODO: 実際のPeerJS接続処理
    // const peer = new Peer();
    // peer.on('open', (id) => {
    //   const conn = peer.connect(roomId);
    //   conn.on('open', () => {
    //     setConnectionStatus('connected');
    //     // キャラクター選択画面へ遷移
    //     router.push('/character-select?mode=online');
    //   });
    //   conn.on('error', (err) => {
    //     setConnectionStatus('error');
    //     setErrorMessage('接続に失敗しました');
    //   });
    // });

    // 仮実装：少し待ってからキャラクター選択画面へ
    setTimeout(() => {
      setConnectionStatus('connected');
      router.push('/character-select?mode=online');
    }, 1000);
  };

  const handleBack = () => {
    router.push('/mode-select');
  };

  // ルーム作成後、キャラクター選択へ遷移
  const handleProceedToCharacterSelect = () => {
    router.push('/character-select?mode=online');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      {/* タイトル */}
      <div className="text-center mb-8 animate-slideUp">
        <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-2 drop-shadow-lg">
          オンラインロビー
        </h1>
        <p className="text-md md:text-lg text-purple-600 font-semibold">
          ルームを作成するか、既存のルームに参加してください
        </p>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md animate-fadeIn">
        {/* ルーム作成セクション */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-3">ルームを作成</h2>
          {myPeerId ? (
            <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4 mb-3">
              <p className="text-sm text-purple-600 mb-2">あなたのルームID:</p>
              <p className="text-2xl font-bold text-pink-600 text-center tracking-wider">
                {myPeerId}
              </p>
              <p className="text-xs text-purple-500 mt-2 text-center">
                このIDを相手に伝えてください
              </p>
            </div>
          ) : (
            <Button
              onClick={handleCreateRoom}
              variant="primary"
              size="md"
              disabled={connectionStatus === 'creating'}
              className="w-full"
            >
              {connectionStatus === 'creating' ? '作成中...' : 'ルーム作成'}
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
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-pink-500 focus:outline-none mb-3 text-center text-lg font-semibold tracking-wider"
            maxLength={6}
          />
          <Button
            onClick={handleJoinRoom}
            variant="secondary"
            size="md"
            disabled={!roomId.trim() || connectionStatus === 'connecting'}
            className="w-full"
          >
            {connectionStatus === 'connecting' ? '接続中...' : '参加'}
          </Button>
        </div>

        {/* 接続状態の表示 */}
        {connectionStatus === 'connected' && myPeerId && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
            <p className="text-green-700 font-semibold text-center mb-3">
              ✓ ルーム作成完了！
            </p>
            <Button
              onClick={handleProceedToCharacterSelect}
              variant="primary"
              size="md"
              className="w-full"
            >
              キャラクター選択へ
            </Button>
          </div>
        )}

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm text-center">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* 戻るボタン */}
      <div className="mt-6 w-full max-w-md">
        <Button onClick={handleBack} variant="ghost" size="md" className="w-full">
          戻る
        </Button>
      </div>
    </div>
  );
}
