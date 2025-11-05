import type { GameState, PlayerId } from '@/types/game';
import type { PlayerStats, GameMode } from '@/types/ui';

/**
 * 統計管理
 */

const STORAGE_KEY = 'playerStats';

/**
 * デフォルト統計作成
 */
export function createDefaultPlayerStats(): PlayerStats {
  return {
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalTurns: 0,
    averageTurns: 0,
    fastestWin: null,
    longestGame: 0,
    perfectWins: 0,
    comebackWins: 0,
    onlineGames: 0,
    cpuGames: 0,
  };
}

/**
 * 統計読み込み
 */
export function loadPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') return createDefaultPlayerStats();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return createDefaultPlayerStats();

  try {
    return JSON.parse(stored) as PlayerStats;
  } catch {
    return createDefaultPlayerStats();
  }
}

/**
 * 統計保存
 */
export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

/**
 * 統計リセット
 */
export function resetPlayerStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * ゲーム結果から統計更新
 */
export function updateGameStats(
  gameState: GameState,
  localPlayerId: PlayerId,
  mode: GameMode
): PlayerStats {
  const stats = loadPlayerStats();
  const isVictory = gameState.winner === localPlayerId;
  const turnCount = gameState.turnCount;

  // 基本統計更新
  stats.totalGames += 1;
  if (isVictory) {
    stats.wins += 1;
  } else {
    stats.losses += 1;
  }

  // 勝率計算
  stats.winRate = (stats.wins / stats.totalGames) * 100;

  // ターン統計更新
  stats.totalTurns += turnCount;
  stats.averageTurns = stats.totalTurns / stats.totalGames;

  // 最速勝利更新
  if (isVictory) {
    if (stats.fastestWin === null || turnCount < stats.fastestWin) {
      stats.fastestWin = turnCount;
    }
  }

  // 最長ゲーム更新
  if (turnCount > stats.longestGame) {
    stats.longestGame = turnCount;
  }

  // 完全勝利チェック
  if (isVictory && checkPerfectWin(gameState, localPlayerId)) {
    stats.perfectWins += 1;
  }

  // 逆転勝利チェック
  if (isVictory && checkComebackWin(gameState, localPlayerId)) {
    stats.comebackWins += 1;
  }

  // モード別統計
  if (mode === 'online') {
    stats.onlineGames += 1;
  } else {
    stats.cpuGames += 1;
  }

  // 保存
  savePlayerStats(stats);

  return stats;
}

/**
 * 完全勝利判定（自分のHPが満タン）
 */
export function checkPerfectWin(gameState: GameState, playerId: PlayerId): boolean {
  const player = gameState.players[playerId];

  // すべての船が無傷かチェック
  return player.ships.every(ship => ship.hitIndexes.length === 0);
}

/**
 * 逆転勝利判定（HP 30%以下から勝利）
 */
export function checkComebackWin(gameState: GameState, playerId: PlayerId): boolean {
  const player = gameState.players[playerId];

  // 総HP計算
  const totalHP = player.ships.reduce((sum, ship) => sum + ship.size, 0);

  // 残りHP計算
  const remainingHP = player.ships.reduce((sum, ship) => {
    if (ship.isSunk) return sum;
    return sum + (ship.size - ship.hitIndexes.length);
  }, 0);

  // HP 30%以下かチェック
  const hpPercentage = (remainingHP / totalHP) * 100;
  return hpPercentage <= 30;
}

/**
 * 全スキル使用判定
 */
export function checkAllSkillsUsed(gameState: GameState, playerId: PlayerId): boolean {
  const player = gameState.players[playerId];
  return player.ships.every(ship => ship.skillUsed);
}
