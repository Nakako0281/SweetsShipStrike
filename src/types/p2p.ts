// ========================================
// P2P通信
// ========================================

/** P2P接続状態 */
export interface P2PConnection {
  peerId: string | null; // 自分のPeerID
  opponentId: string | null; // 相手のPeerID
  connection: any | null; // PeerJS DataConnection
  isConnected: boolean;
  isHost: boolean; // ホストかどうか
}

/** P2Pメッセージ */
export interface P2PMessage {
  type: 'gameAction' | 'ping' | 'pong' | 'sync' | 'disconnect';
  payload: any;
  timestamp: number;
}
