import type { GameResult, CoinReward, GameMode } from '@/types/ui';
import type { GameState } from '@/types/game';

/**
 * コイン報酬計算
 */

// 基本報酬
const BASE_REWARDS = {
  victory: 100,
  defeat: 30,
} as const;

// ボーナス報酬
const BONUS_REWARDS = {
  online: 50,          // オンライン対戦
  speedWin: 30,        // 速攻勝利（10ターン以内）
  perfectWin: 50,      // 完全勝利（HP満タン）
  comebackWin: 40,     // 逆転勝利（HP 30%以下から）
  allSkillsUsed: 20,   // 全スキル使用
} as const;

// 速攻勝利の閾値
const SPEED_WIN_THRESHOLD = 10;

// 完全勝利のHP閾値
const PERFECT_WIN_HP = 20;

// 逆転勝利のHP閾値（この値以下から勝利）
const COMEBACK_WIN_HP = 6;

/**
 * コイン報酬を計算
 */
export function calculateCoinReward(
  result: GameResult,
  gameState: GameState,
  mode: GameMode
): CoinReward {
  const isVictory = result === 'victory';

  // 基本報酬
  const baseAmount = isVictory ? BASE_REWARDS.victory : BASE_REWARDS.defeat;

  const bonuses: { type: string; amount: number; reason: string }[] = [];

  if (isVictory) {
    // オンライン対戦ボーナス
    if (mode === 'online') {
      bonuses.push({
        type: 'online',
        amount: BONUS_REWARDS.online,
        reason: 'オンライン対戦勝利',
      });
    }

    // 速攻勝利ボーナス
    if (gameState.turnCount <= SPEED_WIN_THRESHOLD) {
      bonuses.push({
        type: 'speedWin',
        amount: BONUS_REWARDS.speedWin,
        reason: `速攻勝利（${gameState.turnCount}ターン）`,
      });
    }

    // 完全勝利ボーナス（自分のHPが満タン）
    const winnerId = gameState.winner!;
    const winnerHP = calculateHP(gameState.players[winnerId]);
    if (winnerHP === PERFECT_WIN_HP) {
      bonuses.push({
        type: 'perfectWin',
        amount: BONUS_REWARDS.perfectWin,
        reason: '完全勝利（無傷）',
      });
    }

    // 全スキル使用ボーナス
    const allSkillsUsed = checkAllSkillsUsed(gameState.players[winnerId]);
    if (allSkillsUsed) {
      bonuses.push({
        type: 'allSkillsUsed',
        amount: BONUS_REWARDS.allSkillsUsed,
        reason: '全スキル使用',
      });
    }
  }

  // 合計金額計算
  const bonusTotal = bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
  const totalAmount = baseAmount + bonusTotal;

  return {
    baseAmount,
    bonuses,
    totalAmount,
  };
}

/**
 * HP計算（船の残存マス数の合計）
 */
function calculateHP(player: GameState['players']['player1']): number {
  return player.ships.reduce((total, ship) => {
    if (ship.isSunk) return total;
    const hitCount = ship.hitIndexes.length;
    return total + (ship.size - hitCount);
  }, 0);
}

/**
 * 全スキル使用チェック
 */
function checkAllSkillsUsed(player: GameState['players']['player1']): boolean {
  // すべての船のスキルが使用済みかチェック
  return player.ships.every(ship => ship.skillUsed);
}

/**
 * LocalStorageからコイン残高取得
 */
export function getCoins(): number {
  if (typeof window === 'undefined') return 0;
  const coins = localStorage.getItem('playerCoins');
  return coins ? parseInt(coins, 10) : 0;
}

/**
 * LocalStorageにコイン残高保存
 */
export function saveCoins(amount: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('playerCoins', amount.toString());
}

/**
 * コイン追加
 */
export function addCoins(amount: number): number {
  const currentCoins = getCoins();
  const newCoins = currentCoins + amount;
  saveCoins(newCoins);
  return newCoins;
}

/**
 * コイン消費
 */
export function spendCoins(amount: number): boolean {
  const currentCoins = getCoins();
  if (currentCoins < amount) {
    return false;
  }
  const newCoins = currentCoins - amount;
  saveCoins(newCoins);
  return true;
}
