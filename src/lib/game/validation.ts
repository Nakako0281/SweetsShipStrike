import { BOARD_SIZE, TOTAL_MASSES } from '@/lib/utils/constants';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import type {
  Position,
  Ship,
  GameAction,
  GameState,
  Board,
  PlayerId,
} from '@/types/game';

/**
 * バリデーションロジック
 * ゲームルールに基づく各種検証処理
 */

/**
 * 位置が有効かチェック
 * @param position - チェックする位置
 * @returns 有効ならtrue
 */
export function isValidPosition(position: Position): boolean {
  const { row, col } = position;
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/**
 * 船の配置が有効かチェック（総マス数）
 * @param ships - 船の配列
 * @returns 有効ならtrue
 */
export function isValidShipPlacement(ships: Ship[]): boolean {
  // 船の数チェック
  const shipTypes = Object.keys(SHIP_DEFINITIONS);
  if (ships.length !== shipTypes.length) {
    return false;
  }

  // 各船種が1つずつあるかチェック
  const shipTypeCounts = new Map<string, number>();
  for (const ship of ships) {
    const count = shipTypeCounts.get(ship.type) || 0;
    shipTypeCounts.set(ship.type, count + 1);
  }

  for (const shipType of shipTypes) {
    if (shipTypeCounts.get(shipType) !== 1) {
      return false;
    }
  }

  // 総マス数チェック
  let totalMasses = 0;
  for (const ship of ships) {
    const shipDef = SHIP_DEFINITIONS[ship.type];
    totalMasses += shipDef.size;
  }

  if (totalMasses !== TOTAL_MASSES) {
    return false;
  }

  // すべての船の位置が有効かチェック
  for (const ship of ships) {
    if (!isValidPosition(ship.position)) {
      return false;
    }

    const shipDef = SHIP_DEFINITIONS[ship.type];
    const { row, col } = ship.position;

    if (ship.direction === 'horizontal') {
      if (col + shipDef.size > BOARD_SIZE) {
        return false;
      }
    } else {
      if (row + shipDef.size > BOARD_SIZE) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 船同士が重複していないかチェック
 * @param ships - 船の配列
 * @returns 重複がなければtrue
 */
export function hasNoShipOverlap(ships: Ship[]): boolean {
  const occupiedCells = new Set<string>();

  for (const ship of ships) {
    const shipDef = SHIP_DEFINITIONS[ship.type];
    const { row, col } = ship.position;

    for (let i = 0; i < shipDef.size; i++) {
      const cellRow = ship.direction === 'vertical' ? row + i : row;
      const cellCol = ship.direction === 'horizontal' ? col + i : col;
      const cellKey = `${cellRow},${cellCol}`;

      if (occupiedCells.has(cellKey)) {
        return false; // 重複あり
      }

      occupiedCells.add(cellKey);
    }
  }

  return true; // 重複なし
}

/**
 * アクションが有効かチェック
 * @param action - チェックするアクション
 * @param gameState - ゲーム状態
 * @returns 有効ならtrue
 */
export function isValidAction(action: GameAction, gameState: GameState): boolean {
  // ターンのプレイヤーが正しいかチェック
  if (action.playerId !== gameState.currentTurn) {
    return false;
  }

  // ゲームフェーズのチェック
  if (gameState.phase === 'setup') {
    return action.type === 'place_ships';
  }

  if (gameState.phase === 'finished') {
    return false; // ゲーム終了後はアクション不可
  }

  // アクションタイプ別のバリデーション
  switch (action.type) {
    case 'attack':
      return isValidAttackAction(action, gameState);

    case 'use_skill':
      return isValidSkillAction(action, gameState);

    case 'surrender':
      return true; // 降参は常に可能

    case 'place_ships':
      return false; // セットアップ外では配置不可

    default:
      return false;
  }
}

/**
 * 攻撃アクションが有効かチェック
 * @param action - 攻撃アクション
 * @param gameState - ゲーム状態
 * @returns 有効ならtrue
 */
function isValidAttackAction(action: GameAction, gameState: GameState): boolean {
  if (action.type !== 'attack' || !action.position) {
    return false;
  }

  // 攻撃フェーズかチェック
  if (gameState.turnPhase !== 'attack') {
    return false;
  }

  // 位置が有効かチェック
  if (!isValidPosition(action.position)) {
    return false;
  }

  // 相手のボードを取得
  const opponentId: PlayerId = action.playerId === 'player1' ? 'player2' : 'player1';
  const opponentBoard = gameState.players[opponentId].board;

  const { row, col } = action.position;
  const cell = opponentBoard[row][col];

  // 既に攻撃済みのセルは攻撃不可
  if (cell.state === 'hit' || cell.state === 'miss') {
    return false;
  }

  return true;
}

/**
 * スキルアクションが有効かチェック
 * @param action - スキルアクション
 * @param gameState - ゲーム状態
 * @returns 有効ならtrue
 */
function isValidSkillAction(action: GameAction, gameState: GameState): boolean {
  if (action.type !== 'use_skill' || !action.skillId) {
    return false;
  }

  const player = gameState.players[action.playerId];

  // スキルが使用可能かチェック
  const availableSkill = player.availableSkills.find((s) => s.id === action.skillId);
  if (!availableSkill) {
    return false;
  }

  // スキルが使用済みでないかチェック
  if (availableSkill.isUsed) {
    return false;
  }

  // 位置指定が必要なスキルの場合
  if (action.position && !isValidPosition(action.position)) {
    return false;
  }

  return true;
}

/**
 * ゲーム状態が有効かチェック
 * @param gameState - ゲーム状態
 * @returns 有効ならtrue
 */
export function isValidGameState(gameState: GameState): boolean {
  // プレイヤーの船配置が有効かチェック
  for (const playerId of ['player1', 'player2'] as PlayerId[]) {
    const player = gameState.players[playerId];

    if (gameState.phase !== 'setup') {
      if (!isValidShipPlacement(player.ships)) {
        return false;
      }

      if (!hasNoShipOverlap(player.ships)) {
        return false;
      }
    }
  }

  // ターンプレイヤーが有効かチェック
  if (gameState.currentTurn !== 'player1' && gameState.currentTurn !== 'player2') {
    return false;
  }

  return true;
}

/**
 * ボードが有効かチェック
 * @param board - ボード
 * @returns 有効ならtrue
 */
export function isValidBoard(board: Board): boolean {
  // サイズチェック
  if (board.length !== BOARD_SIZE) {
    return false;
  }

  for (const row of board) {
    if (row.length !== BOARD_SIZE) {
      return false;
    }
  }

  return true;
}

/**
 * セットアップが完了しているかチェック
 * @param gameState - ゲーム状態
 * @returns 完了していればtrue
 */
export function isSetupComplete(gameState: GameState): boolean {
  for (const playerId of ['player1', 'player2'] as PlayerId[]) {
    const player = gameState.players[playerId];

    // 船が配置されているかチェック
    if (!player.ships || player.ships.length === 0) {
      return false;
    }

    // 配置が有効かチェック
    if (!isValidShipPlacement(player.ships)) {
      return false;
    }

    if (!hasNoShipOverlap(player.ships)) {
      return false;
    }
  }

  return true;
}

/**
 * ゲームが終了しているかチェック
 * @param gameState - ゲーム状態
 * @returns 終了していればtrue
 */
export function isGameFinished(gameState: GameState): boolean {
  if (gameState.phase === 'finished') {
    return true;
  }

  // どちらかのプレイヤーのHPが0になっているかチェック
  for (const playerId of ['player1', 'player2'] as PlayerId[]) {
    const player = gameState.players[playerId];
    if (player.remainingHP <= 0) {
      return true;
    }
  }

  return false;
}
