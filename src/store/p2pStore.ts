import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getPeerManager } from '@/lib/p2p/peerManager';
import type { P2PConnection, P2PMessage } from '@/types/p2p';

/**
 * P2P接続状態管理用Zustandストア
 */

interface P2PStore {
  // 状態
  connection: P2PConnection;
  error: string | null;

  // アクション
  createRoom: () => Promise<string | null>;
  joinRoom: (roomId: string) => Promise<boolean>;
  sendMessage: (message: P2PMessage) => boolean;
  disconnect: () => void;
  setError: (error: string | null) => void;
  clearConnection: () => void;
}

export const useP2PStore = create<P2PStore>()(
  devtools(
    (set, get) => ({
      // 初期状態
      connection: {
        peerId: null,
        opponentId: null,
        connection: null,
        isConnected: false,
        isHost: false,
      },
      error: null,

      // ルーム作成（ホスト側）
      createRoom: async () => {
        try {
          const peerManager = getPeerManager();

          // 接続ハンドラー設定
          peerManager.onConnect(() => {
            set({
              connection: {
                ...get().connection,
                isConnected: true,
              },
              error: null,
            });
          });

          peerManager.onDisconnect(() => {
            set({
              connection: {
                ...get().connection,
                isConnected: false,
              },
            });
          });

          peerManager.onError((err) => {
            set({ error: err.message });
          });

          // ルーム作成
          const peerId = await peerManager.createRoom();

          set({
            connection: {
              peerId,
              opponentId: null,
              connection: peerManager,
              isConnected: false,
              isHost: true,
            },
            error: null,
          });

          return peerId;
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage });
          return null;
        }
      },

      // ルーム参加（ゲスト側）
      joinRoom: async (roomId: string) => {
        try {
          const peerManager = getPeerManager();

          // 接続ハンドラー設定
          peerManager.onConnect(() => {
            set({
              connection: {
                ...get().connection,
                opponentId: roomId,
                isConnected: true,
              },
              error: null,
            });
          });

          peerManager.onDisconnect(() => {
            set({
              connection: {
                ...get().connection,
                isConnected: false,
              },
            });
          });

          peerManager.onError((err) => {
            set({ error: err.message });
          });

          // ルーム参加
          await peerManager.joinRoom(roomId);

          const peerId = peerManager.getPeerId();

          set({
            connection: {
              peerId,
              opponentId: roomId,
              connection: peerManager,
              isConnected: false, // 接続完了はonConnectで設定
              isHost: false,
            },
            error: null,
          });

          return true;
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage });
          return false;
        }
      },

      // メッセージ送信
      sendMessage: (message: P2PMessage) => {
        const { connection } = get();

        if (!connection.connection) {
          set({ error: 'No active connection' });
          return false;
        }

        const success = connection.connection.sendMessage(message);
        if (!success) {
          set({ error: 'Failed to send message' });
        }

        return success;
      },

      // 切断
      disconnect: () => {
        const { connection } = get();

        if (connection.connection) {
          connection.connection.close();
        }

        set({
          connection: {
            peerId: null,
            opponentId: null,
            connection: null,
            isConnected: false,
            isHost: false,
          },
          error: null,
        });
      },

      // エラー設定
      setError: (error: string | null) => {
        set({ error });
      },

      // 接続クリア
      clearConnection: () => {
        set({
          connection: {
            peerId: null,
            opponentId: null,
            connection: null,
            isConnected: false,
            isHost: false,
          },
          error: null,
        });
      },
    }),
    { name: 'P2PStore' }
  )
);
