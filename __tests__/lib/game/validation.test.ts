import {
  isValidPosition,
  isValidShipPlacement,
  hasNoShipOverlap,
  isValidBoard,
  isSetupComplete,
  isGameFinished,
} from '@/lib/game/validation';
import { createEmptyBoard } from '@/lib/game/board';
import { BOARD_SIZE } from '@/lib/utils/constants';
import type { Ship, GameState } from '@/types/game';

describe('Validation Logic', () => {
  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
      expect(isValidPosition({ row: 5, col: 5 })).toBe(true);
      expect(isValidPosition({ row: 9, col: 9 })).toBe(true);
    });

    it('should return false for negative positions', () => {
      expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
      expect(isValidPosition({ row: 0, col: -1 })).toBe(false);
    });

    it('should return false for out of bounds positions', () => {
      expect(isValidPosition({ row: 10, col: 0 })).toBe(false);
      expect(isValidPosition({ row: 0, col: 10 })).toBe(false);
      expect(isValidPosition({ row: 100, col: 100 })).toBe(false);
    });
  });

  describe('isValidShipPlacement', () => {
    const createTestShip = (type: string, row: number, col: number, direction: 'horizontal' | 'vertical'): Ship => ({
      id: `ship-${type}`,
      type: type as any,
      position: { row, col },
      direction,
      isSunk: false,
      hp: type === 'strawberry_boat' ? 3 : type === 'cocoa_submarine' ? 5 : type === 'macaron_ufo' ? 4 : 2,
      maxHp: type === 'strawberry_boat' ? 3 : type === 'cocoa_submarine' ? 5 : type === 'macaron_ufo' ? 4 : 2,
    });

    it('should return true for valid 4-ship placement', () => {
      const ships: Ship[] = [
        createTestShip('strawberry_boat', 0, 0, 'horizontal'), // 3マス
        createTestShip('cocoa_submarine', 1, 0, 'horizontal'), // 5マス
        createTestShip('macaron_ufo', 2, 0, 'horizontal'),     // 4マス
        createTestShip('waffle_ship', 3, 0, 'horizontal'),     // 2マス
      ];

      expect(isValidShipPlacement(ships)).toBe(true);
    });

    it('should return false for wrong number of ships', () => {
      const ships: Ship[] = [
        createTestShip('strawberry_boat', 0, 0, 'horizontal'),
      ];

      expect(isValidShipPlacement(ships)).toBe(false);
    });

    it('should return false for duplicate ship types', () => {
      const ships: Ship[] = [
        createTestShip('strawberry_boat', 0, 0, 'horizontal'),
        createTestShip('strawberry_boat', 1, 0, 'horizontal'),
        createTestShip('macaron_ufo', 2, 0, 'horizontal'),
        createTestShip('waffle_ship', 3, 0, 'horizontal'),
      ];

      expect(isValidShipPlacement(ships)).toBe(false);
    });

    it('should return false for invalid positions', () => {
      const ships: Ship[] = [
        createTestShip('strawberry_boat', -1, 0, 'horizontal'), // 無効な位置
        createTestShip('cocoa_submarine', 1, 0, 'horizontal'),
        createTestShip('macaron_ufo', 2, 0, 'horizontal'),
        createTestShip('waffle_ship', 3, 0, 'horizontal'),
      ];

      expect(isValidShipPlacement(ships)).toBe(false);
    });

    it('should return false for out of bounds placement', () => {
      const ships: Ship[] = [
        createTestShip('strawberry_boat', 0, 8, 'horizontal'), // 8 + 3 = 11 > 10
        createTestShip('cocoa_submarine', 1, 0, 'horizontal'),
        createTestShip('macaron_ufo', 2, 0, 'horizontal'),
        createTestShip('waffle_ship', 3, 0, 'horizontal'),
      ];

      expect(isValidShipPlacement(ships)).toBe(false);
    });
  });

  describe('hasNoShipOverlap', () => {
    const createTestShip = (id: string, row: number, col: number, size: number, direction: 'horizontal' | 'vertical'): Ship => ({
      id,
      type: 'strawberry_boat',
      position: { row, col },
      direction,
      isSunk: false,
      hp: size,
      maxHp: size,
    });

    it('should return true for non-overlapping ships', () => {
      const ships: Ship[] = [
        createTestShip('ship1', 0, 0, 3, 'horizontal'),
        createTestShip('ship2', 1, 0, 3, 'horizontal'),
      ];

      expect(hasNoShipOverlap(ships)).toBe(true);
    });

    it('should return false for overlapping ships', () => {
      const ships: Ship[] = [
        createTestShip('ship1', 0, 0, 3, 'horizontal'), // 0,0 ~ 0,2
        createTestShip('ship2', 0, 2, 3, 'horizontal'), // 0,2 ~ 0,4 (overlap at 0,2)
      ];

      expect(hasNoShipOverlap(ships)).toBe(false);
    });

    it('should return false for completely overlapping ships', () => {
      const ships: Ship[] = [
        createTestShip('ship1', 0, 0, 3, 'horizontal'),
        createTestShip('ship2', 0, 0, 3, 'horizontal'),
      ];

      expect(hasNoShipOverlap(ships)).toBe(false);
    });

    it('should return true for adjacent but not overlapping ships', () => {
      const ships: Ship[] = [
        createTestShip('ship1', 0, 0, 3, 'horizontal'), // 0,0 ~ 0,2
        createTestShip('ship2', 0, 3, 3, 'horizontal'), // 0,3 ~ 0,5
      ];

      expect(hasNoShipOverlap(ships)).toBe(true);
    });
  });

  describe('isValidBoard', () => {
    it('should return true for valid board', () => {
      const board = createEmptyBoard();
      expect(isValidBoard(board)).toBe(true);
    });

    it('should return false for invalid board size (rows)', () => {
      const board = Array.from({ length: 5 }, () =>
        Array.from({ length: BOARD_SIZE }, () => ({ state: 'empty' as const, shipId: null }))
      );
      expect(isValidBoard(board)).toBe(false);
    });

    it('should return false for invalid board size (cols)', () => {
      const board = Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: 5 }, () => ({ state: 'empty' as const, shipId: null }))
      );
      expect(isValidBoard(board)).toBe(false);
    });
  });

  describe('isSetupComplete', () => {
    const createMockGameState = (player1Ships: Ship[], player2Ships: Ship[]): GameState => ({
      gameId: 'test-game',
      mode: 'cpu',
      phase: 'setup',
      turnPhase: 'main',
      currentTurn: 'player1',
      players: {
        player1: {
          id: 'player1',
          character: 'strawberry',
          ships: player1Ships,
          board: createEmptyBoard(),
          remainingHP: 14,
          availableSkills: [],
          usedSkills: [],
        },
        player2: {
          id: 'player2',
          character: 'cpu_easy',
          ships: player2Ships,
          board: createEmptyBoard(),
          remainingHP: 14,
          availableSkills: [],
          usedSkills: [],
        },
      },
      turnCount: 0,
      winner: null,
      history: [],
    });

    it('should return false when ships are not placed', () => {
      const gameState = createMockGameState([], []);
      expect(isSetupComplete(gameState)).toBe(false);
    });

    it('should return false when only one player has ships', () => {
      const ships: Ship[] = [
        { id: 's1', type: 'strawberry_boat', position: { row: 0, col: 0 }, direction: 'horizontal', isSunk: false, hp: 3, maxHp: 3 },
        { id: 's2', type: 'cocoa_submarine', position: { row: 1, col: 0 }, direction: 'horizontal', isSunk: false, hp: 5, maxHp: 5 },
        { id: 's3', type: 'macaron_ufo', position: { row: 2, col: 0 }, direction: 'horizontal', isSunk: false, hp: 4, maxHp: 4 },
        { id: 's4', type: 'waffle_ship', position: { row: 3, col: 0 }, direction: 'horizontal', isSunk: false, hp: 2, maxHp: 2 },
      ];

      const gameState = createMockGameState(ships, []);
      expect(isSetupComplete(gameState)).toBe(false);
    });
  });

  describe('isGameFinished', () => {
    const createMockGameState = (phase: 'setup' | 'battle' | 'finished', remainingHP: number): GameState => ({
      gameId: 'test-game',
      mode: 'cpu',
      phase,
      turnPhase: 'main',
      currentTurn: 'player1',
      players: {
        player1: {
          id: 'player1',
          character: 'strawberry',
          ships: [],
          board: createEmptyBoard(),
          remainingHP,
          availableSkills: [],
          usedSkills: [],
        },
        player2: {
          id: 'player2',
          character: 'cpu_easy',
          ships: [],
          board: createEmptyBoard(),
          remainingHP: 14,
          availableSkills: [],
          usedSkills: [],
        },
      },
      turnCount: 0,
      winner: null,
      history: [],
    });

    it('should return true when phase is finished', () => {
      const gameState = createMockGameState('finished', 14);
      expect(isGameFinished(gameState)).toBe(true);
    });

    it('should return true when player HP is 0', () => {
      const gameState = createMockGameState('battle', 0);
      expect(isGameFinished(gameState)).toBe(true);
    });

    it('should return false when game is ongoing', () => {
      const gameState = createMockGameState('battle', 10);
      expect(isGameFinished(gameState)).toBe(false);
    });
  });
});
