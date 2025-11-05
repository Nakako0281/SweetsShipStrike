# SweetsShipStrike 開発タスク管理

## 📋 プロジェクト情報
- **プロジェクト名**: SweetsShipStrike
- **開発期間**: 約1ヶ月（4週間）
- **技術スタック**: Next.js 14, TypeScript, Tailwind CSS, PeerJS, Zustand

---

## 🎯 Week 1：基盤構築

### 1. プロジェクトセットアップ
- [x] Next.js 14プロジェクト作成
- [x] TypeScript設定
- [x] Tailwind CSS設定
- [x] 必要な依存関係インストール
  - [x] PeerJS
  - [x] Zustand
  - [x] Framer Motion
  - [x] Howler.js
- [x] ESLint / Prettier設定
- [x] Git初期化とリポジトリ作成

### 2. 型定義作成
- [x] `src/types/game.ts` 作成
  - [x] 基本型（CharacterType, ShipType, Direction等）
  - [x] Position, Area, CellState
  - [x] Character, ShipDefinition, Ship
  - [x] SkillDefinition, SkillUseData, SkillResult
  - [x] PlayerState, GameState
  - [x] GameAction, AttackResult
- [x] `src/types/p2p.ts` 作成
  - [x] P2PConnection, P2PMessage
- [x] `src/types/ui.ts` 作成
  - [x] UIState, ModalType, Notification
  - [x] Title, CharacterSkin, PlayerStats
  - [x] GameResult, CoinReward

### 3. 定数・設定ファイル作成
- [x] `src/lib/utils/constants.ts` 作成
  - [x] ボードサイズ
  - [x] 乗り物定義
  - [x] キャラクター定義
  - [x] スキル定義
  - [x] タイマー設定
- [x] `src/lib/game/ships.ts` 作成
  - [x] 4種類の乗り物定義
- [x] `src/lib/game/characters.ts` 作成
  - [x] 7種類のキャラクター定義（プレイヤー4人 + CPU3人）
- [x] `src/lib/game/skills.ts` 作成
  - [x] 4種類のスキル定義

### 4. 基本UI実装
- [x] `src/app/layout.tsx` 設定
- [x] `src/components/layouts/Header.tsx` 作成
- [x] `src/components/layouts/Footer.tsx` 作成
- [x] `src/components/ui/Button.tsx` 作成
- [x] `src/components/ui/Modal.tsx` 作成
- [x] `src/components/ui/LoadingSpinner.tsx` 作成
- [x] `src/styles/globals.css` スタイル設定

### 5. タイトル画面実装
- [x] `src/app/page.tsx` 実装
  - [x] タイトルロゴ表示
  - [x] スタートボタン
  - [x] 設定ボタン
  - [x] BGM再生機能
- [ ] タイトル画面の背景画像配置

### 6. モード選択画面実装
- [x] `src/app/mode-select/page.tsx` 実装
  - [x] オンライン対戦ボタン
  - [x] CPU対戦ボタン
  - [x] 戻るボタン
  - [x] 画面遷移処理

---

## 🎮 Week 2：ゲームプレイ実装

### 7. ゲームロジック実装
- [x] `src/lib/game/board.ts` 作成
  - [x] `createEmptyBoard()` - 空のボード作成
  - [x] `canPlaceShip()` - 配置可能判定
  - [x] `placeShip()` - 乗り物配置
  - [x] `clearShipFromBoard()` - ボードから乗り物削除
- [x] `src/lib/game/validation.ts` 作成
  - [x] 配置バリデーション
  - [x] 攻撃バリデーション
  - [x] スキル使用バリデーション
- [x] `src/lib/game/gameLogic.ts` 作成
  - [x] `initializeGame()` - ゲーム初期化
  - [x] `createPlayerState()` - プレイヤー状態作成
  - [x] `createShips()` - 乗り物リスト生成
  - [x] `canAttack()` - 攻撃可能判定
  - [x] `executeAttack()` - 攻撃実行
  - [x] `calculateHitIndex()` - 被弾位置計算
  - [x] `markAsAttacked()` - 攻撃済み記録
  - [x] `calculateHP()` - HP計算
  - [x] `calculateRemainingMasses()` - 残存マス数計算
  - [x] `checkDefeat()` - 敗北判定
  - [x] `checkGameEnd()` - ゲーム終了判定
  - [x] `processTurn()` - ターン処理
  - [x] `endTurn()` - ターン終了
  - [x] `checkSetupComplete()` - 配置完了確認

### 8. スキルシステム実装
- [x] `src/lib/game/skillEffects.ts` 実装
  - [x] `executeSkill()` - スキル実行統合
  - [x] `executeStrawberryShield()` - ストロベリーシールド
  - [x] `executeChocolateBomb()` - チョコレートボム
  - [x] `executeSweetEscape()` - スイートエスケープ
  - [x] `executeWaffleScan()` - 格子スキャン

### 9. ゲームボードUI実装
- [x] `src/components/game/Board.tsx` 作成
  - [x] 10×10マスのグリッド表示
  - [x] 自分のボード / 相手のボード切り替え
  - [x] クリックイベント処理
- [x] `src/components/game/Cell.tsx` 作成
  - [x] マスの状態表示（empty, miss, hit, sunk）
  - [x] ホバーエフェクト
  - [x] クリックハンドラー
- [x] `src/components/game/Ship.tsx` 作成
  - [x] 乗り物画像表示
  - [x] 回転処理（縦/横）
  - [x] 被弾状態の視覚化

### 10. 配置フェーズUI実装
- [x] `src/app/ship-placement/page.tsx` 実装
  - [x] 未配置の乗り物リスト表示
  - [x] 乗り物選択UI
  - [x] 方向選択ボタン（縦/横）
  - [x] 配置プレビュー表示
  - [x] 配置完了ボタン
- [x] `src/components/ui/Timer.tsx` 作成
  - [x] 残り時間表示
  - [x] タイムアウト処理
- [x] 配置フェーズのタイマー機能実装
- [x] ランダム配置機能実装（タイムアウト時）

### 11. 戦闘フェーズUI実装
- [x] `src/components/game/HUD.tsx` 作成
  - [x] HP表示（自分・相手）
  - [x] 残存艦表示
  - [x] ターン表示
  - [x] プレイヤー名表示
- [x] `src/components/game/TurnIndicator.tsx` 作成
  - [x] 自分のターン / 相手のターン表示
  - [x] ターン数表示
- [x] 攻撃エフェクト実装
  - [x] `src/components/effects/HitEffect.tsx`
  - [x] `src/components/effects/MissEffect.tsx`
  - [x] `src/components/effects/SinkEffect.tsx`
- [x] 連続攻撃UI実装

### 12. CPU対戦AI実装
- [x] `src/lib/ai/cpuAI.ts` 作成
  - [x] CPU思考ロジック実装
  - [x] `getCPUAttackPosition()` - 攻撃位置選択
  - [x] 難易度別AI実装（よわい/ふつう/つよい）
  - [x] ランダム配置機能

### 13. キャラクター選択画面実装
- [x] `src/app/character-select/page.tsx` 実装
  - [x] プレイヤーキャラ選択UI（4人）
  - [x] キャラクター情報表示
  - [x] 選択確定処理
- [x] `src/app/cpu-difficulty/page.tsx` 実装
  - [x] CPU難易度選択UI（3段階）
  - [x] 難易度表示

### 14. ゲーム画面統合
- [x] `src/app/game/page.tsx` 実装
  - [x] 配置フェーズ表示
  - [x] 戦闘フェーズ表示
  - [x] フェーズ切り替え処理
  - [x] ゲーム状態管理
  - [x] CPU対戦ロジック統合

---

## 🌐 Week 3：スキル&オンライン対戦

### 15. スキルパネルUI実装
- [x] `src/components/game/SkillPanel.tsx` 作成
  - [x] 4つのスキルボタン表示
  - [x] スキル名・説明表示
  - [x] 使用可/使用済み/撃沈の視覚化
  - [x] スキル選択処理
- [x] `src/components/game/SkillModal.tsx` 作成
  - [x] スキル確認モーダル
  - [x] スキル使用時のエフェクト

### 16. スキル実装の完成
- [x] シールド機能のUI統合
- [x] チョコレートボムのエリア選択UI
- [x] スイートエスケープの移動UI
- [x] 格子スキャンの結果表示UI
- [ ] スキル使用時のサウンド実装

### 17. P2P通信基盤実装
- [x] PeerServerのセットアップ（Render）
  - [x] `server.js` 作成
  - [x] `package.json` 作成
  - [x] Renderデプロイ設定
- [x] `src/lib/p2p/peerManager.ts` 作成
  - [x] Peer初期化
  - [x] 接続確立処理
  - [x] 接続エラーハンドリング
  - [x] 接続切断処理
  - [x] メッセージ送信機能
  - [x] メッセージ受信機能

### 18. オンラインロビー実装
- [x] `src/app/online-lobby/page.tsx` 実装
  - [x] ホスト側UI（ルーム作成）
  - [x] ゲスト側UI（ルーム参加）
  - [x] PeerID表示
  - [x] 招待URLコピー機能
  - [x] 接続待機UI
  - [x] 接続成功時の遷移処理

### 19. オンライン対戦機能統合
- [x] ゲームアクションの送受信実装
  - [x] 攻撃アクション送信
  - [x] スキル使用アクション送信
  - [x] 配置アクション送信
  - [x] ターン終了アクション送信
- [x] ゲーム状態の同期処理
- [x] 接続切断時の処理
- [x] エラーハンドリング

### 20. 状態管理実装（Zustand）
- [x] `src/store/gameStore.ts` 作成
  - [x] ゲーム状態管理
  - [x] アクション定義
  - [x] ゲームロジック統合
- [x] `src/store/uiStore.ts` 作成
  - [x] UI状態管理
  - [x] モーダル管理
  - [x] 通知管理
- [x] `src/store/p2pStore.ts` 作成
  - [x] P2P接続状態管理

---

## 🎨 Week 4：仕上げ&デバッグ&報酬システム

### 21. サウンド実装
- [x] `src/lib/sound/soundManager.ts` 作成
  - [x] Howler.js統合
  - [x] BGM管理
  - [x] SE管理
  - [x] 音量調整機能
  - [x] ミュート機能
- [ ] BGM素材の配置
  - [ ] タイトルBGM
  - [ ] 戦闘BGM
- [ ] SE素材の配置
  - [ ] クリック音
  - [ ] ヒット音
  - [ ] ミス音
  - [ ] 撃沈音
  - [ ] スキル使用音
  - [ ] 勝利音

### 22. アニメーション実装（Framer Motion）
- [ ] ボタンホバーアニメーション
- [ ] 画面遷移アニメーション
- [ ] 攻撃エフェクトアニメーション
- [ ] 撃沈エフェクトアニメーション
- [ ] スキルエフェクトアニメーション
- [ ] モーダル表示アニメーション
- [ ] HP減少アニメーション

### 23. 結果画面実装
- [x] `src/app/result/page.tsx` 実装
  - [x] 勝敗表示
  - [x] 勝者のキャラクター画像
  - [x] 戦績表示（ターン数等）
  - [x] リマッチボタン（オンライン対戦）
  - [x] タイトルに戻るボタン
  - [ ] 結果演出アニメーション

### 24. 報酬システム実装（MVP拡張版）

#### 24.1 コイン獲得システム
- [x] `src/lib/reward/coinCalculator.ts` 作成
  - [x] `calculateCoinReward()` - コイン報酬計算
  - [x] 基本報酬計算
  - [x] ボーナス報酬計算（オンライン/速攻/完全勝利/逆転/全スキル）
  - [x] `addCoins()` - コイン付与
  - [x] `spendCoins()` - コイン消費

#### 24.2 称号システム
- [x] `src/lib/reward/titleManager.ts` 作成
  - [x] `unlockTitle()` - 称号解放
  - [x] `equipTitle()` - 称号装備
  - [x] `checkTitleUnlocks()` - 称号解放チェック
- [x] `src/lib/reward/definitions/titles.ts` 作成
  - [x] MVP版称号定義（「初勝利」）
  - [x] 将来実装用の拡張可能な設計

#### 24.3 ショップシステム
- [x] `src/lib/reward/shopManager.ts` 作成
  - [x] `purchaseSkin()` - スキン購入
  - [x] `equipSkin()` - スキン装備
  - [x] `getShopItems()` - ショップアイテム一覧取得
- [x] `src/lib/reward/definitions/skins.ts` 作成
  - [x] MVP版スキン定義（サマーバージョン1つ）
  - [x] デフォルトスキン定義

#### 24.4 統計管理
- [x] `src/lib/reward/statsManager.ts` 作成
  - [x] `updateGameStats()` - 統計更新
  - [x] `checkPerfectWin()` - 完全勝利判定
  - [x] `checkAllSkillsUsed()` - 全スキル使用判定
  - [x] `checkComebackWin()` - 逆転勝利判定
  - [x] `loadPlayerStats()` - 統計読み込み
  - [x] `savePlayerStats()` - 統計保存
  - [x] `createDefaultPlayerStats()` - デフォルト統計作成
  - [x] `resetPlayerStats()` - 統計リセット（デバッグ用）

#### 24.5 ゲーム終了処理統合
- [x] `onGameFinished()` 実装
  - [x] ゲーム結果作成
  - [x] 統計更新
  - [x] コイン獲得処理
  - [x] 称号解放チェック
  - [x] 結果画面遷移

#### 24.6 報酬UI実装
- [x] `src/components/reward/CoinRewardDisplay.tsx` 作成
  - [x] コイン獲得演出
  - [x] 内訳表示
  - [x] アニメーション
- [x] `src/components/reward/TitleUnlockModal.tsx` 作成
  - [x] 称号獲得モーダル
  - [x] 称号情報表示
  - [x] 演出アニメーション
- [x] 結果画面へのコイン獲得表示統合
- [x] 結果画面への称号獲得モーダル統合

#### 24.7 ショップ画面実装
- [x] `src/app/shop/page.tsx` 実装
  - [x] 所持コイン表示
  - [x] アイテムリスト表示
  - [x] 購入処理
  - [x] 購入確認モーダル
  - [x] 購入完了演出
  - [x] 戻るボタン
- [x] `src/components/reward/ShopItem.tsx` 作成
  - [x] アイテムカード
  - [x] スキンプレビュー
  - [x] 価格表示
  - [x] レアリティ表示
  - [x] 購入ボタン / 所持中バッジ

#### 24.8 プロフィール画面実装
- [x] `src/app/profile/page.tsx` 実装
  - [x] キャラクター画像表示
  - [x] 装備中称号表示
  - [x] 統計表示
  - [x] 称号変更ボタン
  - [x] 戻るボタン
- [x] `src/components/reward/StatsDisplay.tsx` 作成
  - [x] 統計情報表示
  - [x] 勝率グラフ（将来実装用）
- [x] `src/components/reward/TitleBadge.tsx` 作成
  - [x] 称号バッジ表示
  - [x] レアリティ表示
- [x] 称号変更モーダル実装
  - [x] 解放済み称号一覧
  - [x] 未解放称号（ロック表示）
  - [x] 装備処理

#### 24.9 タイトル画面への報酬機能統合
- [x] タイトル画面に所持コイン表示追加
- [x] ショップボタン追加
- [x] プロフィールボタン追加
- [x] 画面遷移処理追加

### 25. キャラクター画像実装
- [x] `src/components/character/CharacterPortrait.tsx` 作成
  - [x] 対戦中のキャラ立ち絵表示
  - [x] 装備中スキンの反映
- [x] ゲーム画面へのキャラクター立ち絵統合
- [x] 結果画面へのキャラクター画像統合

### 26. レスポンシブ対応
- [ ] モバイル対応のレイアウト調整
- [ ] タッチ操作対応
- [ ] ボタンサイズ調整
- [ ] ボードサイズの画面サイズ対応
- [ ] 横向き推奨の案内表示

### 27. UI/UXブラッシュアップ
- [ ] ローディング画面実装
- [ ] トランジション効果追加
- [ ] 通知システム実装
- [ ] ポーズメニュー実装
- [ ] 設定モーダル実装（サウンド設定）
- [ ] ヘルプ/チュートリアル（簡易版）

### 28. デバッグ&テスト
- [ ] 配置フェーズのテスト
  - [ ] 正常配置（縦/横）
  - [ ] 範囲外配置エラー
  - [ ] 重複配置エラー
  - [ ] タイムアウト処理
- [ ] 攻撃フェーズのテスト
  - [ ] ミス判定
  - [ ] ヒット判定
  - [ ] 撃沈判定
  - [ ] 連続攻撃
  - [ ] 重複攻撃防止
- [ ] スキルのテスト
  - [ ] ストロベリーシールド
  - [ ] チョコレートボム
  - [ ] スイートエスケープ
  - [ ] 格子スキャン
  - [ ] 使用済みスキル制限
  - [ ] 撃沈後の使用不可
- [ ] CPU対戦のテスト
  - [ ] CPU配置AI
  - [ ] CPU攻撃AI
  - [ ] CPUスキル使用
- [ ] オンライン対戦のテスト
  - [ ] ルーム作成・参加
  - [ ] P2P通信
  - [ ] ゲーム状態同期
  - [ ] 接続切断処理
- [ ] 報酬システムのテスト
  - [ ] コイン獲得計算
  - [ ] 称号解放
  - [ ] ショップ購入
  - [ ] 統計記録
  - [ ] LocalStorage保存/読み込み
- [ ] 勝敗判定のテスト
- [ ] エラーハンドリングのテスト

### 29. デプロイ準備
- [ ] 環境変数設定
  - [ ] `.env.local` 作成
  - [ ] `.env.production` 作成
  - [ ] PeerServerの設定
- [ ] `next.config.js` 設定
- [ ] 本番ビルドテスト
- [ ] パフォーマンス最適化
  - [ ] 画像最適化
  - [ ] コード分割確認
  - [ ] バンドルサイズ確認

### 30. デプロイ
- [ ] GitHubリポジトリ作成
- [ ] PeerServerデプロイ（Render）
  - [ ] サーバー起動確認
  - [ ] エンドポイントテスト
- [ ] フロントエンドデプロイ（Vercel）
  - [ ] Vercelプロジェクト作成
  - [ ] 環境変数設定
  - [ ] ビルド&デプロイ
  - [ ] 本番環境テスト

---

## 🎨 アセット作成タスク

### 必須画像素材
- [ ] キャラクター全身画像（7枚）
  - [ ] ショートケーキちゃん
  - [ ] チョコレートちゃん
  - [ ] マカロンちゃん
  - [ ] プリンちゃん
  - [ ] CPU（よわい）
  - [ ] CPU（ふつう）
  - [ ] CPU（つよい）
- [ ] キャラクター真上画像（7枚）
- [ ] 乗り物真上画像（4枚）
  - [ ] イチゴボート
  - [ ] ココア潜水艇
  - [ ] マカロン円盤
  - [ ] ワッフル艦
- [ ] エフェクト画像
  - [ ] ヒット
  - [ ] ミス
  - [ ] 撃沈
  - [ ] スキルエフェクト（4種）
- [ ] UI画像
  - [ ] ボタン（通常/ホバー）
  - [ ] ボード背景
- [ ] 背景画像
  - [ ] タイトル背景
  - [ ] ゲーム背景

### MVP拡張版の追加素材
- [ ] 称号アイコン（1枚）
  - [ ] 初勝利アイコン
- [ ] キャラスキン（2枚）
  - [ ] サマーバージョン全身
  - [ ] サマーバージョン真上
- [ ] UIアイコン
  - [ ] コインアイコン

### サウンド素材
- [ ] BGM
  - [ ] タイトルBGM
  - [ ] 戦闘BGM
- [ ] SE
  - [ ] クリック音
  - [ ] ヒット音
  - [ ] ミス音
  - [ ] 撃沈音
  - [ ] スキル使用音
  - [ ] 勝利音
- [ ] 報酬SE（オプション）
  - [ ] コイン獲得音
  - [ ] 称号獲得音
  - [ ] 購入音

---

## 📝 ドキュメント作成

- [ ] README.md 作成
  - [ ] プロジェクト概要
  - [ ] セットアップ手順
  - [ ] 開発環境構築
  - [ ] デプロイ方法
- [ ] 操作説明書作成（簡易版）
- [ ] 技術ドキュメント整理

---

## 🚀 将来の拡張予定（フェーズ2以降）

### フェーズ2
- [ ] ランキング機能
- [ ] 戦績グラフ表示
- [ ] キャラクターのパッシブ能力実装
- [ ] 称号の追加（10種類）
- [ ] スキンの追加（各キャラ3種類）
- [ ] 詳細統計の実装

### フェーズ3
- [ ] 乗り物の種類を増やす（8-10種類）
- [ ] 自由編成システム
- [ ] 新キャラクター追加
- [ ] ボードテーマ機能
- [ ] エフェクトカスタマイズ

### フェーズ4
- [ ] トーナメントモード
- [ ] フレンドシステム
- [ ] チャット機能
- [ ] リプレイ機能
- [ ] 戦績共有機能

---

## 📊 進捗管理

### Week 1 進捗
- 完了: 27/30タスク (90.0%)
- 進行中: 0タスク
- 未着手: 3タスク

### Week 2 進捗
- 完了: 32/36タスク (88.9%)
- 進行中: 0タスク
- 未着手: 4タスク

### Week 3 進捗
- 完了: 22/29タスク (75.9%)
- 進行中: 0タスク
- 未着手: 7タスク

### Week 4 進捗
- 完了: 47/58タスク (81.0%)
- 進行中: 0タスク
- 未着手: 11タスク

### 総進捗
- 完了: 128/153タスク (83.7%)
- 進行中: 0タスク
- 未着手: 25タスク

---

## 🎯 優先度

### 🔴 最優先（MVP必須）
- プロジェクトセットアップ
- 型定義作成
- 基本UI実装
- ゲームロジック実装
- CPU対戦機能
- P2P通信実装
- オンライン対戦機能

### 🟡 重要（MVP拡張版）
- 報酬システム全般
- ショップ機能
- プロフィール機能
- アニメーション
- サウンド実装

### 🟢 推奨
- レスポンシブ対応
- UI/UXブラッシュアップ
- チュートリアル

---

**更新日**: 2025-11-05
