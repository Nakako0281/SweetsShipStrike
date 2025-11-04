import { BOARD_SIZE } from '@/lib/utils/constants';
import { processAttack, type Board } from '@/lib/game/board';
import type { Position, Ship, SkillResult, Area } from '@/types/game';

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
    effect: 'ストロベリーシールドを展開しました！次の攻撃を無効化します。',
    data: {
      affectedPositions: [],
      // シールド状態は PlayerState の shieldActive フラグで管理
    }
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
  const { x, y } = centerPosition;

  // 3×3エリアの位置を計算
  for (let cy = y - 1; cy <= y + 1; cy++) {
    for (let cx = x - 1; cx <= x + 1; cx++) {
      // ボード内かチェック
      if (cy >= 0 && cy < BOARD_SIZE && cx >= 0 && cx < BOARD_SIZE) {
        affectedPositions.push({ x: cx, y: cy });
      }
    }
  }

  let hitCount = 0;
  let missCount = 0;

  // 各位置を攻撃
  for (const pos of affectedPositions) {
    const cell = opponentBoard[pos.y][pos.x];
    if (cell.state !== 'hit' && cell.state !== 'miss') {
      const { result } = processAttack(opponentBoard, opponentShips, pos);
      if (result === 'hit' || result === 'sunk') {
        hitCount++;
      } else {
        missCount++;
      }
    }
  }

  return {
    success: true,
    effect: `チョコレートボムが炸裂！${affectedPositions.length}マスを攻撃しました。（ヒット: ${hitCount}, ミス: ${missCount}）`,
    data: { affectedPositions, hitCount, missCount },
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
      effect: '指定された船が見つかりません。',
      data: { affectedPositions: [] },
    };
  }

  if (ship.sunk) {
    return {
      success: false,
      effect: '撃沈された船は移動できません。',
      data: { affectedPositions: [] },
    };
  }

  if (!ship.position) {
    return {
      success: false,
      effect: '配置されていない船は移動できません。',
      data: { affectedPositions: [] },
    };
  }

  // 移動先が有効かチェック（簡易実装）
  // TODO: 実際のゲームロジックで詳細なバリデーションを実装

  const affectedPositions: Position[] = [ship.position, newPosition];

  return {
    success: true,
    effect: `${ship.type}を移動させました！`,
    data: {
      affectedPositions,
      // 実際の移動処理は GameState の更新で実装
    },
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
    for (let y = 0; y < BOARD_SIZE; y += 2) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        affectedPositions.push({ x, y });
        const cell = opponentBoard[y][x];
        if (cell.state === 'ship') {
          detectedShipCount++;
        }
      }
    }
  } else if (scanType === 'vertical') {
    // 縦方向の格子（0, 2, 4, 6, 8列）
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x += 2) {
        affectedPositions.push({ x, y });
        const cell = opponentBoard[y][x];
        if (cell.state === 'ship') {
          detectedShipCount++;
        }
      }
    }
  } else if (scanType === 'diagonal') {
    // 斜め方向の格子
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if ((y + x) % 2 === 0) {
          affectedPositions.push({ x, y });
          const cell = opponentBoard[y][x];
          if (cell.state === 'ship') {
            detectedShipCount++;
          }
        }
      }
    }
  }

  return {
    success: true,
    effect: `ワッフルスキャン完了！${detectedShipCount}個の反応を検出しました。`,
    data: { affectedPositions, detectedShipCount },
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
        return { success: false, effect: 'プレイヤーIDが必要です。', data: { affectedPositions: [] } };
      }
      return executeStrawberryShield(params.playerId);

    case 'chocolate_bomb':
      if (!params.position || !params.opponentBoard || !params.opponentShips) {
        return { success: false, effect: '位置と相手のボードが必要です。', data: { affectedPositions: [] } };
      }
      return executeChocolateBomb(params.position, params.opponentBoard, params.opponentShips);

    case 'sweet_escape':
      if (!params.shipId || !params.newPosition || !params.newDirection || !params.board || !params.ships) {
        return { success: false, effect: '船ID、新しい位置、向き、ボード、船リストが必要です。', data: { affectedPositions: [] } };
      }
      return executeSweetEscape(params.shipId, params.newPosition, params.newDirection, params.board, params.ships);

    case 'waffle_scan':
      if (!params.scanType || !params.opponentBoard) {
        return { success: false, effect: 'スキャンタイプと相手のボードが必要です。', data: { affectedPositions: [] } };
      }
      return executeWaffleScan(params.scanType, params.opponentBoard);

    default:
      return {
        success: false,
        effect: `不明なスキル: ${skillId}`,
        data: { affectedPositions: [] },
      };
  }
}
