import { BOARD_SIZE } from '@/lib/utils/constants';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import type {
  Board,
  CellState,
  Position,
  Ship,
  ShipType,
  Direction,
  AttackResult,
} from '@/types/game';

/**
 * ボード管理ロジック
 * ボードの初期化、船の配置、攻撃処理などを管理
 */

/**
 * 空のボードを作成
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      state: 'empty' as CellState,
      shipId: null,
    }))
  );
}

/**
 * 船を配置できるかチェック
 * @param board - ボード
 * @param ship - 配置する船
 * @returns 配置可能ならtrue
 */
export function canPlaceShip(board: Board, ship: Ship): boolean {
  const { position, direction, type } = ship;
  const shipDef = SHIP_DEFINITIONS[type];
  const { row, col } = position;

  // ボード外チェック
  if (direction === 'horizontal' && col + shipDef.size > BOARD_SIZE) {
    return false;
  }
  if (direction === 'vertical' && row + shipDef.size > BOARD_SIZE) {
    return false;
  }

  // 重複チェック
  for (let i = 0; i < shipDef.size; i++) {
    const checkRow = direction === 'vertical' ? row + i : row;
    const checkCol = direction === 'horizontal' ? col + i : col;

    if (board[checkRow][checkCol].state !== 'empty') {
      return false;
    }
  }

  return true;
}

/**
 * ボードに船を配置
 * @param board - ボード
 * @param ship - 配置する船
 * @returns 新しいボード（配置失敗時はnull）
 */
export function placeShip(board: Board, ship: Ship): Board | null {
  if (!canPlaceShip(board, ship)) {
    return null;
  }

  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const shipDef = SHIP_DEFINITIONS[ship.type];
  const { row, col } = ship.position;

  for (let i = 0; i < shipDef.size; i++) {
    const targetRow = ship.direction === 'vertical' ? row + i : row;
    const targetCol = ship.direction === 'horizontal' ? col + i : col;

    newBoard[targetRow][targetCol] = {
      state: 'ship',
      shipId: ship.id,
    };
  }

  return newBoard;
}

/**
 * 複数の船をボードに配置
 * @param ships - 配置する船の配列
 * @returns 新しいボード（配置失敗時はnull）
 */
export function placeShips(ships: Ship[]): Board | null {
  let board = createEmptyBoard();

  for (const ship of ships) {
    const newBoard = placeShip(board, ship);
    if (!newBoard) {
      return null;
    }
    board = newBoard;
  }

  return board;
}

/**
 * 攻撃処理
 * @param board - ボード
 * @param position - 攻撃位置
 * @param ships - 船の配列
 * @returns 攻撃結果
 */
export function processAttack(
  board: Board,
  position: Position,
  ships: Ship[]
): AttackResult {
  const { row, col } = position;
  const cell = board[row][col];

  // 既に攻撃済み
  if (cell.state === 'hit' || cell.state === 'miss') {
    return {
      position,
      isHit: false,
      isSunk: false,
      sunkShipId: null,
      newCellState: cell.state,
    };
  }

  // ミス
  if (cell.state === 'empty') {
    return {
      position,
      isHit: false,
      isSunk: false,
      sunkShipId: null,
      newCellState: 'miss',
    };
  }

  // ヒット
  const shipId = cell.shipId;
  const targetShip = ships.find((s) => s.id === shipId);

  if (!targetShip) {
    // 船が見つからない場合はミス扱い
    return {
      position,
      isHit: false,
      isSunk: false,
      sunkShipId: null,
      newCellState: 'miss',
    };
  }

  // 船が沈んだかチェック
  const isSunk = isShipSunk(board, targetShip);

  return {
    position,
    isHit: true,
    isSunk,
    sunkShipId: isSunk ? shipId : null,
    newCellState: 'hit',
  };
}

/**
 * 船が沈んだかチェック
 * @param board - ボード
 * @param ship - チェックする船
 * @returns 沈んでいればtrue
 */
export function isShipSunk(board: Board, ship: Ship): boolean {
  const shipDef = SHIP_DEFINITIONS[ship.type];
  const { row, col } = ship.position;

  for (let i = 0; i < shipDef.size; i++) {
    const checkRow = ship.direction === 'vertical' ? row + i : row;
    const checkCol = ship.direction === 'horizontal' ? col + i : col;

    // まだヒットしていない部分があれば沈んでいない
    if (board[checkRow][checkCol].state !== 'hit') {
      return false;
    }
  }

  return true;
}

/**
 * すべての船が沈んだかチェック
 * @param board - ボード
 * @param ships - 船の配列
 * @returns すべて沈んでいればtrue
 */
export function areAllShipsSunk(board: Board, ships: Ship[]): boolean {
  return ships.every((ship) => isShipSunk(board, ship));
}

/**
 * ボード上の残りHP（未ヒットの船マス）を計算
 * @param board - ボード
 * @returns 残りHP
 */
export function getRemainingHP(board: Board): number {
  let hp = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].state === 'ship') {
        hp++;
      }
    }
  }

  return hp;
}

/**
 * ランダムに船を配置
 * @returns 配置された船の配列
 */
export function randomPlaceShips(): Ship[] {
  const shipTypes = Object.keys(SHIP_DEFINITIONS) as ShipType[];
  const ships: Ship[] = [];
  let attempts = 0;
  const maxAttempts = 1000;

  for (const shipType of shipTypes) {
    let placed = false;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      const direction: Direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const shipDef = SHIP_DEFINITIONS[shipType];

      const maxRow =
        direction === 'vertical' ? BOARD_SIZE - shipDef.size : BOARD_SIZE - 1;
      const maxCol =
        direction === 'horizontal' ? BOARD_SIZE - shipDef.size : BOARD_SIZE - 1;

      const row = Math.floor(Math.random() * (maxRow + 1));
      const col = Math.floor(Math.random() * (maxCol + 1));

      const ship: Ship = {
        id: `${shipType}_${Date.now()}_${Math.random()}`,
        type: shipType,
        position: { row, col },
        direction,
        isSunk: false,
        hp: shipDef.size,
        maxHp: shipDef.size,
      };

      const tempBoard = placeShips([...ships, ship]);
      if (tempBoard) {
        ships.push(ship);
        placed = true;
      }
    }

    if (!placed) {
      // 配置失敗 - 再帰的にやり直し
      return randomPlaceShips();
    }
  }

  return ships;
}

/**
 * ボードの表示用状態を取得（相手ボード用）
 * 攻撃されていないセルは'empty'として表示
 * @param board - ボード
 * @returns 表示用のセル状態配列
 */
export function getOpponentBoardView(board: Board): CellState[][] {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.state === 'ship') {
        return 'empty'; // 未攻撃の船は見えない
      }
      return cell.state;
    })
  );
}
