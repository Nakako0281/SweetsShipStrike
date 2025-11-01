import { BOARD_SIZE } from '@/lib/utils/constants';
import type { Position, Board, CellState, CharacterType } from '@/types/game';

/**
 * CPU AI ロジック
 * 3段階の難易度（Easy, Normal, Hard）に基づいた攻撃決定
 */

export type Difficulty = 'easy' | 'normal' | 'hard';

/**
 * CPU AIが次の攻撃位置を決定
 * @param difficulty - 難易度
 * @param opponentBoard - 相手のボード
 * @param characterType - CPUキャラクタータイプ
 * @returns 攻撃位置
 */
export function getCPUAttackPosition(
  difficulty: Difficulty,
  opponentBoard: Board,
  characterType?: CharacterType
): Position | null {
  switch (difficulty) {
    case 'easy':
      return getEasyAttack(opponentBoard);
    case 'normal':
      return getNormalAttack(opponentBoard);
    case 'hard':
      return getHardAttack(opponentBoard);
    default:
      return getEasyAttack(opponentBoard);
  }
}

/**
 * Easy難易度の攻撃（完全ランダム）
 * @param opponentBoard - 相手のボード
 * @returns 攻撃位置
 */
function getEasyAttack(opponentBoard: Board): Position | null {
  const availableCells = getAvailableCells(opponentBoard);

  if (availableCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  return availableCells[randomIndex];
}

/**
 * Normal難易度の攻撃（ヒット後は周囲を狙う）
 * @param opponentBoard - 相手のボード
 * @returns 攻撃位置
 */
function getNormalAttack(opponentBoard: Board): Position | null {
  // ヒットしたが沈んでいない船の周囲を優先的に狙う
  const targetPosition = findAdjacentToHit(opponentBoard);

  if (targetPosition) {
    return targetPosition;
  }

  // ヒットがない場合はランダム
  return getEasyAttack(opponentBoard);
}

/**
 * Hard難易度の攻撃（戦略的な攻撃）
 * @param opponentBoard - 相手のボード
 * @returns 攻撃位置
 */
function getHardAttack(opponentBoard: Board): Position | null {
  // 1. ヒット後の追撃（パターン認識）
  const huntPosition = findHuntTarget(opponentBoard);
  if (huntPosition) {
    return huntPosition;
  }

  // 2. 戦略的な位置を狙う（チェスボードパターン）
  const strategicPosition = findStrategicPosition(opponentBoard);
  if (strategicPosition) {
    return strategicPosition;
  }

  // 3. それでもなければランダム
  return getEasyAttack(opponentBoard);
}

/**
 * 未攻撃のセルを取得
 * @param board - ボード
 * @returns 未攻撃のセルの配列
 */
function getAvailableCells(board: Board): Position[] {
  const available: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const state = board[row][col].state;
      if (state === 'empty' || state === 'ship') {
        available.push({ row, col });
      }
    }
  }

  return available;
}

/**
 * ヒットしたセルの隣接セルを探す
 * @param board - ボード
 * @returns 隣接セルの位置
 */
function findAdjacentToHit(board: Board): Position | null {
  const hitCells: Position[] = [];

  // ヒットしたセルを収集
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].state === 'hit') {
        hitCells.push({ row, col });
      }
    }
  }

  // ヒットしたセルの隣接を調べる
  for (const hit of hitCells) {
    const adjacents = getAdjacentPositions(hit);

    for (const adj of adjacents) {
      const state = board[adj.row][adj.col].state;
      if (state === 'empty' || state === 'ship') {
        return adj;
      }
    }
  }

  return null;
}

/**
 * 追撃目標を探す（連続ヒットのパターン認識）
 * @param board - ボード
 * @returns 追撃位置
 */
function findHuntTarget(board: Board): Position | null {
  // 連続ヒットを探す
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].state === 'hit') {
        // 横方向のチェック
        if (col + 1 < BOARD_SIZE && board[row][col + 1].state === 'hit') {
          // 右端を探す
          if (col + 2 < BOARD_SIZE && (board[row][col + 2].state === 'empty' || board[row][col + 2].state === 'ship')) {
            return { row, col: col + 2 };
          }
          // 左端を探す
          if (col - 1 >= 0 && (board[row][col - 1].state === 'empty' || board[row][col - 1].state === 'ship')) {
            return { row, col: col - 1 };
          }
        }

        // 縦方向のチェック
        if (row + 1 < BOARD_SIZE && board[row + 1][col].state === 'hit') {
          // 下端を探す
          if (row + 2 < BOARD_SIZE && (board[row + 2][col].state === 'empty' || board[row + 2][col].state === 'ship')) {
            return { row: row + 2, col };
          }
          // 上端を探す
          if (row - 1 >= 0 && (board[row - 1][col].state === 'empty' || board[row - 1][col].state === 'ship')) {
            return { row: row - 1, col };
          }
        }
      }
    }
  }

  // 連続ヒットがない場合は単独ヒットの隣接
  return findAdjacentToHit(board);
}

/**
 * 戦略的な位置を探す（チェスボードパターン）
 * @param board - ボード
 * @returns 戦略的な位置
 */
function findStrategicPosition(board: Board): Position | null {
  const strategicCells: Position[] = [];

  // チェスボードパターン（市松模様）で効率的に探索
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 0) {
        const state = board[row][col].state;
        if (state === 'empty' || state === 'ship') {
          strategicCells.push({ row, col });
        }
      }
    }
  }

  if (strategicCells.length === 0) {
    return null;
  }

  // 戦略的なセルからランダムに選択
  const randomIndex = Math.floor(Math.random() * strategicCells.length);
  return strategicCells[randomIndex];
}

/**
 * 隣接する位置を取得（上下左右）
 * @param position - 基準位置
 * @returns 隣接位置の配列
 */
function getAdjacentPositions(position: Position): Position[] {
  const { row, col } = position;
  const adjacents: Position[] = [];

  // 上
  if (row - 1 >= 0) {
    adjacents.push({ row: row - 1, col });
  }

  // 下
  if (row + 1 < BOARD_SIZE) {
    adjacents.push({ row: row + 1, col });
  }

  // 左
  if (col - 1 >= 0) {
    adjacents.push({ row, col: col - 1 });
  }

  // 右
  if (col + 1 < BOARD_SIZE) {
    adjacents.push({ row, col: col + 1 });
  }

  return adjacents;
}

/**
 * キャラクタータイプから難易度を取得
 * @param characterType - キャラクタータイプ
 * @returns 難易度
 */
export function getDifficultyFromCharacter(characterType: CharacterType): Difficulty {
  switch (characterType) {
    case 'cpu_easy':
      return 'easy';
    case 'cpu_normal':
      return 'normal';
    case 'cpu_hard':
      return 'hard';
    default:
      return 'easy';
  }
}

/**
 * CPU思考時間を取得（演出用）
 * @param difficulty - 難易度
 * @returns 思考時間（ミリ秒）
 */
export function getCPUThinkingTime(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 500; // 0.5秒
    case 'normal':
      return 1000; // 1秒
    case 'hard':
      return 1500; // 1.5秒
    default:
      return 1000;
  }
}
