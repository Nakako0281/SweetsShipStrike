# SweetsShipStrike - スイーツシップストライク

バトルシップのゲームシステムをベースに、スイーツ擬人化の世界観で対戦するWebゲーム

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 概要

SweetsShipStriteは、古典的なバトルシップ（戦艦ゲーム）をベースにした対戦型Webゲームです。スイーツをテーマにしたキャラクターと乗り物を使って、オンライン対戦やCPU対戦を楽しめます。

### 主な特徴

- 🍰 **スイーツテーマ**: かわいいスイーツキャラクターと乗り物
- 🌐 **オンライン対戦**: P2P通信による1対1のリアルタイム対戦
- 🤖 **CPU対戦**: 3段階の難易度（Easy/Normal/Hard）
- ⚡ **スキルシステム**: 各乗り物固有の特殊能力
- 🎨 **美しいUI**: Framer Motionによる滑らかなアニメーション
- 🔊 **サウンド**: BGMと効果音による臨場感

## 🚀 技術スタック

### フロントエンド

- **Next.js 16**: React フレームワーク（App Router）
- **TypeScript**: 型安全な開発
- **Tailwind CSS v4**: ユーティリティファーストCSS
- **Framer Motion**: アニメーションライブラリ

### 状態管理・通信

- **Zustand**: 軽量な状態管理
- **PeerJS**: P2P通信（WebRTC）

### サウンド・その他

- **Howler.js**: サウンド管理
- **Jest**: テスティングフレームワーク
- **Testing Library**: Reactコンポーネントテスト

## 📦 セットアップ

### 必要環境

- Node.js 20.x 以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/SweetsShipStrike.git
cd SweetsShipStrike

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 🎯 ゲームルール

### 基本ルール

1. **配置フェーズ（60秒）**
   - 10×10のボードに4隻の乗り物を配置
   - 合計14マス分の乗り物を配置する必要があります
   - 乗り物同士は重ならないように配置

2. **戦闘フェーズ**
   - 交互にターンを繰り返す
   - 自分のターンで相手のボードを1マス攻撃
   - 相手の乗り物を全て撃沈すれば勝利

3. **スキル**
   - 各乗り物は固有のスキルを1回だけ使用可能
   - 撃沈された乗り物のスキルは使用不可

### 乗り物とスキル

| 乗り物 | サイズ | スキル | 効果 |
|--------|--------|--------|------|
| イチゴボート | 3マス | ストロベリーシールド | 次の攻撃を無効化（防御） |
| ココア潜水艇 | 5マス | チョコレートボム | 3×3エリアを攻撃（攻撃） |
| マカロン円盤 | 4マス | スイートエスケープ | 乗り物を移動（補助） |
| ワッフル艦 | 2マス | 格子スキャン | 格子状にスキャン（偵察） |

### キャラクター

**プレイアブル（4人）**
- ショートケーキちゃん
- チョコレートちゃん
- マカロンちゃん
- プリンちゃん

**CPU（3難易度）**
- クッキーくん（Easy）
- ドーナツちゃん（Normal）
- タルトさん（Hard）

## 🛠️ 開発

### プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # タイトル画面
│   ├── mode-select/       # モード選択
│   ├── character-select/  # キャラクター選択
│   ├── online-lobby/      # オンラインロビー
│   ├── ship-placement/    # 配置画面
│   ├── game/             # ゲーム画面
│   └── result/           # リザルト画面
├── components/            # Reactコンポーネント
│   ├── game/             # ゲーム関連コンポーネント
│   ├── ui/               # 汎用UIコンポーネント
│   ├── effects/          # エフェクトコンポーネント
│   └── layouts/          # レイアウトコンポーネント
├── lib/                   # ビジネスロジック
│   ├── game/             # ゲームロジック
│   ├── ai/               # CPU AI
│   ├── p2p/              # P2P通信
│   └── sound/            # サウンド管理
├── store/                 # Zustand ストア
├── types/                 # TypeScript型定義
└── hooks/                 # カスタムフック
```

### 利用可能なコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# Lint
npm run lint
```

### テスト

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test board.test.ts

# カバレッジレポート生成
npm test -- --coverage
```

現在のテストカバレッジ: **39/39 テスト成功 ✅**

## 🎨 機能一覧

### 実装済み ✅

- [x] プロジェクトセットアップ
- [x] 型定義（Game, P2P, UI）
- [x] 定数・設定ファイル
- [x] 基本UIコンポーネント
- [x] 全画面実装（タイトル〜リザルト）
- [x] ボード管理ロジック
- [x] バリデーションロジック
- [x] ゲームロジック
- [x] CPU AI（3難易度）
- [x] Zustand ストア（Game, P2P, UI）
- [x] P2P通信基盤
- [x] スキルシステム
- [x] サウンド管理システム
- [x] エフェクトコンポーネント
- [x] テスト環境構築

### 実装予定 🚧

- [ ] ゲーム画面への統合
- [ ] P2Pオンライン対戦の統合
- [ ] サウンドファイルの配置
- [ ] アニメーションの追加
- [ ] 報酬システム（MVP拡張版）
- [ ] レスポンシブ対応の最適化
- [ ] デプロイ

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT License

## 🙏 謝辞

- デザインインスピレーション: 古典的なバトルシップゲーム
- 技術スタック: Next.js, Vercel, PeerJS コミュニティ

---

**開発状況**: MVP開発中（進捗: 約30%）
**作成者**: SweetsShipStrike Development Team
**最終更新**: 2025-01-11
