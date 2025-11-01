# SweetsShipStrike 開発タスク管理

## 📋 プロジェクト情報
- **プロジェクト名**: SweetsShipStrike
- **開発期間**: 約1ヶ月（4週間）
- **技術スタック**: Next.js 14, TypeScript, Tailwind CSS, PeerJS, Zustand

---

## 🎯 Week 1：基盤構築

### 1. プロジェクトセットアップ
- [ ] Next.js 14プロジェクト作成
- [ ] TypeScript設定
- [ ] Tailwind CSS設定
- [ ] 必要な依存関係インストール
  - [ ] PeerJS
  - [ ] Zustand
  - [ ] Framer Motion
  - [ ] Howler.js
- [ ] ESLint / Prettier設定
- [ ] Git初期化とリポジトリ作成

### 2. 型定義作成
- [ ] `src/types/game.ts` 作成
  - [ ] 基本型（CharacterType, ShipType, Direction等）
  - [ ] Position, Area, CellState
  - [ ] Character, ShipDefinition, Ship
  - [ ] SkillDefinition, SkillUseData, SkillResult
  - [ ] PlayerState, GameState
  - [ ] GameAction, AttackResult
- [ ] `src/types/p2p.ts` 作成
  - [ ] P2PConnection, P2PMessage
- [ ] `src/types/ui.ts` 作成
  - [ ] UIState, ModalType, Notification
  - [ ] Title, CharacterSkin, PlayerStats
  - [ ] GameResult, CoinReward

### 3. 定数・設定ファイル作成
- [ ] `src/lib/utils/constants.ts` 作成
  - [ ] ボードサイズ
  - [ ] 乗り物定義
  - [ ] キャラクター定義
  - [ ] スキル定義
  - [ ] タイマー設定
- [ ] `src/lib/game/ships.ts` 作成
  - [ ] 4種類の乗り物定義
- [ ] `src/lib/game/characters.ts` 作成
  - [ ] 7種類のキャラクター定義（プレイヤー4人 + CPU3人）
- [ ] `src/lib/game/skills.ts` 作成
  - [ ] 4種類のスキル定義

### 4. 基本UI実装
- [ ] `src/app/layout.tsx` 設定
- [ ] `src/components/layouts/Header.tsx` 作成
- [ ] `src/components/layouts/Footer.tsx` 作成
- [ ] `src/components/ui/Button.tsx` 作成
- [ ] `src/components/ui/Modal.tsx` 作成
- [ ] `src/components/ui/LoadingSpinner.tsx` 作成
- [ ] `src/styles/globals.css` スタイル設定

### 5. タイトル画面実装
- [ ] `src/app/page.tsx` 実装
  - [ ] タイトルロゴ表示
  - [ ] スタートボタン
  - [ ] 設定ボタン
  - [ ] BGM再生機能
- [ ] タイトル画面の背景画像配置

### 6. モード選択画面実装
- [ ] `src/app/mode-select/page.tsx` 実装
  - [ ] オンライン対戦ボタン
  - [ ] CPU対戦ボタン
  - [ ] 戻るボタン
  - [ ] 画面遷移処理

---

## 🎮 Week 2：ゲームプレイ実装

### 7. ゲームロジック実装
- [ ] `src/lib/game/board.ts` 作成
  - [ ] `createEmptyBoard()` - 空のボード作成
  - [ ] `canPlaceShip()` - 配置可能判定
  - [ ] `placeShip()` - 乗り物配置
  - [ ] `clearShipFromBoard()` - ボードから乗り物削除
- [ ] `src/lib/game/validation.ts` 作成
  - [ ] 配置バリデーション
  - [ ] 攻撃バリデーション
  - [ ] スキル使用バリデーション
- [ ] `src/lib/game/gameLogic.ts` 作成
  - [ ] `initializeGame()` - ゲーム初期化
  - [ ] `createPlayerState()` - プレイヤー状態作成
  - [ ] `createShips()` - 乗り物リスト生成
  - [ ] `canAttack()` - 攻撃可能判定
  - [ ] `executeAttack()` - 攻撃実行
  - [ ] `calculateHitIndex()` - 被弾位置計算
  - [ ] `markAsAttacked()` - 攻撃済み記録
  - [ ] `calculateHP()` - HP計算
  - [ ] `calculateRemainingMasses()` - 残存マス数計算
  - [ ] `checkDefeat()` - 敗北判定
  - [ ] `checkGameEnd()` - ゲーム終了判定
  - [ ] `processTurn()` - ターン処理
  - [ ] `endTurn()` - ターン終了
  - [ ] `checkSetupComplete()` - 配置完了確認

### 8. スキルシステム実装
- [ ] `src/lib/game/skills.ts` 実装
  - [ ] `executeSkill()` - スキル実行統合
  - [ ] `useStrawberryShield()` - ストロベリーシールド
  - [ ] `useChocolateBomb()` - チョコレートボム
  - [ ] `useSweetEscape()` - スイートエスケープ
  - [ ] `useWaffleScan()` - 格子スキャン

### 9. ゲームボードUI実装
- [ ] `src/components/game/Board.tsx` 作成
  - [ ] 10×10マスのグリッド表示
  - [ ] 自分のボード / 相手のボード切り替え
  - [ ] クリックイベント処理
- [ ] `src/components/game/Cell.tsx` 作成
  - [ ] マスの状態表示（empty, miss, hit, sunk）
  - [ ] ホバーエフェクト
  - [ ] クリックハンドラー
- [ ] `src/components/game/Ship.tsx` 作成
  - [ ] 乗り物画像表示
  - [ ] 回転処理（縦/横）
  - [ ] 被弾状態の視覚化

### 10. 配置フェーズUI実装
- [ ] `src/components/game/ShipPlacer.tsx` 作成
  - [ ] 未配置の乗り物リスト表示
  - [ ] 乗り物選択UI
  - [ ] 方向選択ボタン（縦/横）
  - [ ] 配置プレビュー表示
  - [ ] 配置完了ボタン
- [ ] `src/components/ui/Timer.tsx` 作成
  - [ ] 残り時間表示
  - [ ] タイムアウト処理
- [ ] 配置フェーズのタイマー機能実装
- [ ] ランダム配置機能実装（タイムアウト時）

### 11. 戦闘フェーズUI実装
- [ ] `src/components/game/HUD.tsx` 作成
  - [ ] HP表示（自分・相手）
  - [ ] 残存艦表示
  - [ ] ターン表示
  - [ ] プレイヤー名表示
- [ ] `src/components/game/TurnIndicator.tsx` 作成
  - [ ] 自分のターン / 相手のターン表示
  - [ ] ターン数表示
- [ ] 攻撃エフェクト実装
  - [ ] `src/components/effects/HitEffect.tsx`
  - [ ] `src/components/effects/MissEffect.tsx`
  - [ ] `src/components/effects/SinkEffect.tsx`
- [ ] 連続攻撃UI実装

### 12. CPU対戦AI実装
- [ ] `src/lib/ai/cpuPlayer.ts` 作成
  - [ ] `SimpleCPU` クラス実装
  - [ ] `selectRandomTarget()` - ランダム攻撃
  - [ ] `selectAdjacentTarget()` - 周囲攻撃
  - [ ] `selectTarget()` - メイン思考ロジック
  - [ ] `onAttackResult()` - 攻撃結果処理
  - [ ] `shouldUseSkill()` - スキル使用判定
  - [ ] `placeCPUShips()` - CPU配置AI

### 13. キャラクター選択画面実装
- [ ] `src/app/character-select/page.tsx` 実装
  - [ ] プレイヤーキャラ選択UI（4人）
  - [ ] CPU対戦時の相手選択UI（3人）
  - [ ] キャラクター情報表示
  - [ ] 選択確定処理
- [ ] `src/components/character/CharacterCard.tsx` 作成
  - [ ] キャラクター画像
  - [ ] 名前・説明文
  - [ ] 選択ボタン
  - [ ] 難易度表示（CPU用）

### 14. ゲーム画面統合
- [ ] `src/app/game/page.tsx` 実装
  - [ ] 配置フェーズ表示
  - [ ] 戦闘フェーズ表示
  - [ ] フェーズ切り替え処理
  - [ ] ゲーム状態管理
  - [ ] CPU対戦ロジック統合

---

## 🌐 Week 3：スキル&オンライン対戦

### 15. スキルパネルUI実装
- [ ] `src/components/game/SkillPanel.tsx` 作成
  - [ ] 4つのスキルボタン表示
  - [ ] スキル名・説明表示
  - [ ] 使用可/使用済み/撃沈の視覚化
  - [ ] スキル選択処理
  - [ ] スキル確認モーダル
- [ ] `src/components/effects/SkillEffect.tsx` 作成
  - [ ] スキル使用時のエフェクト
  - [ ] スキル別のアニメーション

### 16. スキル実装の完成
- [ ] シールド機能のUI統合
- [ ] チョコレートボムのエリア選択UI
- [ ] スイートエスケープの移動UI
- [ ] 格子スキャンの結果表示UI
- [ ] スキル使用時のサウンド実装

### 17. P2P通信基盤実装
- [ ] PeerServerのセットアップ（Render）
  - [ ] `server.js` 作成
  - [ ] `package.json` 作成
  - [ ] Renderデプロイ設定
- [ ] `src/lib/p2p/peerConnection.ts` 作成
  - [ ] Peer初期化
  - [ ] 接続確立処理
  - [ ] 接続エラーハンドリング
  - [ ] 接続切断処理
- [ ] `src/lib/p2p/messageHandler.ts` 作成
  - [ ] メッセージ送信機能
  - [ ] メッセージ受信機能
  - [ ] メッセージタイプ別処理
- [ ] `src/lib/p2p/roomManager.ts` 作成
  - [ ] ルーム作成機能
  - [ ] ルーム参加機能
  - [ ] 招待URL生成

### 18. オンラインロビー実装
- [ ] `src/app/online-lobby/page.tsx` 実装
  - [ ] ホスト側UI（ルーム作成）
  - [ ] ゲスト側UI（ルーム参加）
  - [ ] PeerID表示
  - [ ] 招待URLコピー機能
  - [ ] 接続待機UI
  - [ ] 接続成功時の遷移処理

### 19. オンライン対戦機能統合
- [ ] ゲームアクションの送受信実装
  - [ ] 攻撃アクション送信
  - [ ] スキル使用アクション送信
  - [ ] 配置アクション送信
  - [ ] ターン終了アクション送信
- [ ] ゲーム状態の同期処理
- [ ] 接続切断時の処理
- [ ] エラーハンドリング

### 20. 状態管理実装（Zustand）
- [ ] `src/store/gameStore.ts` 作成
  - [ ] ゲーム状態管理
  - [ ] アクション定義
  - [ ] ゲームロジック統合
- [ ] `src/store/uiStore.ts` 作成
  - [ ] UI状態管理
  - [ ] モーダル管理
  - [ ] 通知管理
- [ ] `src/store/soundStore.ts` 作成
  - [ ] サウンド設定管理

---

## 🎨 Week 4：仕上げ&デバッグ&報酬システム

### 21. サウンド実装
- [ ] `src/lib/sound/soundManager.ts` 作成
  - [ ] Howler.js統合
  - [ ] BGM管理
  - [ ] SE管理
  - [ ] 音量調整機能
  - [ ] ミュート機能
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
- [ ] `src/app/result/page.tsx` 実装
  - [ ] 勝敗表示
  - [ ] 勝者のキャラクター画像
  - [ ] 戦績表示（ターン数等）
  - [ ] リマッチボタン（オンライン対戦）
  - [ ] タイトルに戻るボタン
  - [ ] 結果演出アニメーション

### 24. 報酬システム実装（MVP拡張版）

#### 24.1 コイン獲得システム
- [ ] `src/lib/reward/coinCalculator.ts` 作成
  - [ ] `calculateCoinReward()` - コイン報酬計算
  - [ ] 基本報酬計算
  - [ ] ボーナス報酬計算（オンライン/速攻/完全勝利/逆転/全スキル）
  - [ ] `addCoins()` - コイン付与
  - [ ] `spendCoins()` - コイン消費

#### 24.2 称号システム
- [ ] `src/lib/reward/titleManager.ts` 作成
  - [ ] `unlockTitle()` - 称号解放
  - [ ] `equipTitle()` - 称号装備
  - [ ] `checkTitleUnlocks()` - 称号解放チェック
- [ ] `src/lib/reward/definitions/titles.ts` 作成
  - [ ] MVP版称号定義（「初勝利」）
  - [ ] 将来実装用の拡張可能な設計

#### 24.3 ショップシステム
- [ ] `src/lib/reward/shopManager.ts` 作成
  - [ ] `purchaseSkin()` - スキン購入
  - [ ] `equipSkin()` - スキン装備
  - [ ] `getShopItems()` - ショップアイテム一覧取得
- [ ] `src/lib/reward/definitions/skins.ts` 作成
  - [ ] MVP版スキン定義（サマーバージョン1つ）
  - [ ] デフォルトスキン定義

#### 24.4 統計管理
- [ ] `src/lib/reward/statsManager.ts` 作成
  - [ ] `updateGameStats()` - 統計更新
  - [ ] `checkPerfectWin()` - 完全勝利判定
  - [ ] `checkAllSkillsUsed()` - 全スキル使用判定
  - [ ] `checkComebackWin()` - 逆転勝利判定
  - [ ] `loadPlayerStats()` - 統計読み込み
  - [ ] `savePlayerStats()` - 統計保存
  - [ ] `createDefaultPlayerStats()` - デフォルト統計作成
  - [ ] `resetPlayerStats()` - 統計リセット（デバッグ用）

#### 24.5 ゲーム終了処理統合
- [ ] `onGameFinished()` 実装
  - [ ] ゲーム結果作成
  - [ ] 統計更新
  - [ ] コイン獲得処理
  - [ ] 称号解放チェック
  - [ ] 結果画面遷移

#### 24.6 報酬UI実装
- [ ] `src/components/reward/CoinRewardDisplay.tsx` 作成
  - [ ] コイン獲得演出
  - [ ] 内訳表示
  - [ ] アニメーション
- [ ] `src/components/reward/TitleUnlockModal.tsx` 作成
  - [ ] 称号獲得モーダル
  - [ ] 称号情報表示
  - [ ] 演出アニメーション
- [ ] 結果画面へのコイン獲得表示統合
- [ ] 結果画面への称号獲得モーダル統合

#### 24.7 ショップ画面実装
- [ ] `src/app/shop/page.tsx` 実装
  - [ ] 所持コイン表示
  - [ ] アイテムリスト表示
  - [ ] 購入処理
  - [ ] 購入確認モーダル
  - [ ] 購入完了演出
  - [ ] 戻るボタン
- [ ] `src/components/reward/ShopItem.tsx` 作成
  - [ ] アイテムカード
  - [ ] スキンプレビュー
  - [ ] 価格表示
  - [ ] レアリティ表示
  - [ ] 購入ボタン / 所持中バッジ

#### 24.8 プロフィール画面実装
- [ ] `src/app/profile/page.tsx` 実装
  - [ ] キャラクター画像表示
  - [ ] 装備中称号表示
  - [ ] 統計表示
  - [ ] 称号変更ボタン
  - [ ] 戻るボタン
- [ ] `src/components/reward/StatsDisplay.tsx` 作成
  - [ ] 統計情報表示
  - [ ] 勝率グラフ（将来実装用）
- [ ] `src/components/reward/TitleBadge.tsx` 作成
  - [ ] 称号バッジ表示
  - [ ] レアリティ表示
- [ ] 称号変更モーダル実装
  - [ ] 解放済み称号一覧
  - [ ] 未解放称号（ロック表示）
  - [ ] 装備処理

#### 24.9 タイトル画面への報酬機能統合
- [ ] タイトル画面に所持コイン表示追加
- [ ] ショップボタン追加
- [ ] プロフィールボタン追加
- [ ] 画面遷移処理追加

### 25. キャラクター画像実装
- [ ] `src/components/character/CharacterPortrait.tsx` 作成
  - [ ] 対戦中のキャラ立ち絵表示
  - [ ] 装備中スキンの反映
- [ ] ゲーム画面へのキャラクター立ち絵統合
- [ ] 結果画面へのキャラクター画像統合

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
- 完了: 0/30タスク
- 進行中: 0タスク
- 未着手: 30タスク

### Week 2 進捗
- 完了: 0/36タスク
- 進行中: 0タスク
- 未着手: 36タスク

### Week 3 進捗
- 完了: 0/29タスク
- 進行中: 0タスク
- 未着手: 29タスク

### Week 4 進捗
- 完了: 0/58タスク
- 進行中: 0タスク
- 未着手: 58タスク

### 総進捗
- 完了: 0/153タスク (0.0%)
- 進行中: 0タスク
- 未着手: 153タスク

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

**更新日**: 2025-10-31
