import {
  createEmptyBoard,
  canPlaceShip,
  placeShip,
  placeShips,
  processAttack,
  isShipSunk,
  areAllShipsSunk,
  getRemainingHP,
  randomPlaceShips,
  getOpponentBoardView,
} from '@/lib/game/board';
import { BOARD_SIZE } from '@/lib/utils/constants';
import type { Ship, CellState } from '@/types/game';

type BoardType = CellState[][];

describe('Board Logic', () => {
  describe('createEmptyBoard', () => {
    it('should create a 10x10 empty board', () => {
      const board = createEmptyBoard();

      expect(board).toHaveLength(BOARD_SIZE);
      expect(board[0]).toHaveLength(BOARD_SIZE);

      // すべてのセルが空であることを確認
      for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
          expect(board[y][x].state).toBe('empty');
          expect(board[y][x].shipId).toBeNull();
        }
      }
    });
  });

  describe('canPlaceShip', () => {
    it('should return true for valid horizontal placement', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      expect(canPlaceShip(board, ship)).toBe(true);
    });

    it('should return true for valid vertical placement', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'vertical',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      expect(canPlaceShip(board, ship)).toBe(true);
    });

    it('should return false for out of bounds horizontal placement', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 8, y: 0 }, // 8 + 3 = 11 > 10
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      expect(canPlaceShip(board, ship)).toBe(false);
    });

    it('should return false for out of bounds vertical placement', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 8 }, // 8 + 3 = 11 > 10
        direction: 'vertical',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      expect(canPlaceShip(board, ship)).toBe(false);
    });

    it('should return false for overlapping ships', () => {
      const board = createEmptyBoard();
      const ship1: Ship = {
        id: 'ship1',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const ship2: Ship = {
        id: 'ship2',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 2, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const newBoard = placeShip(board, ship1)!;
      expect(canPlaceShip(newBoard, ship2)).toBe(false);
    });
  });

  describe('placeShip', () => {
    it('should place a ship on the board', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const newBoard = placeShip(board, ship);

      expect(newBoard).not.toBeNull();
      expect(newBoard![0][0].state).toBe('ship');
      expect(newBoard![0][1].state).toBe('ship');
      expect(newBoard![0][2].state).toBe('ship');
      expect(newBoard![0][0].shipId).toBe('test-ship');
    });

    it('should return null for invalid placement', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 8, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const newBoard = placeShip(board, ship);
      expect(newBoard).toBeNull();
    });
  });

  describe('processAttack', () => {
    it('should process a miss attack', () => {
      const board = createEmptyBoard();
      const ships: Ship[] = [];

      const result = processAttack(board, ships, { x: 0, y: 0 });

      expect(result.result).toBe('miss');
      expect(result.updatedBoard[0][0].state).toBe('miss');
    });

    it('should process a hit attack', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const newBoard = placeShip(board, ship)!;
      const result = processAttack(newBoard, [ship], { x: 0, y: 0 });

      expect(result.result).toBe('hit');
      expect(result.updatedBoard[0][0].state).toBe('hit');
      expect(result.updatedShips[0].hits[0]).toBe(true);
    });

    it('should not allow attacking already attacked cells', () => {
      const board = createEmptyBoard();
      board[0][0].state = 'hit';

      const result = processAttack(board, [], { x: 0, y: 0 });

      expect(result.result).toBe('hit');
      expect(result.updatedBoard[0][0].state).toBe('hit');
    });
  });

  describe('getRemainingHP', () => {
    it('should return 0 for empty board', () => {
      const board = createEmptyBoard();
      expect(getRemainingHP(board)).toBe(0);
    });

    it('should count ship cells correctly', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const newBoard = placeShip(board, ship)!;
      expect(getRemainingHP(newBoard)).toBe(3);
    });

    it('should not count hit cells', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const newBoard = placeShip(board, ship)!;
      newBoard[0][0].state = 'hit';

      expect(getRemainingHP(newBoard)).toBe(2);
    });
  });

  describe('randomPlaceShips', () => {
    it('should place all 4 ships', () => {
      const result = randomPlaceShips();
      expect(result.ships).toHaveLength(4);
    });

    it('should create valid board from random ships', () => {
      const result = randomPlaceShips();
      expect(result.board).not.toBeNull();
    });

    it('should place 14 total masses', () => {
      const result = randomPlaceShips();
      expect(getRemainingHP(result.board)).toBe(14);
    });
  });

  describe('getOpponentBoardView', () => {
    it('should hide unattacked ships', () => {
      const board = createEmptyBoard();
      const ship: Ship = {
        id: 'test-ship',
        type: 'strawberry_boat',
        size: 3,
        position: { x: 0, y: 0 },
        direction: 'horizontal',
        hits: [false, false, false],
        sunk: false,
        skillUsed: false,
      };

      const newBoard = placeShip(board, ship)!;
      const opponentView = getOpponentBoardView(newBoard);

      expect(opponentView[0][0]).toBe('empty');
      expect(opponentView[0][1]).toBe('empty');
      expect(opponentView[0][2]).toBe('empty');
    });

    it('should show hit and miss cells', () => {
      const board = createEmptyBoard();
      board[0][0].state = 'hit';
      board[0][1].state = 'miss';

      const opponentView = getOpponentBoardView(board);

      expect(opponentView[0][0]).toBe('hit');
      expect(opponentView[0][1]).toBe('miss');
    });
  });
});
