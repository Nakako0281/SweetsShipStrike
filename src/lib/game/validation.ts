import { BOARD_SIZE, TOTAL_MASSES } from '@/lib/utils/constants';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import type { Board } from '@/lib/game/board';
import type {
  Position,
  Ship,
  GameAction,
  GameState,
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
  const { x, y } = position;
  return y >= 0 && y < BOARD_SIZE && x >= 0 && x < BOARD_SIZE;
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
    if (!ship.position || !isValidPosition(ship.position)) {
      return false;
    }

    const shipDef = SHIP_DEFINITIONS[ship.type];
    const { x, y } = ship.position;

    if (ship.direction === 'horizontal') {
      if (x + shipDef.size > BOARD_SIZE) {
        return false;
      }
    } else {
      if (y + shipDef.size > BOARD_SIZE) {
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
    if (!ship.position) {
      continue; // 未配置の船はスキップ
    }

    const shipDef = SHIP_DEFINITIONS[ship.type];
    const { x, y } = ship.position;

    for (let i = 0; i < shipDef.size; i++) {
      const cellX = ship.direction === 'horizontal' ? x + i : x;
      const cellY = ship.direction === 'vertical' ? y + i : y;
      const cellKey = `${cellY},${cellX}`;

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
    return action.type === 'placeShip' || action.type === 'ready';
  }

  if (gameState.phase === 'finished') {
    return action.type === 'requestRematch'; // ゲーム終了後はリマッチのみ可能
  }

  // アクションタイプ別のバリデーション
  switch (action.type) {
    case 'attack':
      return isValidAttackAction(action, gameState);

    case 'useSkill':
      return isValidSkillAction(action, gameState);

    case 'endTurn':
      return true; // ターン終了は常に可能

    case 'placeShip':
      return false; // セットアップ外では配置不可

    case 'ready':
      return false; // バトル中は準備完了不可

    case 'requestRematch':
      return false; // バトル中はリマッチ不可

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
  if (action.type !== 'attack') {
    return false;
  }

  const attackData = action.data as import('@/types/game').AttackActionData;
  const position = attackData.position;

  // 攻撃フェーズかチェック
  if (gameState.turnPhase !== 'attack') {
    return false;
  }

  // 位置が有効かチェック
  if (!isValidPosition(position)) {
    return false;
  }

  // 相手のボードを取得
  const opponentId: PlayerId = action.playerId === 'player1' ? 'player2' : 'player1';
  const opponentBoard = gameState.players[opponentId].board;

  const { x, y } = position;
  const cell = opponentBoard[y][x];

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
  if (action.type !== 'useSkill') {
    return false;
  }

  const skillData = action.data as import('@/types/game').SkillActionData;
  const skillId = skillData.skillUse.skillId;
  const player = gameState.players[action.playerId];

  // スキルが既に使用済みかチェック
  if (player.activeSkills.includes(skillId)) {
    return false;
  }

  // 位置指定が必要なスキルの場合
  const target = skillData.skillUse.target;
  if (target && !isValidPosition(target)) {
    return false;
  }

  // TODO: スキル固有のバリデーション（Week 3で実装）

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

  // どちらかのプレイヤーの残存マス数が0になっているかチェック
  for (const playerId of ['player1', 'player2'] as PlayerId[]) {
    const player = gameState.players[playerId];
    if (player.remainingMasses <= 0) {
      return true;
    }
  }

  return false;
}
