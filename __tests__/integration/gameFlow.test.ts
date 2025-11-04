import { describe, it, expect, beforeEach } from '@jest/globals';
import { createEmptyBoard, placeShip, processAttack, randomPlaceShips, getRemainingHP } from '@/lib/game/board';
import { isValidBoard, isSetupComplete } from '@/lib/game/validation';
import { SHIPS } from '@/lib/utils/constants';
import type { Ship, Board } from '@/types/game';

// ゲーム終了判定（船が全て撃沈されているか）
function isGameFinished(ships: Ship[]): boolean {
  return ships.every((ship) => ship.isSunk);
}

describe('Game Flow Integration Tests', () => {
  describe('Complete Game Flow', () => {
    let playerBoard: Board;
    let playerShips: Ship[];
    let opponentBoard: Board;
    let opponentShips: Ship[];

    beforeEach(() => {
      // プレイヤー1の船配置
      const player1Setup = randomPlaceShips();
      playerBoard = player1Setup.board;
      playerShips = player1Setup.ships;

      // プレイヤー2の船配置
      const player2Setup = randomPlaceShips();
      opponentBoard = player2Setup.board;
      opponentShips = player2Setup.ships;
    });

    it('should set up valid boards for both players', () => {
      expect(isSetupComplete(playerShips)).toBe(true);
      expect(isSetupComplete(opponentShips)).toBe(true);
    });

    it('should process attacks and update board state', () => {
      const attackPosition = { row: 0, col: 0 };
      const result = processAttack(opponentBoard, opponentShips, attackPosition);

      expect(result).toBeDefined();
      expect(['hit', 'miss', 'sunk']).toContain(result.result);
      expect(result.updatedBoard).toBeDefined();
      expect(result.updatedShips).toBeDefined();
    });

    it('should detect game end when all ships are sunk', () => {
      // すべての船を撃沈する
      const sunkShips = opponentShips.map((ship) => ({
        ...ship,
        hp: 0,
        isSunk: true,
      }));

      expect(isGameFinished(sunkShips)).toBe(true);
    });

    it('should not end game when ships remain', () => {
      expect(isGameFinished(opponentShips)).toBe(false);
    });

    it('should handle full game simulation', () => {
      let currentBoard = opponentBoard;
      let currentShips = opponentShips;
      let turnCount = 0;
      const maxTurns = 100; // 無限ループ防止

      // ゲームが終了するまで攻撃を続ける（ランダム）
      while (!isGameFinished(currentShips) && turnCount < maxTurns) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        const result = processAttack(currentBoard, currentShips, { row, col });
        currentBoard = result.updatedBoard;
        currentShips = result.updatedShips;

        turnCount++;
      }

      // ゲームが終了したか、最大ターン数に達したことを確認
      expect(turnCount).toBeLessThanOrEqual(maxTurns);

      // もしゲームが終了していれば、すべての船が撃沈されているはず
      if (isGameFinished(currentShips)) {
        expect(currentShips.every((ship) => ship.isSunk)).toBe(true);
      }
    });
  });

  describe('Ship Placement Flow', () => {
    it('should place all ships correctly', () => {
      let board = createEmptyBoard();
      const placedShips: Ship[] = [];

      for (const shipDef of SHIPS) {
        // ランダムな位置と向きを試す
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
          const row = Math.floor(Math.random() * 10);
          const col = Math.floor(Math.random() * 10);
          const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';

          const ship: Ship = {
            id: shipDef.id,
            name: shipDef.name,
            size: shipDef.size,
            position: { row, col },
            orientation: orientation as 'horizontal' | 'vertical',
            hp: shipDef.size,
            maxHp: shipDef.size,
            isSunk: false,
            skill: shipDef.skill,
          };

          const newBoard = placeShip(board, ship);
          if (newBoard) {
            board = newBoard;
            placedShips.push(ship);
            placed = true;
          }

          attempts++;
        }

        expect(placed).toBe(true);
      }

      expect(placedShips).toHaveLength(SHIPS.length);
      expect(isSetupComplete(placedShips)).toBe(true);
    });
  });

  describe('Attack Patterns', () => {
    it('should handle sequential attacks correctly', () => {
      const { board, ships } = randomPlaceShips();

      // 同じ位置への連続攻撃
      const pos = { row: 5, col: 5 };
      const result1 = processAttack(board, ships, pos);
      const result2 = processAttack(result1.updatedBoard, result1.updatedShips, pos);

      // 2回目の攻撃結果は1回目と同じはず（既に攻撃済み）
      expect(result2.result).toBe(result1.result);
    });

    it('should handle attacks on all cells', () => {
      const { board, ships } = randomPlaceShips();
      let currentBoard = board;
      let currentShips = ships;

      // すべてのセルを攻撃
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const result = processAttack(currentBoard, currentShips, { row, col });
          currentBoard = result.updatedBoard;
          currentShips = result.updatedShips;
        }
      }

      // すべての船が撃沈されているはず
      expect(currentShips.every((ship) => ship.isSunk)).toBe(true);
      expect(isGameFinished(currentShips)).toBe(true);
    });
  });
});
