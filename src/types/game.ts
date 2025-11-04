// ========================================
// 基本型
// ========================================

/** キャラクタータイプ */
export type CharacterType =
  | 'strawberry'
  | 'chocolate'
  | 'macaron'
  | 'pudding'
  | 'cpu_easy'
  | 'cpu_normal'
  | 'cpu_hard';

// プレイヤーキャラ: strawberry, chocolate, macaron, pudding
// CPU専用キャラ: cpu_easy（よわい）, cpu_normal（ふつう）, cpu_hard（つよい）

/** 乗り物タイプ */
export type ShipType =
  | 'strawberry_boat'
  | 'cocoa_submarine'
  | 'macaron_ufo'
  | 'waffle_ship';

/** 方向 */
export type Direction = 'horizontal' | 'vertical';

/** マスの状態（表示用） */
export type CellState = 'empty' | 'miss' | 'hit' | 'sunk';

/** 内部用セル状態（shipも含む） */
export type InternalCellState = CellState | 'ship';

/** ボードセル（内部ロジック用 - shipId保持） */
export interface BoardCell {
  state: InternalCellState;
  shipId: string | null;
}

/** ボード型（内部ロジック用） */
export type InternalBoard = BoardCell[][];

/** 表示用ボード型 */
export type DisplayBoard = CellState[][];

/** ゲームフェーズ */
export type GamePhase = 'setup' | 'battle' | 'finished';

/** プレイヤー識別子 */
export type PlayerId = 'player1' | 'player2';

/** ゲームモード */
export type GameMode = 'online' | 'cpu';

/** ターンフェーズ */
export type TurnPhase = 'start' | 'attack' | 'after_hit' | 'skill_select' | 'end';

// ========================================
// 座標・位置
// ========================================

/** 座標 */
export interface Position {
  x: number; // 0-9
  y: number; // 0-9
}

/** エリア（スキル用） */
export interface Area {
  topLeft: Position;
  bottomRight: Position;
}

// ========================================
// キャラクター
// ========================================

/** キャラクター定義 */
export interface Character {
  id: CharacterType;
  name: string;
  description: string;
  imageFullBody: string; // 全身画像パス
  imageTopView: string; // 真上画像パス
  isPlayable: boolean; // プレイヤーが選択可能か
  difficulty?: 'easy' | 'normal' | 'hard'; // CPU専用キャラの難易度
  // passive: PassiveSkill; // MVP版では未実装（見た目のみの違い）
}

// MVP版の方針: キャラクターは見た目のみの違い（能力差なし）
// 将来実装: パッシブ能力を追加予定

// キャラクター構成:
// - プレイヤー選択可能: 4人（ショートケーキ、チョコレート、マカロン、プリン）
// - CPU専用: 3人（よわい、ふつう、つよい）
// CPU対戦時、プレイヤーはCPU専用キャラから対戦相手を選択

// ========================================
// 乗り物
// ========================================

/** スキル定義 */
export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'utility' | 'scan';
  icon?: string;
}

/** 乗り物定義 */
export interface ShipDefinition {
  id: ShipType;
  name: string;
  size: number; // マス数
  description: string;
  image: string; // 真上画像パス
  skill: SkillDefinition; // 専用スキル
}

/** 配置済み乗り物 */
export interface Ship {
  id: string; // 一意のID（例: "player1_strawberry_boat"）
  type: ShipType;
  size: number;
  position: Position | null; // null = 未配置
  direction: Direction;
  hits: boolean[]; // [false, false, true] = 3マス中1マスが被弾
  sunk: boolean; // 撃沈済みか
  skillUsed: boolean; // スキル使用済みか
}

// ========================================
// スキル
// ========================================

/** スキル使用データ */
export interface SkillUseData {
  skillId: string;
  shipId: string; // どの乗り物のスキルか
  target?: Position; // 対象座標（スキルによる）
  area?: Area; // 対象エリア（スキルによる）
  line?: 'row' | 'col'; // スキャン用（縦 or 横）
  lineIndex?: number; // スキャン用（何列目 / 何行目）
}

/** スキル実行結果 */
export interface SkillResult {
  success: boolean;
  effect: string; // 効果の説明
  data?: any; // スキルごとの結果データ
}

// ========================================
// プレイヤー
// ========================================

/** プレイヤー状態 */
export interface PlayerState {
  id: PlayerId;
  character: CharacterType;
  ships: Ship[]; // 4隻
  board: InternalBoard; // 10x10のマス状態（内部ロジック用）
  hp: number; // 残体力パーセンテージ（0-100）
  remainingMasses: number; // 残存マス数
  totalMasses: number; // 総マス数（14）
  shieldActive: boolean; // シールド発動中か
  activeSkills: string[]; // 使用済みスキルID配列
  isReady: boolean; // 配置完了したか
}

// ========================================
// ゲーム状態
// ========================================

/** ゲーム全体の状態 */
export interface GameState {
  gameId: string; // ゲームID（P2P用）
  mode: GameMode; // オンライン or CPU
  phase: GamePhase; // setup / battle / finished
  turnPhase: TurnPhase; // ターン内のフェーズ
  currentTurn: PlayerId; // 現在のターン
  players: {
    player1: PlayerState;
    player2: PlayerState;
  };
  attackedCells: {
    // 攻撃済みマス（重複攻撃防止）
    player1: Set<string>; // "x-y" 形式
    player2: Set<string>;
  };
  winner: PlayerId | null;
  turnCount: number; // ターン数
  lastAction?: GameAction; // 最後のアクション
  setupTimer?: number; // 配置フェーズの残り時間（秒）
}

// ========================================
// アクション
// ========================================

/** ゲームアクション（P2P通信で送受信） */
export interface GameAction {
  type: 'attack' | 'useSkill' | 'placeShip' | 'ready' | 'endTurn' | 'requestRematch';
  playerId: PlayerId;
  timestamp: number;
  data: ActionData;
}

/** アクションデータ */
export type ActionData =
  | AttackActionData
  | SkillActionData
  | PlaceShipActionData
  | ReadyActionData
  | EndTurnActionData
  | RequestRematchActionData;

export interface AttackActionData {
  position: Position;
}

export interface SkillActionData {
  skillUse: SkillUseData;
}

export interface PlaceShipActionData {
  shipId: string;
  position: Position;
  direction: Direction;
}

export interface ReadyActionData {
  // 配置完了通知（データなし）
}

export interface EndTurnActionData {
  // ターン終了通知（データなし）
}

export interface RequestRematchActionData {
  // リマッチ要求（データなし）
}

// ========================================
// 攻撃結果
// ========================================

/** 攻撃結果 */
export interface AttackResult {
  result: 'hit' | 'miss' | 'sunk' | 'blocked';
  position: Position;
  shipId?: string; // ヒット時、どの乗り物に当たったか
  shipType?: ShipType; // ヒット時、どの乗り物タイプか
  message?: string; // 結果メッセージ
  canContinue: boolean; // 連続攻撃可能か
}

// ========================================
// ゲーム結果
// ========================================

/** ゲーム結果 */
export interface GameResult {
  winner: PlayerId;
  mode: GameMode;
  turnCount: number;
  perfectWin: boolean; // 被弾0での勝利
  usedAllSkills: boolean; // 全スキル使用
  comebackWin: boolean; // HP30%以下からの逆転
  fastWin: boolean; // 10ターン以内の勝利
  character: CharacterType; // 使用キャラクター
}
