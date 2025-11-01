import Peer, { DataConnection } from 'peerjs';
import type { P2PConnection, P2PMessage } from '@/types/p2p';
import type { GameAction } from '@/types/game';

/**
 * P2P接続管理
 * PeerJSを使用した接続の確立、メッセージ送受信を管理
 */

type MessageHandler = (message: P2PMessage) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Error) => void;

export class PeerManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private messageHandlers: MessageHandler[] = [];
  private connectionHandlers: ConnectionHandler[] = [];
  private disconnectHandlers: ConnectionHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];

  /**
   * Peer初期化（ホスト側）
   */
  async createRoom(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // PeerJS接続（公開サーバー使用、本番ではRenderデプロイ予定）
        this.peer = new Peer();

        this.peer.on('open', (id) => {
          console.log('Peer created with ID:', id);
          resolve(id);
        });

        this.peer.on('connection', (conn) => {
          console.log('Incoming connection from:', conn.peer);
          this.setupConnection(conn);
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.errorHandlers.forEach((handler) => handler(err));
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * ルームに参加（ゲスト側）
   */
  async joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer();

        this.peer.on('open', (id) => {
          console.log('My peer ID:', id);
          const conn = this.peer!.connect(roomId);
          this.setupConnection(conn);
          resolve();
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.errorHandlers.forEach((handler) => handler(err));
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 接続のセットアップ
   */
  private setupConnection(conn: DataConnection) {
    this.connection = conn;

    conn.on('open', () => {
      console.log('Connection established');
      this.connectionHandlers.forEach((handler) => handler());
    });

    conn.on('data', (data) => {
      console.log('Received data:', data);
      try {
        const message = data as P2PMessage;
        this.messageHandlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    conn.on('close', () => {
      console.log('Connection closed');
      this.disconnectHandlers.forEach((handler) => handler());
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      this.errorHandlers.forEach((handler) => handler(err));
    });
  }

  /**
   * メッセージ送信
   */
  sendMessage(message: P2PMessage): boolean {
    if (!this.connection || !this.connection.open) {
      console.error('No active connection');
      return false;
    }

    try {
      this.connection.send(message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * ゲームアクション送信
   */
  sendAction(action: GameAction): boolean {
    return this.sendMessage({
      type: 'game_action',
      data: action,
      timestamp: Date.now(),
    });
  }

  /**
   * メッセージハンドラー登録
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * 接続成功ハンドラー登録
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * 切断ハンドラー登録
   */
  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectHandlers.push(handler);
    return () => {
      this.disconnectHandlers = this.disconnectHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * エラーハンドラー登録
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * 接続状態取得
   */
  isConnected(): boolean {
    return this.connection !== null && this.connection.open;
  }

  /**
   * Peer ID取得
   */
  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  /**
   * 接続クローズ
   */
  close(): void {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    // ハンドラークリア
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.disconnectHandlers = [];
    this.errorHandlers = [];
  }
}

// シングルトンインスタンス
let peerManagerInstance: PeerManager | null = null;

/**
 * PeerManagerのシングルトンインスタンス取得
 */
export function getPeerManager(): PeerManager {
  if (!peerManagerInstance) {
    peerManagerInstance = new PeerManager();
  }
  return peerManagerInstance;
}

/**
 * PeerManagerのリセット（テスト用）
 */
export function resetPeerManager(): void {
  if (peerManagerInstance) {
    peerManagerInstance.close();
    peerManagerInstance = null;
  }
}
