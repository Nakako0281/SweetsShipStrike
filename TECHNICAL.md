# 🔧 SweetsShipStrike 技術ドキュメント

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [技術選定理由](#技術選定理由)
3. [ディレクトリ構造](#ディレクトリ構造)
4. [主要モジュール](#主要モジュール)
5. [状態管理](#状態管理)
6. [P2P通信](#p2p通信)
7. [ゲームロジック](#ゲームロジック)
8. [パフォーマンス最適化](#パフォーマンス最適化)
9. [セキュリティ](#セキュリティ)
10. [今後の拡張](#今後の拡張)

---

## アーキテクチャ概要

### システム構成図

```
┌─────────────────────────────────────────────────┐
│                   Browser                       │
│  ┌───────────────────────────────────────────┐ │
│  │         Next.js 15 (App Router)            │ │
│  │  ┌────────────┐  ┌─────────────────────┐  │ │
│  │  │   Pages    │  │    Components       │  │ │
│  │  │  (React)   │←→│  (UI/Game/Effects)  │  │ │
│  │  └────────────┘  └─────────────────────┘  │ │
│  │         ↕                    ↕              │ │
│  │  ┌────────────┐  ┌─────────────────────┐  │ │
│  │  │   Zustand  │  │   Business Logic    │  │ │
│  │  │   (State)  │←→│ (Game/AI/Reward)    │  │ │
│  │  └────────────┘  └─────────────────────┘  │ │
│  │                          ↕                  │ │
│  │              ┌──────────────────┐          │ │
│  │              │  PeerJS Client   │          │ │
│  │              └──────────────────┘          │ │
│  └──────────────────────┼──────────────────────┘ │
└────────────────────────┼───────────────────────────┘
                         │ WebRTC (P2P)
                         ↓
               ┌──────────────────┐
               │   PeerJS Server  │
               │  (Render.com)    │
               └──────────────────┘
```

### レイヤー構造

```
┌─────────────────────────────────────┐
│  Presentation Layer (Pages/Components) │
├─────────────────────────────────────┤
│  Application Layer (Hooks/Store)       │
├─────────────────────────────────────┤
│  Domain Layer (Game Logic/AI/Reward)   │
├─────────────────────────────────────┤
│  Infrastructure Layer (P2P/Storage)    │
└─────────────────────────────────────┘
```

---

## 技術選定理由

### Next.js 15
- **App Router**: ファイルベースルーティングで直感的
- **React Server Components**: 初期レンダリングの高速化
- **TypeScript統合**: 型安全な開発環境
- **Vercelデプロイ**: 簡単なデプロイとホスティング

### TypeScript 5.6
- **型安全性**: バグの早期発見
- **IntelliSense**: 開発効率の向上
- **リファクタリング**: 安全なコード変更
- **ドキュメント**: 型が自己ドキュメント化

### Tailwind CSS 4.0
- **ユーティリティファースト**: 高速なUI開発
- **レスポンシブ**: モバイルファースト設計
- **カスタマイズ**: 柔軟なテーマ設定
- **バンドルサイズ**: 未使用CSSの自動削除

### Framer Motion 11.0
- **宣言的API**: Reactとの親和性
- **パフォーマンス**: GPU加速アニメーション
- **レイアウトアニメーション**: 自動レイアウト計算
- **ジェスチャー**: タッチ/ドラッグ対応

### Zustand 5.0
- **シンプル**: 最小限のボイラープレート
- **軽量**: 1KB未満のバンドルサイズ
- **柔軟**: ミドルウェア対応
- **TypeScript**: 完全な型サポート

### PeerJS 1.5
- **WebRTC**: ブラウザ間P2P通信
- **簡単API**: WebRTCの複雑さを隠蔽
- **データチャネル**: 低レイテンシ通信
- **シグナリング**: カスタムサーバー対応

---

## ディレクトリ構造

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                  # タイトル画面
│   ├── mode-select/              # モード選択
│   ├── character-select/         # キャラクター選択
│   ├── cpu-difficulty/           # CPU難易度選択
│   ├── online-lobby/             # オンラインロビー
│   ├── ship-placement/           # 配置画面
│   ├── game/                     # ゲーム画面
│   ├── result/                   # 結果画面
│   ├── shop/                     # ショップ
│   ├── profile/                  # プロフィール
│   ├── help/                     # ヘルプ
│   ├── layout.tsx                # ルートレイアウト
│   └── globals.css               # グローバルCSS
│
├── components/                    # Reactコンポーネント
│   ├── ui/                       # 汎用UIコンポーネント
│   │   ├── Button.tsx           # ボタン
│   │   ├── Modal.tsx            # モーダル
│   │   ├── Loading.tsx          # ローディング
│   │   ├── Notification.tsx     # 通知システム
│   │   ├── PageTransition.tsx   # ページ遷移
│   │   ├── SettingsModal.tsx    # 設定モーダル
│   │   └── OrientationGuide.tsx # 横向き案内
│   │
│   ├── game/                     # ゲーム専用コンポーネント
│   │   ├── Board.tsx            # ゲームボード
│   │   ├── Cell.tsx             # マス
│   │   ├── Ship.tsx             # 乗り物
│   │   ├── HUD.tsx              # ヘッドアップディスプレイ
│   │   ├── TurnIndicator.tsx   # ターン表示
│   │   ├── SkillPanel.tsx       # スキルパネル
│   │   ├── SkillModal.tsx       # スキルモーダル
│   │   ├── PauseMenu.tsx        # ポーズメニュー
│   │   └── HPBar.tsx            # HPバー
│   │
│   ├── effects/                  # エフェクトコンポーネント
│   │   ├── HitEffect.tsx        # ヒットエフェクト
│   │   ├── MissEffect.tsx       # ミスエフェクト
│   │   ├── SinkEffect.tsx       # 撃沈エフェクト
│   │   ├── ShieldEffect.tsx     # シールドエフェクト
│   │   ├── BombEffect.tsx       # ボムエフェクト
│   │   └── ScanEffect.tsx       # スキャンエフェクト
│   │
│   ├── character/                # キャラクター関連
│   │   └── CharacterPortrait.tsx # キャラクター立ち絵
│   │
│   └── reward/                   # 報酬システムUI
│       ├── CoinRewardDisplay.tsx # コイン報酬表示
│       ├── TitleUnlockModal.tsx  # 称号解放モーダル
│       ├── ShopItem.tsx          # ショップアイテム
│       ├── StatsDisplay.tsx      # 統計表示
│       └── TitleBadge.tsx        # 称号バッジ
│
├── lib/                           # ビジネスロジック
│   ├── game/                     # ゲームロジック
│   │   ├── board.ts             # ボード管理
│   │   ├── gameLogic.ts         # ゲーム進行
│   │   ├── validation.ts        # バリデーション
│   │   ├── ships.ts             # 乗り物定義
│   │   ├── characters.ts        # キャラクター定義
│   │   ├── skills.ts            # スキル定義
│   │   └── skillEffects.ts      # スキル実行
│   │
│   ├── ai/                       # CPU AI
│   │   └── cpuAI.ts             # CPU思考ロジック
│   │
│   ├── p2p/                      # P2P通信
│   │   └── peerManager.ts       # Peer接続管理
│   │
│   ├── reward/                   # 報酬システム
│   │   ├── coinCalculator.ts   # コイン計算
│   │   ├── titleManager.ts     # 称号管理
│   │   ├── shopManager.ts      # ショップ管理
│   │   ├── statsManager.ts     # 統計管理
│   │   └── definitions/        # 定義ファイル
│   │       ├── titles.ts       # 称号定義
│   │       └── skins.ts        # スキン定義
│   │
│   ├── sound/                    # サウンド管理
│   │   └── soundManager.ts      # Howler.js統合
│   │
│   └── utils/                    # ユーティリティ
│       └── constants.ts         # 定数定義
│
├── store/                         # Zustand状態管理
│   ├── gameStore.ts              # ゲーム状態
│   ├── uiStore.ts                # UI状態
│   └── p2pStore.ts               # P2P状態
│
└── types/                         # TypeScript型定義
    ├── game.ts                   # ゲーム型
    ├── p2p.ts                    # P2P型
    └── ui.ts                     # UI型
```

---

## 主要モジュール

### ゲームロジック（lib/game/）

#### board.ts
```typescript
// ボード管理の主要関数
export function createEmptyBoard(): Board
export function canPlaceShip(board, ship, position, direction): boolean
export function placeShip(board, ship, position, direction): Board
export function clearShipFromBoard(board, shipId): Board
```

#### gameLogic.ts
```typescript
// ゲーム進行の主要関数
export function initializeGame(players, mode): GameState
export function executeAttack(gameState, targetPosition): AttackResult
export function checkGameEnd(gameState): boolean
export function processTurn(gameState, action): GameState
```

#### skillEffects.ts
```typescript
// スキル実行の主要関数
export function executeSkill(skillType, gameState, data): SkillResult
export function executeStrawberryShield(gameState, playerId): SkillResult
export function executeChocolateBomb(gameState, position): SkillResult
export function executeSweetEscape(gameState, shipId, position): SkillResult
export function executeWaffleScan(gameState, position): SkillResult
```

### AI（lib/ai/）

#### cpuAI.ts
```typescript
export interface CPUDifficulty {
  name: string;
  attackStrategy: (gameState: GameState) => Position;
}

// 3段階の難易度実装
export const CPU_DIFFICULTIES = {
  easy: easyAI,      // ランダム攻撃
  normal: normalAI,  // ヒット後周辺探索
  hard: hardAI       // 戦略的攻撃
};
```

### P2P通信（lib/p2p/）

#### peerManager.ts
```typescript
export class PeerManager {
  async createRoom(): Promise<string>           // ルーム作成
  async joinRoom(roomId: string): Promise<void> // ルーム参加
  sendAction(action: GameAction): void          // アクション送信
  onReceiveAction(callback): void               // アクション受信
  disconnect(): void                             // 切断
}
```

### 報酬システム（lib/reward/）

#### coinCalculator.ts
```typescript
export interface CoinReward {
  baseAmount: number;
  bonuses: Bonus[];
  totalAmount: number;
}

export function calculateCoinReward(
  result: GameResult,
  gameState: GameState,
  mode: GameMode
): CoinReward
```

#### titleManager.ts
```typescript
export function checkTitleUnlocks(): Title[]
export function unlockTitle(titleId: string): boolean
export function equipTitle(titleId: string): void
export function getEquippedTitle(): Title | null
```

---

## 状態管理

### Zustand Store構造

#### gameStore.ts
```typescript
interface GameStore {
  // 状態
  gameState: GameState | null;
  localPlayerId: string | null;
  mode: GameMode | null;

  // アクション
  initializeGame: (players, mode) => void;
  attack: (position) => void;
  useSkill: (skillType, data) => void;
  endTurn: () => void;

  // 計算済み値
  isMyTurn: () => boolean;
  canAttack: (position) => boolean;
}
```

#### uiStore.ts
```typescript
interface UIStore {
  // 状態
  notifications: Notification[];
  selectedShip: ShipType | null;
  isLoading: boolean;

  // アクション
  addNotification: (notification) => void;
  removeNotification: (id) => void;
  selectShip: (shipType) => void;
  setLoading: (loading) => void;
}
```

#### p2pStore.ts
```typescript
interface P2PStore {
  // 状態
  peerId: string | null;
  connectedPeer: string | null;
  connectionStatus: ConnectionStatus;

  // アクション
  createRoom: () => Promise<string>;
  joinRoom: (roomId) => Promise<void>;
  sendMessage: (message) => void;
  disconnect: () => void;
}
```

---

## P2P通信

### WebRTC接続フロー

```
Host                          Guest
  │                             │
  ├─ createRoom()              │
  ├─ PeerServer connection     │
  ├─ Get Room ID               │
  ├─ Share Room ID ────────────┤
  │                             ├─ joinRoom(id)
  │                             ├─ PeerServer connection
  ├─ Accept connection  ◄──────┤
  ├─ Establish DataChannel ────┤
  │                             │
  ├─ Send GameAction ──────────┤
  │◄─────────────── Send GameAction
  │                             │
```

### メッセージ形式

```typescript
interface P2PMessage {
  type: 'game-action' | 'chat' | 'sync' | 'disconnect';
  payload: any;
  timestamp: number;
}

interface GameActionMessage extends P2PMessage {
  type: 'game-action';
  payload: {
    action: 'attack' | 'skill' | 'endTurn';
    data: any;
  };
}
```

### エラーハンドリング

```typescript
// 接続エラー
peer.on('error', (error) => {
  if (error.type === 'peer-unavailable') {
    // ルームが見つからない
  } else if (error.type === 'network') {
    // ネットワークエラー
  }
});

// 切断処理
connection.on('close', () => {
  // 相手が切断した
  showDisconnectModal();
});
```

---

## ゲームロジック

### ゲーム状態の型定義

```typescript
interface GameState {
  players: {
    [playerId: string]: PlayerState;
  };
  currentTurn: string;
  turnCount: number;
  phase: 'setup' | 'battle' | 'end';
  winner: string | null;
}

interface PlayerState {
  playerId: string;
  board: Board;
  ships: Ship[];
  skills: SkillState[];
  hp: number;
}

type Board = CellState[][];  // 10x10

interface CellState {
  attacked: boolean;
  shipId: string | null;
  hitIndex: number | null;
}
```

### 攻撃処理フロー

```
1. バリデーション
   ├─ 自分のターンか
   ├─ 攻撃済みでないか
   └─ 有効な位置か

2. 攻撃実行
   ├─ セル状態更新
   ├─ 判定（miss/hit/sunk）
   └─ HP計算

3. 結果処理
   ├─ エフェクト表示
   ├─ 連続攻撃判定
   └─ 勝敗判定

4. ターン管理
   ├─ ヒット時：継続
   ├─ ミス時：交代
   └─ 撃沈時：継続
```

### スキル実行フロー

```
1. バリデーション
   ├─ スキル使用可能か
   ├─ 対応乗り物が生存か
   └─ 使用済みでないか

2. スキル実行
   ├─ タイプ別処理
   ├─ ゲーム状態更新
   └─ エフェクト表示

3. 状態更新
   ├─ 使用済みフラグ
   ├─ ターン処理
   └─ 通知表示
```

---

## パフォーマンス最適化

### React最適化

```typescript
// メモ化
const MemoizedCell = React.memo(Cell, (prev, next) => {
  return prev.state === next.state && prev.onClick === next.onClick;
});

// useMemo
const attackablePositions = useMemo(() => {
  return calculateAttackablePositions(gameState);
}, [gameState]);

// useCallback
const handleCellClick = useCallback((position) => {
  if (canAttack(position)) {
    attack(position);
  }
}, [canAttack, attack]);
```

### バンドル最適化

```javascript
// next.config.js
module.exports = {
  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // コード分割
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};
```

### レンダリング最適化

- **仮想化**: 大量のリストはreact-window使用
- **遅延読み込み**: next/dynamicで動的インポート
- **画像最適化**: next/imageで自動最適化

---

## セキュリティ

### XSS対策
- Reactの自動エスケープ
- dangerouslySetInnerHTMLは使用しない
- ユーザー入力のサニタイズ

### CSRF対策
- P2P通信のため不要
- APIがある場合はトークン必須

### データ検証
```typescript
// クライアント側バリデーション
function validateGameAction(action: GameAction): boolean {
  if (action.type === 'attack') {
    return isValidPosition(action.position);
  }
  return true;
}

// サーバー側バリデーション（P2Pなし）
// 将来的にゲームサーバー実装時に必要
```

### LocalStorage
```typescript
// XSS対策
function sanitizeData(data: any): any {
  // HTMLタグ削除
  // スクリプトタグ削除
  return data;
}

// データ暗号化（将来実装）
function encryptData(data: any): string {
  return btoa(JSON.stringify(data));
}
```

---

## 今後の拡張

### フェーズ2: 追加機能
- [ ] ランキング機能（バックエンド必要）
- [ ] 戦績グラフ表示
- [ ] キャラクターパッシブ能力
- [ ] 称号の追加（10種類）
- [ ] スキンの追加（各キャラ3種類）

### フェーズ3: ゲームシステム拡張
- [ ] 乗り物の種類増加（8-10種類）
- [ ] 自由編成システム
- [ ] 新キャラクター追加
- [ ] ボードテーマ機能
- [ ] エフェクトカスタマイズ

### フェーズ4: ソーシャル機能
- [ ] トーナメントモード
- [ ] フレンドシステム
- [ ] チャット機能
- [ ] リプレイ機能
- [ ] 戦績共有機能

### 技術的改善
- [ ] WebSocketによる安定した通信
- [ ] ゲームサーバー実装（チート対策）
- [ ] Progressive Web App対応
- [ ] オフラインモード
- [ ] マルチプラットフォーム対応

---

## 参考資料

### 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [PeerJS Documentation](https://peerjs.com/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### 開発ツール
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

**最終更新**: 2025-11-06
**バージョン**: 1.0.0
