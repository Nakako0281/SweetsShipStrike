import { BOARD_SIZE } from '@/lib/utils/constants';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import type {
  CellState,
  Position,
  Ship,
  ShipType,
  Direction,
  AttackResult,
  BoardCell,
  InternalBoard,
} from '@/types/game';

// 型エイリアス（後方互換性とコード可読性のため）
export type Cell = BoardCell;
export type Board = InternalBoard;

/**
 * ボード管理ロジック
 * ボードの初期化、船の配置、攻撃処理などを管理
 */

/**
 * InternalBoardをDisplayBoardに変換（表示用）
 * @param board - 内部ボード
 * @returns 表示用ボード
 */
export function toDisplayBoard(board: InternalBoard): CellState[][] {
  return board.map((row) =>
    row.map((cell) => {
      // 'ship'状態は外部には'empty'として見せる（未攻撃）
      return cell.state === 'ship' ? 'empty' : cell.state;
    })
  );
}

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

  if (!position) {
    return false; // 位置が指定されていない
  }

  const { x, y } = position;

  // ボード外チェック
  if (direction === 'horizontal' && x + shipDef.size > BOARD_SIZE) {
    return false;
  }
  if (direction === 'vertical' && y + shipDef.size > BOARD_SIZE) {
    return false;
  }

  // 重複チェック
  for (let i = 0; i < shipDef.size; i++) {
    const checkY = direction === 'vertical' ? y + i : y;
    const checkX = direction === 'horizontal' ? x + i : x;

    if (board[checkY][checkX].state !== 'empty') {
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

  // canPlaceShipでnullチェック済み
  if (!ship.position) {
    return null;
  }

  const { x, y } = ship.position;

  for (let i = 0; i < shipDef.size; i++) {
    const targetY = ship.direction === 'vertical' ? y + i : y;
    const targetX = ship.direction === 'horizontal' ? x + i : x;

    newBoard[targetY][targetX] = {
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
  ships: Ship[],
  position: Position
): {
  result: 'hit' | 'miss' | 'sunk';
  updatedBoard: Board;
  updatedShips: Ship[];
} {
  const { x, y } = position;
  const cell = board[y][x];

  // 新しいボードを作成
  const updatedBoard = board.map((row) => row.map((c) => ({ ...c })));

  // 既に攻撃済み
  if (cell.state === 'hit' || cell.state === 'miss') {
    return {
      result: cell.state === 'hit' ? 'hit' : 'miss',
      updatedBoard: board,
      updatedShips: ships,
    };
  }

  // ミス
  if (cell.state === 'empty') {
    updatedBoard[y][x].state = 'miss';
    return {
      result: 'miss',
      updatedBoard,
      updatedShips: ships,
    };
  }

  // ヒット
  const shipId = cell.shipId;
  const targetShip = ships.find((s) => s.id === shipId);

  if (!targetShip) {
    // 船が見つからない場合はミス扱い
    updatedBoard[y][x].state = 'miss';
    return {
      result: 'miss',
      updatedBoard,
      updatedShips: ships,
    };
  }

  // ボードを更新
  updatedBoard[y][x].state = 'hit';

  // 船のhits配列を更新
  const updatedShips = ships.map((ship) => {
    if (ship.id !== shipId) return ship;
    if (!ship.position) return ship; // 配置されていない船（通常ありえない）

    // どの位置がヒットしたか計算
    const { x: shipX, y: shipY } = ship.position;
    const hitIndex =
      ship.direction === 'horizontal' ? x - shipX : y - shipY;

    const newHits = [...ship.hits];
    newHits[hitIndex] = true;

    const allHit = newHits.every((h) => h);

    return {
      ...ship,
      hits: newHits,
      sunk: allHit,
    };
  });

  // 船が沈んだかチェック
  const updatedShip = updatedShips.find((s) => s.id === shipId)!;
  const isSunk = updatedShip.sunk;

  return {
    result: isSunk ? 'sunk' : 'hit',
    updatedBoard,
    updatedShips,
  };
}

/**
 * 船が沈んだかチェック
 * @param board - ボード
 * @param ship - チェックする船
 * @returns 沈んでいればtrue
 */
export function isShipSunk(board: Board, ship: Ship): boolean {
  if (!ship.position) {
    return false;
  }

  const shipDef = SHIP_DEFINITIONS[ship.type];
  const { x, y } = ship.position;

  for (let i = 0; i < shipDef.size; i++) {
    const checkY = ship.direction === 'vertical' ? y + i : y;
    const checkX = ship.direction === 'horizontal' ? x + i : x;

    // まだヒットしていない部分があれば沈んでいない
    if (board[checkY][checkX].state !== 'hit') {
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

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x].state === 'ship') {
        hp++;
      }
    }
  }

  return hp;
}

/**
 * ランダムに船を配置
 * @returns 配置された船の配列とボード
 */
export function randomPlaceShips(): { board: Board; ships: Ship[] } {
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

      const maxY =
        direction === 'vertical' ? BOARD_SIZE - shipDef.size : BOARD_SIZE - 1;
      const maxX =
        direction === 'horizontal' ? BOARD_SIZE - shipDef.size : BOARD_SIZE - 1;

      const y = Math.floor(Math.random() * (maxY + 1));
      const x = Math.floor(Math.random() * (maxX + 1));

      const ship: Ship = {
        id: `${shipType}_${Date.now()}_${Math.random()}`,
        type: shipType,
        size: shipDef.size,
        position: { x, y },
        direction,
        hits: Array(shipDef.size).fill(false),
        sunk: false,
        skillUsed: false,
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

  const board = placeShips(ships);
  if (!board) {
    // 配置失敗 - 再帰的にやり直し
    return randomPlaceShips();
  }

  return { board, ships };
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
