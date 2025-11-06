# 🍰 SweetsShipStrike（スイーツシップストライク）

スイーツをモチーフにしたバトルシップ風の海戦ゲーム。可愛いキャラクターたちが乗り物に乗り込み、海上で戦います！

![Version](https://img.shields.io/badge/version-1.0.0-pink)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 ゲーム概要

SweetsShipStrikeは、バトルシップ（海戦ゲーム）のルールをベースに、スイーツキャラクターの世界観で楽しめる対戦ゲームです。

### 特徴

- 🌐 **オンライン対戦**: PeerJSを使ったP2P通信でリアルタイム対戦
- 🤖 **CPU対戦**: 3段階の難易度でAI対戦
- ✨ **スキルシステム**: 4種類の特殊スキルで戦略的なバトル
- 💰 **報酬システム**: コイン獲得、称号解放、スキン購入
- 📱 **レスポンシブ対応**: PC・タブレット・スマホに対応
- 🎨 **リッチアニメーション**: Framer Motionによる滑らかなエフェクト

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/Nakako0281/SweetsShipStrike.git
cd SweetsShipStrike

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてゲームをプレイできます。

## 📖 使い方

### 基本ルール

1. **配置フェーズ**: 4種類の乗り物を10×10のボードに配置
2. **攻撃フェーズ**: ターン制で相手のボードを攻撃
3. **連続攻撃**: ヒットすると同じターンでもう一度攻撃可能
4. **勝利条件**: 相手の乗り物をすべて撃沈

### 乗り物の種類

| 乗り物 | サイズ | 説明 |
|--------|--------|------|
| 🍓 イチゴボート | 4マス | 最大の乗り物 |
| 🍫 ココア潜水艇 | 3マス | 中型の乗り物 |
| 🧁 マカロン円盤 | 3マス | 中型の乗り物 |
| 🧇 ワッフル艦 | 2マス | 最小の乗り物 |

### スキルシステム

- 🛡️ **ストロベリーシールド**: 次の1回の攻撃を無効化
- 💣 **チョコレートボム**: 2×2の範囲を一度に攻撃
- 🌀 **スイートエスケープ**: 乗り物を別の場所に移動
- 📡 **格子スキャン**: 十字範囲の情報を取得

各スキルは1回のみ使用可能。乗り物が撃沈されるとそのスキルは使えなくなります。

## 🏗️ 技術スタック

### フロントエンド

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 4.0
- **Animation**: Framer Motion 11.0
- **State Management**: Zustand 5.0

### P2P通信

- **Library**: PeerJS 1.5
- **Server**: カスタムPeerServer（Render.comにデプロイ）

### 開発ツール

- **Linter**: ESLint 9
- **Package Manager**: npm

## 📁 プロジェクト構造

```
SweetsShipStrike/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # タイトル画面
│   │   ├── game/              # ゲーム画面
│   │   ├── result/            # 結果画面
│   │   ├── shop/              # ショップ画面
│   │   ├── profile/           # プロフィール画面
│   │   └── help/              # ヘルプ画面
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/                # 汎用UIコンポーネント
│   │   ├── game/              # ゲーム専用コンポーネント
│   │   ├── effects/           # エフェクトコンポーネント
│   │   ├── character/         # キャラクター関連
│   │   └── reward/            # 報酬システムUI
│   ├── lib/                   # ビジネスロジック
│   │   ├── game/              # ゲームロジック
│   │   ├── ai/                # CPU AI
│   │   ├── p2p/               # P2P通信
│   │   ├── reward/            # 報酬システム
│   │   └── utils/             # ユーティリティ
│   ├── store/                 # Zustand状態管理
│   └── types/                 # TypeScript型定義
├── server/                    # PeerServer
│   └── server.js
└── public/                    # 静的ファイル
```

## 🎯 開発

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### 本番環境実行

```bash
npm run start
```

### Lint

```bash
npm run lint
```

### 型チェック

```bash
npx tsc --noEmit
```

## 🌐 デプロイ

### フロントエンド（Vercel）

1. Vercelにプロジェクトをインポート
2. 環境変数を設定:
   ```
   NEXT_PUBLIC_PEER_SERVER_HOST=your-peer-server.onrender.com
   NEXT_PUBLIC_PEER_SERVER_PORT=443
   NEXT_PUBLIC_PEER_SERVER_PATH=/peerjs
   ```
3. デプロイ

### PeerServer（Render.com）

1. `server/`ディレクトリをWebサービスとしてデプロイ
2. 環境変数を設定:
   ```
   PORT=9000
   NODE_ENV=production
   ```
3. デプロイ後、エンドポイントURLを取得

## 📝 設定

### 環境変数

`.env.local`ファイルを作成:

```env
# PeerServer設定
NEXT_PUBLIC_PEER_SERVER_HOST=localhost
NEXT_PUBLIC_PEER_SERVER_PORT=9000
NEXT_PUBLIC_PEER_SERVER_PATH=/peerjs
NEXT_PUBLIC_PEER_SERVER_SECURE=false

# 本番環境用
# NEXT_PUBLIC_PEER_SERVER_HOST=your-peer-server.onrender.com
# NEXT_PUBLIC_PEER_SERVER_PORT=443
# NEXT_PUBLIC_PEER_SERVER_SECURE=true
```

## 🎨 カスタマイズ

### キャラクター追加

1. `src/lib/game/characters.ts`に新しいキャラクター定義を追加
2. `src/types/game.ts`の`CharacterType`に型を追加
3. キャラクター画像を`public/characters/`に配置

### スキル追加

1. `src/lib/game/skills.ts`にスキル定義を追加
2. `src/lib/game/skillEffects.ts`にスキル実行ロジックを実装
3. エフェクトコンポーネントを`src/components/effects/`に作成

## 📊 開発進捗

**総進捗率**: 92.2% (141/153タスク完了)

### Week 1: 基盤構築 ✅ (90.0%)
- プロジェクトセットアップ
- 型定義作成
- 基本UI実装

### Week 2: ゲームプレイ実装 ✅ (88.9%)
- ゲームロジック
- CPU AI
- ゲームボードUI

### Week 3: スキル&オンライン対戦 ✅ (75.9%)
- スキルシステム
- P2P通信
- オンライン対戦

### Week 4: 仕上げ&報酬システム ✅ (100.0%)
- サウンド実装
- アニメーション
- 報酬システム（コイン・称号・ショップ）
- UI/UXブラッシュアップ

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは[MIT License](LICENSE)の下でライセンスされています。

## 👥 作者

- [@Nakako0281](https://github.com/Nakako0281)

## 🙏 謝辞

- バトルシップのゲームルール
- Next.jsコミュニティ
- PeerJSプロジェクト

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/Nakako0281/SweetsShipStrike/issues)を開いてください。

---

**開発状況**: MVP完成（進捗: 92.2%）
**最終更新**: 2025-11-06

Made with ❤️ and 🍰
