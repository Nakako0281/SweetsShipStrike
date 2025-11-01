import { v4 as uuidv4 } from 'uuid';
import { TOTAL_MASSES } from '@/lib/utils/constants';
import { SHIP_DEFINITIONS } from '@/lib/game/ships';
import {
  createEmptyBoard,
  placeShips,
  processAttack,
  getRemainingHP,
  areAllShipsSunk,
} from '@/lib/game/board';
import {
  isValidAction,
  isSetupComplete,
  isGameFinished,
} from '@/lib/game/validation';
import type {
  GameState,
  GameAction,
  PlayerId,
  CharacterType,
  GameMode,
  Ship,
  AttackResult,
} from '@/types/game';

/**
 * ゲームロジック
 * ゲーム状態の管理、アクションの処理、ターン管理などのコアロジック
 */

/**
 * 新しいゲームを作成
 * @param mode - ゲームモード
 * @param player1Character - プレイヤー1のキャラクター
 * @param player2Character - プレイヤー2のキャラクター
 * @returns 初期ゲーム状態
 */
export function createGame(
  mode: GameMode,
  player1Character: CharacterType,
  player2Character: CharacterType
): GameState {
  const gameId = uuidv4();

  return {
    gameId,
    mode,
    phase: 'setup',
    turnPhase: 'main',
    currentTurn: 'player1',
    players: {
      player1: {
        id: 'player1',
        character: player1Character,
        ships: [],
        board: createEmptyBoard(),
        remainingHP: TOTAL_MASSES,
        availableSkills: [],
        usedSkills: [],
      },
      player2: {
        id: 'player2',
        character: player2Character,
        ships: [],
        board: createEmptyBoard(),
        remainingHP: TOTAL_MASSES,
        availableSkills: [],
        usedSkills: [],
      },
    },
    turnCount: 0,
    winner: null,
    history: [],
  };
}

/**
 * プレイヤーの船を配置
 * @param gameState - ゲーム状態
 * @param playerId - プレイヤーID
 * @param ships - 配置する船の配列
 * @returns 新しいゲーム状態
 */
export function setupPlayerShips(
  gameState: GameState,
  playerId: PlayerId,
  ships: Ship[]
): GameState {
  const newBoard = placeShips(ships);
  if (!newBoard) {
    throw new Error('Invalid ship placement');
  }

  const newGameState: GameState = {
    ...gameState,
    players: {
      ...gameState.players,
      [playerId]: {
        ...gameState.players[playerId],
        ships,
        board: newBoard,
      },
    },
  };

  // 両プレイヤーの配置が完了したら、ゲーム開始
  if (isSetupComplete(newGameState)) {
    newGameState.phase = 'battle';
    newGameState.turnPhase = 'attack';

    // スキルの初期化
    for (const pid of ['player1', 'player2'] as PlayerId[]) {
      const player = newGameState.players[pid];
      const availableSkills = player.ships.map((ship) => {
        const shipDef = SHIP_DEFINITIONS[ship.type];
        return {
          ...shipDef.skill,
          isUsed: false,
          shipId: ship.id,
        };
      });
      newGameState.players[pid] = {
        ...player,
        availableSkills,
      };
    }
  }

  return newGameState;
}

/**
 * アクションを処理
 * @param gameState - ゲーム状態
 * @param action - アクション
 * @returns 新しいゲーム状態
 */
export function processAction(
  gameState: GameState,
  action: GameAction
): GameState {
  // アクションの有効性チェック
  if (!isValidAction(action, gameState)) {
    throw new Error('Invalid action');
  }

  let newGameState = { ...gameState };

  switch (action.type) {
    case 'attack':
      newGameState = processAttackAction(newGameState, action);
      break;

    case 'use_skill':
      newGameState = processSkillAction(newGameState, action);
      break;

    case 'surrender':
      newGameState = processSurrenderAction(newGameState, action);
      break;

    case 'place_ships':
      // setupPlayerShips を使用
      if (action.ships) {
        newGameState = setupPlayerShips(newGameState, action.playerId, action.ships);
      }
      break;

    default:
      throw new Error('Unknown action type');
  }

  // 履歴に追加
  newGameState.history = [...newGameState.history, action];

  // ゲーム終了チェック
  if (isGameFinished(newGameState)) {
    newGameState.phase = 'finished';
  }

  return newGameState;
}

/**
 * 攻撃アクションを処理
 * @param gameState - ゲーム状態
 * @param action - 攻撃アクション
 * @returns 新しいゲーム状態
 */
function processAttackAction(
  gameState: GameState,
  action: GameAction
): GameState {
  if (action.type !== 'attack' || !action.position) {
    throw new Error('Invalid attack action');
  }

  const opponentId: PlayerId = action.playerId === 'player1' ? 'player2' : 'player1';
  const opponent = gameState.players[opponentId];

  // 攻撃処理
  const attackResult: AttackResult = processAttack(
    opponent.board,
    action.position,
    opponent.ships
  );

  // ボードを更新
  const newBoard = [...opponent.board];
  const { row, col } = action.position;
  newBoard[row] = [...newBoard[row]];
  newBoard[row][col] = {
    ...newBoard[row][col],
    state: attackResult.newCellState,
  };

  // 船のHPと撃沈状態を更新
  const newShips = opponent.ships.map((ship) => {
    if (attackResult.isHit && ship.id === newBoard[row][col].shipId) {
      return {
        ...ship,
        hp: Math.max(0, ship.hp - 1),
        isSunk: attackResult.isSunk && ship.id === attackResult.sunkShipId,
      };
    }
    return ship;
  });

  // HPを更新
  const remainingHP = getRemainingHP(newBoard);

  // 勝者判定
  let winner: PlayerId | null = null;
  if (areAllShipsSunk(newBoard, newShips) || remainingHP <= 0) {
    winner = action.playerId;
  }

  // ターン交代
  const newGameState: GameState = {
    ...gameState,
    players: {
      ...gameState.players,
      [opponentId]: {
        ...opponent,
        board: newBoard,
        ships: newShips,
        remainingHP,
      },
    },
    currentTurn: opponentId,
    turnPhase: 'attack',
    turnCount: gameState.turnCount + 1,
    winner,
  };

  return newGameState;
}

/**
 * スキルアクションを処理（仮実装）
 * @param gameState - ゲーム状態
 * @param action - スキルアクション
 * @returns 新しいゲーム状態
 */
function processSkillAction(
  gameState: GameState,
  action: GameAction
): GameState {
  if (action.type !== 'use_skill' || !action.skillId) {
    throw new Error('Invalid skill action');
  }

  const player = gameState.players[action.playerId];

  // スキルを使用済みにする
  const newAvailableSkills = player.availableSkills.map((skill) =>
    skill.id === action.skillId ? { ...skill, isUsed: true } : skill
  );

  const usedSkill = player.availableSkills.find((s) => s.id === action.skillId);
  const newUsedSkills = usedSkill
    ? [...player.usedSkills, usedSkill]
    : player.usedSkills;

  // TODO: 実際のスキル効果を実装（Week 3）

  const newGameState: GameState = {
    ...gameState,
    players: {
      ...gameState.players,
      [action.playerId]: {
        ...player,
        availableSkills: newAvailableSkills,
        usedSkills: newUsedSkills,
      },
    },
  };

  return newGameState;
}

/**
 * 降参アクションを処理
 * @param gameState - ゲーム状態
 * @param action - 降参アクション
 * @returns 新しいゲーム状態
 */
function processSurrenderAction(
  gameState: GameState,
  action: GameAction
): GameState {
  const winner: PlayerId = action.playerId === 'player1' ? 'player2' : 'player1';

  return {
    ...gameState,
    phase: 'finished',
    winner,
  };
}

/**
 * 現在のターンのプレイヤーを取得
 * @param gameState - ゲーム状態
 * @returns 現在のプレイヤーID
 */
export function getCurrentPlayer(gameState: GameState): PlayerId {
  return gameState.currentTurn;
}

/**
 * 対戦相手のプレイヤーIDを取得
 * @param playerId - プレイヤーID
 * @returns 対戦相手のプレイヤーID
 */
export function getOpponentId(playerId: PlayerId): PlayerId {
  return playerId === 'player1' ? 'player2' : 'player1';
}

/**
 * ゲームの勝者を取得
 * @param gameState - ゲーム状態
 * @returns 勝者のプレイヤーID（ゲーム中はnull）
 */
export function getWinner(gameState: GameState): PlayerId | null {
  return gameState.winner;
}

/**
 * ゲームの統計情報を取得
 * @param gameState - ゲーム状態
 * @param playerId - プレイヤーID
 * @returns 統計情報
 */
export function getGameStats(gameState: GameState, playerId: PlayerId) {
  const player = gameState.players[playerId];
  const opponentId = getOpponentId(playerId);
  const opponent = gameState.players[opponentId];

  let hitCount = 0;
  let missCount = 0;

  // 相手ボードの攻撃結果をカウント
  for (const row of opponent.board) {
    for (const cell of row) {
      if (cell.state === 'hit') hitCount++;
      if (cell.state === 'miss') missCount++;
    }
  }

  return {
    hitCount,
    missCount,
    remainingHP: player.remainingHP,
    opponentRemainingHP: opponent.remainingHP,
    skillsUsed: player.usedSkills.length,
    turnCount: gameState.turnCount,
  };
}
