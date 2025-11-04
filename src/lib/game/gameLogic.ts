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
    turnPhase: 'start',
    currentTurn: 'player1',
    players: {
      player1: {
        id: 'player1',
        character: player1Character,
        ships: [],
        board: createEmptyBoard(),
        hp: 100,
        remainingMasses: TOTAL_MASSES,
        totalMasses: TOTAL_MASSES,
        shieldActive: false,
        activeSkills: [],
        isReady: false,
      },
      player2: {
        id: 'player2',
        character: player2Character,
        ships: [],
        board: createEmptyBoard(),
        hp: 100,
        remainingMasses: TOTAL_MASSES,
        totalMasses: TOTAL_MASSES,
        shieldActive: false,
        activeSkills: [],
        isReady: false,
      },
    },
    attackedCells: {
      player1: new Set<string>(),
      player2: new Set<string>(),
    },
    turnCount: 0,
    winner: null,
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
    // activeSkills は初期状態では空配列（スキル使用時に追加される）
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

    case 'useSkill':
      newGameState = processSkillAction(newGameState, action);
      break;

    case 'placeShip':
      // setupPlayerShips を使用（個別の船配置）
      // TODO: placeShip アクションのデータ構造に合わせて実装を修正
      break;

    case 'ready':
      // プレイヤーの準備完了
      newGameState.players[action.playerId].isReady = true;
      break;

    case 'endTurn':
      // ターン終了処理
      // TODO: ターン終了ロジックの実装
      break;

    case 'requestRematch':
      // リマッチ要求
      // TODO: リマッチロジックの実装
      break;

    default:
      throw new Error('Unknown action type');
  }

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
  if (action.type !== 'attack') {
    throw new Error('Invalid attack action');
  }

  const attackData = action.data as import('@/types/game').AttackActionData;
  const position = attackData.position;

  const opponentId: PlayerId = action.playerId === 'player1' ? 'player2' : 'player1';
  const opponent = gameState.players[opponentId];

  // 攻撃処理（board.tsのprocessAttackを使用）
  const { result, updatedBoard, updatedShips } = processAttack(
    opponent.board,
    opponent.ships,
    position
  );

  // 残存マス数を更新
  const remainingMasses = getRemainingHP(updatedBoard);

  // HPパーセンテージを計算
  const hp = Math.floor((remainingMasses / opponent.totalMasses) * 100);

  // 勝者判定
  let winner: PlayerId | null = null;
  if (areAllShipsSunk(updatedBoard, updatedShips) || remainingMasses <= 0) {
    winner = action.playerId;
  }

  // ターン交代
  const newGameState: GameState = {
    ...gameState,
    players: {
      ...gameState.players,
      [opponentId]: {
        ...opponent,
        board: updatedBoard,
        ships: updatedShips,
        remainingMasses,
        hp,
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
  if (action.type !== 'useSkill') {
    throw new Error('Invalid skill action');
  }

  const player = gameState.players[action.playerId];
  const skillData = action.data as import('@/types/game').SkillActionData;
  const skillId = skillData.skillUse.skillId;

  // スキルIDを使用済みリストに追加
  const newActiveSkills = player.activeSkills.includes(skillId)
    ? player.activeSkills
    : [...player.activeSkills, skillId];

  // TODO: 実際のスキル効果を実装（Week 3）

  const newGameState: GameState = {
    ...gameState,
    players: {
      ...gameState.players,
      [action.playerId]: {
        ...player,
        activeSkills: newActiveSkills,
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
    remainingHP: player.hp,
    opponentRemainingHP: opponent.hp,
    skillsUsed: player.activeSkills.length,
    turnCount: gameState.turnCount,
  };
}
