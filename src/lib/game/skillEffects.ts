import { BOARD_SIZE } from '@/lib/utils/constants';
import { processAttack } from '@/lib/game/board';
import type { Position, Board, Ship, SkillResult, Area } from '@/types/game';

/**
 * スキル効果実装
 * 4種類のスキルの効果を実装
 */

/**
 * ストロベリーシールド
 * 次の1回の攻撃を無効化する防御スキル
 *
 * @param playerId - スキルを使用するプレイヤーID
 * @returns スキル結果
 */
export function executeStrawberryShield(playerId: string): SkillResult {
  return {
    success: true,
    message: 'ストロベリーシールドを展開しました！次の攻撃を無効化します。',
    affectedPositions: [],
    // シールド状態は PlayerState の shield フラグで管理
    // ゲームロジック側で実装
  };
}

/**
 * チョコレートボム
 * 3×3エリアを一度に攻撃する攻撃スキル
 *
 * @param centerPosition - 中心位置
 * @param opponentBoard - 相手のボード
 * @param opponentShips - 相手の船
 * @returns スキル結果
 */
export function executeChocolateBomb(
  centerPosition: Position,
  opponentBoard: Board,
  opponentShips: Ship[]
): SkillResult {
  const affectedPositions: Position[] = [];
  const { row, col } = centerPosition;

  // 3×3エリアの位置を計算
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      // ボード内かチェック
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        affectedPositions.push({ row: r, col: c });
      }
    }
  }

  let hitCount = 0;
  let missCount = 0;

  // 各位置を攻撃
  for (const pos of affectedPositions) {
    const cell = opponentBoard[pos.row][pos.col];
    if (cell.state !== 'hit' && cell.state !== 'miss') {
      const result = processAttack(opponentBoard, pos, opponentShips);
      if (result.isHit) {
        hitCount++;
      } else {
        missCount++;
      }
    }
  }

  return {
    success: true,
    message: `チョコレートボムが炸裂！${affectedPositions.length}マスを攻撃しました。（ヒット: ${hitCount}, ミス: ${missCount}）`,
    affectedPositions,
  };
}

/**
 * スイートエスケープ
 * 船を別の場所に移動させる移動スキル
 *
 * @param shipId - 移動する船のID
 * @param newPosition - 新しい位置
 * @param newDirection - 新しい向き
 * @param board - 自分のボード
 * @param ships - 自分の船
 * @returns スキル結果
 */
export function executeSweetEscape(
  shipId: string,
  newPosition: Position,
  newDirection: 'horizontal' | 'vertical',
  board: Board,
  ships: Ship[]
): SkillResult {
  const ship = ships.find((s) => s.id === shipId);

  if (!ship) {
    return {
      success: false,
      message: '指定された船が見つかりません。',
      affectedPositions: [],
    };
  }

  if (ship.isSunk) {
    return {
      success: false,
      message: '撃沈された船は移動できません。',
      affectedPositions: [],
    };
  }

  // 移動先が有効かチェック（簡易実装）
  // TODO: 実際のゲームロジックで詳細なバリデーションを実装

  const affectedPositions: Position[] = [ship.position, newPosition];

  return {
    success: true,
    message: `${ship.type}を移動させました！`,
    affectedPositions,
    // 実際の移動処理は GameState の更新で実装
  };
}

/**
 * ワッフルスキャン（格子スキャン）
 * 格子状のパターンでスキャンして船の有無を確認
 *
 * @param scanType - スキャンタイプ（'horizontal' | 'vertical' | 'diagonal'）
 * @param opponentBoard - 相手のボード
 * @returns スキル結果
 */
export function executeWaffleScan(
  scanType: 'horizontal' | 'vertical' | 'diagonal',
  opponentBoard: Board
): SkillResult {
  const affectedPositions: Position[] = [];
  let detectedShipCount = 0;

  if (scanType === 'horizontal') {
    // 横方向の格子（0, 2, 4, 6, 8行）
    for (let row = 0; row < BOARD_SIZE; row += 2) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        affectedPositions.push({ row, col });
        const cell = opponentBoard[row][col];
        if (cell.state === 'ship') {
          detectedShipCount++;
        }
      }
    }
  } else if (scanType === 'vertical') {
    // 縦方向の格子（0, 2, 4, 6, 8列）
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col += 2) {
        affectedPositions.push({ row, col });
        const cell = opponentBoard[row][col];
        if (cell.state === 'ship') {
          detectedShipCount++;
        }
      }
    }
  } else if (scanType === 'diagonal') {
    // 斜め方向の格子
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 0) {
          affectedPositions.push({ row, col });
          const cell = opponentBoard[row][col];
          if (cell.state === 'ship') {
            detectedShipCount++;
          }
        }
      }
    }
  }

  return {
    success: true,
    message: `ワッフルスキャン完了！${detectedShipCount}個の反応を検出しました。`,
    affectedPositions,
  };
}

/**
 * スキル実行のメインエントリーポイント
 *
 * @param skillId - スキルID
 * @param params - スキル固有のパラメータ
 * @returns スキル結果
 */
export function executeSkill(
  skillId: string,
  params: {
    playerId?: string;
    position?: Position;
    shipId?: string;
    newPosition?: Position;
    newDirection?: 'horizontal' | 'vertical';
    scanType?: 'horizontal' | 'vertical' | 'diagonal';
    opponentBoard?: Board;
    opponentShips?: Ship[];
    board?: Board;
    ships?: Ship[];
  }
): SkillResult {
  switch (skillId) {
    case 'strawberry_shield':
      if (!params.playerId) {
        return { success: false, message: 'プレイヤーIDが必要です。', affectedPositions: [] };
      }
      return executeStrawberryShield(params.playerId);

    case 'chocolate_bomb':
      if (!params.position || !params.opponentBoard || !params.opponentShips) {
        return { success: false, message: '位置と相手のボードが必要です。', affectedPositions: [] };
      }
      return executeChocolateBomb(params.position, params.opponentBoard, params.opponentShips);

    case 'sweet_escape':
      if (!params.shipId || !params.newPosition || !params.newDirection || !params.board || !params.ships) {
        return { success: false, message: '船ID、新しい位置、向き、ボード、船リストが必要です。', affectedPositions: [] };
      }
      return executeSweetEscape(params.shipId, params.newPosition, params.newDirection, params.board, params.ships);

    case 'waffle_scan':
      if (!params.scanType || !params.opponentBoard) {
        return { success: false, message: 'スキャンタイプと相手のボードが必要です。', affectedPositions: [] };
      }
      return executeWaffleScan(params.scanType, params.opponentBoard);

    default:
      return {
        success: false,
        message: `不明なスキル: ${skillId}`,
        affectedPositions: [],
      };
  }
}
