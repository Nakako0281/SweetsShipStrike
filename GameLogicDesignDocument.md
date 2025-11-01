# SweetsShipStrike ゲームロジック設計書

## 📋 ドキュメント情報
- **作成日**: 2025年10月31日
- **バージョン**: 1.0
- **対象**: SweetsShipStrike ゲームロジック詳細仕様
- **参照**: システム設計書と合わせて使用

---

## 🎮 ゲーム概要

### 基本ルール
- 10×10マスのボードで対戦
- 各プレイヤーは4隻の乗り物を配置
- ターン制で相手のボードを攻撃
- 相手の乗り物を全て撃沈したら勝利
- ヒット時は連続攻撃可能
- 各乗り物は1試合に1回だけ使えるスキルを持つ

### キャラクターシステム（MVP版）
- プレイヤーは4人のキャラクターから1人を選択
- **MVP版では見た目のみの違い**（能力差なし）
- 純粋に好きなキャラクターを選んで楽しむ
- 将来的にパッシブ能力を実装予定

---

## 🚢 乗り物仕様

### 固定編成（全プレイヤー共通）

| 乗り物名 | タイプ | サイズ | スキル名 | スキル効果 |
|---------|--------|--------|----------|-----------|
| イチゴボート | strawberry_boat | 3マス | ストロベリーシールド | 次に受ける攻撃を1回無効化 |
| ココア潜水艇 | cocoa_submarine | 5マス | チョコレートボム | 3×3エリア（9マス）を攻撃 |
| マカロン円盤 | macaron_ufo | 2マス | スイートエスケープ | 自分の乗り物を別の場所に移動 |
| ワッフル艦 | waffle_ship | 4マス | 格子スキャン | 縦1列or横1列をスキャン |

**合計マス数**: 3 + 5 + 2 + 4 = **14マス**

---

## 📐 配置フェーズ

### 配置ルール

#### 1. 基本ルール
- 各プレイヤーは自分のボード（10×10マス）に4隻を配置
- 乗り物は**縦または横**に配置可能
- 乗り物同士の**隣接OK**（最低距離制限なし）
- ボードの範囲外には配置不可
- 乗り物の重複配置は不可

#### 2. 配置時間
- **オンライン対戦**: 60秒以内
- **CPU対戦**: 制限なし

#### 3. タイムアウト時の挙動
配置が完了しなかった場合、**ランダム配置**を実行：
- 未配置の乗り物を自動で配置
- 配置可能な位置をランダムに選択
- 衝突しないように調整

---

### 配置処理フロー

```
1. プレイヤーが乗り物を選択
2. 方向を選択（縦 or 横）
3. ボード上のマスをクリック
4. 配置可能か検証
   ├─ OK → 配置実行
   └─ NG → エラーメッセージ表示
5. 全て配置完了 → 「配置完了」ボタン有効化
6. 「配置完了」押下 → 相手を待機
7. 両者準備完了 → 戦闘フェーズへ
```

---

### 配置バリデーション

```typescript
/**
 * 乗り物を配置可能か検証
 * @param board 現在のボード状態
 * @param ship 配置する乗り物
 * @param position 配置開始位置
 * @param direction 配置方向
 * @returns 配置可能ならtrue
 */
function canPlaceShip(
  board: (string | null)[][],
  ship: Ship,
  position: Position,
  direction: Direction
): boolean {
  const { x, y } = position;
  const { size } = ship;

  // 範囲外チェック
  if (direction === 'horizontal') {
    if (x + size > 10) return false; // 右にはみ出す
  } else {
    if (y + size > 10) return false; // 下にはみ出す
  }

  // 重複チェック
  for (let i = 0; i < size; i++) {
    const checkX = direction === 'horizontal' ? x + i : x;
    const checkY = direction === 'vertical' ? y + i : y;

    if (board[checkY][checkX] !== null) {
      return false; // 既に別の乗り物がある
    }
  }

  return true;
}
```

---

### 配置実行

```typescript
/**
 * 乗り物を配置
 * @param board ボード状態
 * @param ship 配置する乗り物
 * @param position 配置開始位置
 * @param direction 配置方向
 */
function placeShip(
  board: (string | null)[][],
  ship: Ship,
  position: Position,
  direction: Direction
): void {
  const { x, y } = position;
  const { size, id } = ship;

  // ボードに乗り物IDを記録
  for (let i = 0; i < size; i++) {
    const placeX = direction === 'horizontal' ? x + i : x;
    const placeY = direction === 'vertical' ? y + i : y;
    board[placeY][placeX] = id; // 乗り物IDを記録
  }

  // 乗り物の位置情報を更新
  ship.position = position;
  ship.direction = direction;
}
```

---

## ⚔️ 戦闘フェーズ

### ターン制システム

#### ターンの流れ
```
【自分のターン】
1. ターン開始
   ├─ スキル使用可能
   └─ 攻撃可能
2. 攻撃選択
   └─ 相手のボードのマスをクリック
3. 攻撃判定
   ├─ ミス → 相手のターンへ
   ├─ ヒット → 連続攻撃可能（手順2へ戻る）
   └─ 撃沈 → 連続攻撃可能（手順2へ戻る）
4. スキル使用（任意、ターン中いつでも）
5. ターン終了

【相手のターン】
1. 相手の攻撃を待機
2. 攻撃結果を表示
3. 自分のボードに反映
```

#### ターンフェーズ
```typescript
enum TurnPhase {
  START = 'start',           // ターン開始
  ATTACK = 'attack',         // 攻撃待機中
  AFTER_HIT = 'after_hit',   // 命中後（連続攻撃可能）
  SKILL_SELECT = 'skill_select', // スキル選択中
  END = 'end'                // ターン終了
}
```

---

### 攻撃処理

#### 攻撃可能判定
```typescript
/**
 * 指定したマスに攻撃可能か
 * @param position 攻撃対象の座標
 * @param attackedCells 攻撃済みマスのセット
 * @returns 攻撃可能ならtrue
 */
function canAttack(position: Position, attackedCells: Set<string>): boolean {
  const key = `${position.x}-${position.y}`;
  return !attackedCells.has(key); // 未攻撃ならtrue
}
```

---

#### 攻撃実行

```typescript
/**
 * 攻撃を実行
 * @param position 攻撃対象の座標
 * @param defenderBoard 防御側のボード
 * @param defenderShips 防御側の乗り物リスト
 * @param shieldActive 防御側のシールドが有効か
 * @returns 攻撃結果
 */
function executeAttack(
  position: Position,
  defenderBoard: (string | null)[][],
  defenderShips: Ship[],
  shieldActive: boolean
): AttackResult {
  const { x, y } = position;

  // シールド判定
  if (shieldActive) {
    return {
      result: 'blocked',
      position,
      message: 'シールドで防がれた！',
      canContinue: false, // ミス扱い、ターン終了
    };
  }

  // ヒット判定
  const shipId = defenderBoard[y][x];

  if (shipId === null) {
    // ミス
    return {
      result: 'miss',
      position,
      message: 'ミス！',
      canContinue: false, // ターン終了
    };
  }

  // ヒット
  const hitShip = defenderShips.find(s => s.id === shipId);
  if (!hitShip) throw new Error('Ship not found');

  // 被弾位置を計算
  const hitIndex = calculateHitIndex(hitShip, position);
  hitShip.hits[hitIndex] = true;

  // 撃沈判定
  const isSunk = hitShip.hits.every(h => h === true);
  if (isSunk) {
    hitShip.sunk = true;
    return {
      result: 'sunk',
      position,
      shipId: hitShip.id,
      shipType: hitShip.type,
      message: `${hitShip.type} 撃沈！`,
      canContinue: true, // 連続攻撃可能
    };
  }

  return {
    result: 'hit',
    position,
    shipId: hitShip.id,
    shipType: hitShip.type,
    message: 'ヒット！',
    canContinue: true, // 連続攻撃可能
  };
}
```

---

#### 被弾位置の計算

```typescript
/**
 * 被弾したマスが乗り物のどの位置か計算
 * @param ship 乗り物
 * @param hitPosition 被弾座標
 * @returns 被弾インデックス（0 ~ size-1）
 */
function calculateHitIndex(ship: Ship, hitPosition: Position): number {
  if (!ship.position) throw new Error('Ship not placed');

  const { x: shipX, y: shipY } = ship.position;
  const { x: hitX, y: hitY } = hitPosition;
  const { direction } = ship;

  if (direction === 'horizontal') {
    return hitX - shipX;
  } else {
    return hitY - shipY;
  }
}
```

---

### 攻撃済みマスの管理

```typescript
/**
 * 攻撃済みマスを記録
 * @param position 攻撃した座標
 * @param attackedCells 攻撃済みセット
 */
function markAsAttacked(position: Position, attackedCells: Set<string>): void {
  const key = `${position.x}-${position.y}`;
  attackedCells.add(key);
}
```

---

## 💪 スキルシステム

### スキル共通ルール
1. **各スキルは1試合に1回のみ使用可能**
2. **その乗り物が撃沈されたらスキル使用不可**
3. **スキル使用は自分のターン中のみ**（ターン開始時 or 攻撃後）
4. **スキル使用は相手に見える**（演出で表示）

---

### スキル詳細仕様

#### 1. ストロベリーシールド（イチゴボート）

**効果**: 次に自分が受ける攻撃を1回だけ無効化

**使用タイミング**: 自分のターン中

**実装**:
```typescript
function useStrawberryShield(playerState: PlayerState): SkillResult {
  // シールドフラグを立てる
  playerState.shieldActive = true;

  return {
    success: true,
    effect: '次の攻撃を無効化するシールドを展開しました！',
  };
}
```

**注意点**:
- シールドは**次の1回の攻撃のみ**無効化
- 攻撃を受けたらシールドは自動解除
- 相手には「いつ使ったか」が見える（演出で表示）
- 自分のターン終了後も持続

---

#### 2. チョコレートボム（ココア潜水艇）

**効果**: 指定した3×3エリア（9マス）を一気に攻撃

**使用タイミング**: 自分のターン中

**実装**:
```typescript
function useChocolateBomb(
  centerPosition: Position,
  defenderBoard: (string | null)[][],
  defenderShips: Ship[],
  attackedCells: Set<string>
): SkillResult {
  const results: AttackResult[] = [];
  
  // 3×3エリアの各マスを攻撃
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const targetX = centerPosition.x + dx;
      const targetY = centerPosition.y + dy;

      // 範囲外チェック
      if (targetX < 0 || targetX >= 10 || targetY < 0 || targetY >= 10) {
        continue;
      }

      const target = { x: targetX, y: targetY };

      // 攻撃済みチェック
      if (canAttack(target, attackedCells)) {
        const result = executeAttack(target, defenderBoard, defenderShips, false);
        results.push(result);
        markAsAttacked(target, attackedCells);
      }
    }
  }

  return {
    success: true,
    effect: `チョコレートボムで${results.length}マスを攻撃しました！`,
    data: { results },
  };
}
```

**注意点**:
- 中心座標を指定すると、その周囲8マス＋中心の計9マスを攻撃
- ボードの範囲外は無視
- 既に攻撃済みのマスはスキップ
- 連続攻撃の権利は**なし**（スキル使用後はターン終了）

---

#### 3. スイートエスケープ（マカロン円盤）

**効果**: 自分の乗り物を1隻だけ別の場所に移動

**使用タイミング**: 自分のターン中

**実装**:
```typescript
function useSweetEscape(
  ship: Ship,
  newPosition: Position,
  newDirection: Direction,
  board: (string | null)[][]
): SkillResult {
  // 元の位置をクリア
  if (ship.position) {
    clearShipFromBoard(board, ship);
  }

  // 新しい位置に配置可能か検証
  if (!canPlaceShip(board, ship, newPosition, newDirection)) {
    return {
      success: false,
      effect: 'その場所には移動できません',
    };
  }

  // 移動実行
  placeShip(board, ship, newPosition, newDirection);

  // 被弾情報はそのまま（hits配列は保持）

  return {
    success: true,
    effect: `${ship.type} を移動しました！`,
  };
}

/**
 * ボードから乗り物を削除
 */
function clearShipFromBoard(board: (string | null)[][], ship: Ship): void {
  if (!ship.position) return;

  const { x, y } = ship.position;
  const { size, direction } = ship;

  for (let i = 0; i < size; i++) {
    const clearX = direction === 'horizontal' ? x + i : x;
    const clearY = direction === 'vertical' ? y + i : y;
    board[clearY][clearX] = null;
  }
}
```

**注意点**:
- 移動先が配置可能な位置でなければ失敗
- 被弾情報（hits配列）は引き継ぐ
- 移動後の位置は相手には見えない（自分のボードは見えない仕様）

---

#### 4. 格子スキャン（ワッフル艦）

**効果**: 縦1列または横1列（10マス）を一気にスキャン、敵がいるか確認

**使用タイミング**: 自分のターン中

**実装**:
```typescript
function useWaffleScan(
  line: 'row' | 'col',
  lineIndex: number,
  defenderBoard: (string | null)[][]
): SkillResult {
  const hitPositions: Position[] = [];

  if (line === 'row') {
    // 横1列をスキャン（y = lineIndex の全x）
    for (let x = 0; x < 10; x++) {
      if (defenderBoard[lineIndex][x] !== null) {
        hitPositions.push({ x, y: lineIndex });
      }
    }
  } else {
    // 縦1列をスキャン（x = lineIndex の全y）
    for (let y = 0; y < 10; y++) {
      if (defenderBoard[y][lineIndex] !== null) {
        hitPositions.push({ x: lineIndex, y });
      }
    }
  }

  return {
    success: true,
    effect: `スキャン完了：${hitPositions.length}マスに敵を発見！`,
    data: { hitPositions },
  };
}
```

**注意点**:
- 敵がいるマスの**座標を取得**（どの乗り物かは不明）
- 攻撃はしない（スキャンのみ）
- スキャン結果はUIでハイライト表示（例：赤枠）
- スキャン後も攻撃は可能

---

## 🏆 勝敗判定

### 勝利条件
**相手の乗り物を全て撃沈したら勝利**

### 判定処理

```typescript
/**
 * 勝敗判定
 * @param ships 対象プレイヤーの乗り物リスト
 * @returns 全滅していればtrue
 */
function checkDefeat(ships: Ship[]): boolean {
  return ships.every(ship => ship.sunk);
}

/**
 * ゲーム終了判定
 * @param gameState ゲーム状態
 * @returns 勝者のPlayerId、まだ続行中ならnull
 */
function checkGameEnd(gameState: GameState): PlayerId | null {
  const { player1, player2 } = gameState.players;

  if (checkDefeat(player1.ships)) {
    return 'player2'; // player1敗北 → player2勝利
  }

  if (checkDefeat(player2.ships)) {
    return 'player1'; // player2敗北 → player1勝利
  }

  return null; // まだ続行中
}
```

---

## 📊 体力（HP）システム

### 計算方法
**残り体力% = (残存マス数 / 総マス数) × 100**

### 実装

```typescript
/**
 * HPを計算
 * @param ships 乗り物リスト
 * @returns HP（パーセンテージ）
 */
function calculateHP(ships: Ship[]): number {
  const totalMasses = ships.reduce((sum, ship) => sum + ship.size, 0); // 14
  const remainingMasses = ships.reduce((sum, ship) => {
    const hitCount = ship.hits.filter(h => h).length;
    return sum + (ship.size - hitCount);
  }, 0);

  return Math.round((remainingMasses / totalMasses) * 100);
}

/**
 * 残存マス数を計算
 * @param ships 乗り物リスト
 * @returns 残存マス数
 */
function calculateRemainingMasses(ships: Ship[]): number {
  return ships.reduce((sum, ship) => {
    const hitCount = ship.hits.filter(h => h).length;
    return sum + (ship.size - hitCount);
  }, 0);
}
```

### 表示例
```
【あなた】
HP: ████████░░ 79% (11/14マス)
残存艦：大型艦×1、中型艦×0、小型艦×1、偵察艦×1

【相手】
HP: ██████░░░░ 57% (8/14マス)
残存艦：大型艦×0、中型艦×1、小型艦×1、偵察艦×1
```

---

## 🤖 CPU対戦AI

### 難易度：簡易版（MVP）

#### 思考アルゴリズム

##### フェーズ1：ランダム攻撃
```typescript
/**
 * ランダムに攻撃対象を選択
 * @param attackedCells 攻撃済みマスのセット
 * @returns 攻撃対象の座標
 */
function selectRandomTarget(attackedCells: Set<string>): Position {
  const availableCells: Position[] = [];

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const key = `${x}-${y}`;
      if (!attackedCells.has(key)) {
        availableCells.push({ x, y });
      }
    }
  }

  // ランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * availableCells.length);
  return availableCells[randomIndex];
}
```

##### フェーズ2：ヒット時の周囲攻撃
```typescript
/**
 * 最後にヒットしたマスの周囲を狙う
 * @param lastHit 最後にヒットした座標
 * @param attackedCells 攻撃済みマスのセット
 * @returns 次の攻撃対象
 */
function selectAdjacentTarget(
  lastHit: Position,
  attackedCells: Set<string>
): Position | null {
  const { x, y } = lastHit;
  const adjacent = [
    { x: x - 1, y },     // 左
    { x: x + 1, y },     // 右
    { x, y: y - 1 },     // 上
    { x, y: y + 1 },     // 下
  ];

  // 範囲内 & 未攻撃のマスをフィルタ
  const validTargets = adjacent.filter(pos => {
    if (pos.x < 0 || pos.x >= 10 || pos.y < 0 || pos.y >= 10) return false;
    const key = `${pos.x}-${pos.y}`;
    return !attackedCells.has(key);
  });

  if (validTargets.length === 0) return null;

  // ランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * validTargets.length);
  return validTargets[randomIndex];
}
```

##### CPU思考のメインロジック
```typescript
class SimpleCPU {
  private lastHit: Position | null = null;

  selectTarget(attackedCells: Set<string>): Position {
    // ヒット後なら周囲を狙う
    if (this.lastHit) {
      const adjacent = selectAdjacentTarget(this.lastHit, attackedCells);
      if (adjacent) {
        return adjacent;
      } else {
        // 周囲に攻撃可能なマスがない → ランダムに戻る
        this.lastHit = null;
      }
    }

    // ランダム攻撃
    return selectRandomTarget(attackedCells);
  }

  onAttackResult(result: AttackResult): void {
    if (result.result === 'hit') {
      this.lastHit = result.position; // 次は周囲を狙う
    } else if (result.result === 'sunk') {
      this.lastHit = null; // 撃沈したらリセット
    } else {
      this.lastHit = null; // ミス or ブロックされたらリセット
    }
  }

  shouldUseSkill(gameState: GameState): boolean {
    // 簡易判定：HP50%以下で攻撃系スキルを使用
    const cpuPlayer = gameState.players.player2; // CPUはplayer2と仮定
    const hp = calculateHP(cpuPlayer.ships);

    if (hp <= 50) {
      // チョコレートボムが使用可能か
      const cocoaSubmarine = cpuPlayer.ships.find(s => s.type === 'cocoa_submarine');
      if (cocoaSubmarine && !cocoaSubmarine.skillUsed && !cocoaSubmarine.sunk) {
        return true;
      }
    }

    return false;
  }
}
```

---

### CPU配置AI

```typescript
/**
 * CPUが乗り物をランダムに配置
 * @param ships 配置する乗り物リスト
 * @param board ボード
 */
function placeCPUShips(ships: Ship[], board: (string | null)[][]): void {
  for (const ship of ships) {
    let placed = false;

    while (!placed) {
      // ランダムな位置と方向
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const position = { x, y };

      // 配置可能か検証
      if (canPlaceShip(board, ship, position, direction)) {
        placeShip(board, ship, position, direction);
        placed = true;
      }
    }
  }
}
```

---

## 🔄 ゲームフロー（全体）

### 初期化

```typescript
/**
 * ゲーム状態を初期化
 * @param mode ゲームモード
 * @param player1Character player1のキャラクター
 * @param player2Character player2のキャラクター
 * @returns 初期化されたGameState
 */
function initializeGame(
  mode: GameMode,
  player1Character: CharacterType,
  player2Character: CharacterType
): GameState {
  return {
    gameId: generateGameId(),
    mode,
    phase: 'setup',
    turnPhase: 'start',
    currentTurn: 'player1', // player1が先攻
    players: {
      player1: createPlayerState('player1', player1Character),
      player2: createPlayerState('player2', player2Character),
    },
    attackedCells: {
      player1: new Set(),
      player2: new Set(),
    },
    winner: null,
    turnCount: 0,
    setupTimer: 60, // 60秒
  };
}

/**
 * プレイヤー状態を作成
 */
function createPlayerState(id: PlayerId, character: CharacterType): PlayerState {
  return {
    id,
    character,
    ships: createShips(id), // 4隻の乗り物を生成
    board: createEmptyBoard(),
    hp: 100,
    remainingMasses: 14,
    totalMasses: 14,
    shieldActive: false,
    activeSkills: [],
    isReady: false,
  };
}

/**
 * 空のボードを作成
 */
function createEmptyBoard(): (string | null)[][] {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
}

/**
 * 乗り物リストを生成
 */
function createShips(playerId: PlayerId): Ship[] {
  return [
    {
      id: `${playerId}_strawberry_boat`,
      type: 'strawberry_boat',
      size: 3,
      position: null,
      direction: 'horizontal',
      hits: [false, false, false],
      sunk: false,
      skillUsed: false,
    },
    {
      id: `${playerId}_cocoa_submarine`,
      type: 'cocoa_submarine',
      size: 5,
      position: null,
      direction: 'horizontal',
      hits: [false, false, false, false, false],
      sunk: false,
      skillUsed: false,
    },
    {
      id: `${playerId}_macaron_ufo`,
      type: 'macaron_ufo',
      size: 2,
      position: null,
      direction: 'horizontal',
      hits: [false, false],
      sunk: false,
      skillUsed: false,
    },
    {
      id: `${playerId}_waffle_ship`,
      type: 'waffle_ship',
      size: 4,
      position: null,
      direction: 'horizontal',
      hits: [false, false, false, false],
      sunk: false,
      skillUsed: false,
    },
  ];
}
```

---

### 配置フェーズ → 戦闘フェーズ

```typescript
/**
 * 配置完了を確認
 * @param gameState ゲーム状態
 */
function checkSetupComplete(gameState: GameState): void {
  const { player1, player2 } = gameState.players;

  if (player1.isReady && player2.isReady) {
    // 両者準備完了 → 戦闘フェーズへ
    gameState.phase = 'battle';
    gameState.turnPhase = 'start';
    gameState.currentTurn = 'player1'; // player1が先攻
  }
}
```

---

### ターン処理

```typescript
/**
 * ターンを進める
 * @param gameState ゲーム状態
 * @param action プレイヤーのアクション
 * @returns 更新されたGameState
 */
function processTurn(gameState: GameState, action: GameAction): GameState {
  const { currentTurn, players } = gameState;
  const attacker = players[currentTurn];
  const defender = players[currentTurn === 'player1' ? 'player2' : 'player1'];

  if (action.type === 'attack') {
    // 攻撃処理
    const position = (action.data as AttackActionData).position;

    // 攻撃可能か検証
    if (!canAttack(position, gameState.attackedCells[currentTurn])) {
      throw new Error('Already attacked this position');
    }

    // 攻撃実行
    const result = executeAttack(
      position,
      defender.board,
      defender.ships,
      defender.shieldActive
    );

    // シールド解除
    if (defender.shieldActive && result.result === 'blocked') {
      defender.shieldActive = false;
    }

    // 攻撃済みマークを記録
    markAsAttacked(position, gameState.attackedCells[currentTurn]);

    // HP更新
    defender.hp = calculateHP(defender.ships);
    defender.remainingMasses = calculateRemainingMasses(defender.ships);

    // 勝敗判定
    const winner = checkGameEnd(gameState);
    if (winner) {
      gameState.winner = winner;
      gameState.phase = 'finished';
      return gameState;
    }

    // ターン継続判定
    if (result.canContinue) {
      // ヒット or 撃沈 → 連続攻撃可能
      gameState.turnPhase = 'after_hit';
    } else {
      // ミス or ブロック → ターン交代
      endTurn(gameState);
    }

  } else if (action.type === 'useSkill') {
    // スキル使用処理
    const skillData = (action.data as SkillActionData).skillUse;
    executeSkill(gameState, skillData);

    // スキル使用後はターン継続（攻撃可能）
    gameState.turnPhase = 'attack';

  } else if (action.type === 'endTurn') {
    // 手動でターン終了
    endTurn(gameState);
  }

  gameState.lastAction = action;
  return gameState;
}

/**
 * ターンを終了し、相手のターンに切り替え
 */
function endTurn(gameState: GameState): void {
  gameState.currentTurn = gameState.currentTurn === 'player1' ? 'player2' : 'player1';
  gameState.turnPhase = 'start';
  gameState.turnCount++;
}
```

---

### スキル実行統合

```typescript
/**
 * スキルを実行
 * @param gameState ゲーム状態
 * @param skillUse スキル使用データ
 */
function executeSkill(gameState: GameState, skillUse: SkillUseData): SkillResult {
  const { skillId, shipId } = skillUse;
  const attacker = gameState.players[gameState.currentTurn];
  const defender = gameState.players[gameState.currentTurn === 'player1' ? 'player2' : 'player1'];

  // 使用する乗り物を取得
  const ship = attacker.ships.find(s => s.id === shipId);
  if (!ship) throw new Error('Ship not found');
  if (ship.sunk) throw new Error('Ship is sunk');
  if (ship.skillUsed) throw new Error('Skill already used');

  let result: SkillResult;

  // スキルIDに応じて実行
  switch (skillId) {
    case 'strawberry_shield':
      result = useStrawberryShield(attacker);
      break;

    case 'chocolate_bomb':
      if (!skillUse.target) throw new Error('Target required for Chocolate Bomb');
      result = useChocolateBomb(
        skillUse.target,
        defender.board,
        defender.ships,
        gameState.attackedCells[gameState.currentTurn]
      );
      // HP更新
      defender.hp = calculateHP(defender.ships);
      defender.remainingMasses = calculateRemainingMasses(defender.ships);
      break;

    case 'sweet_escape':
      if (!skillUse.target) throw new Error('Target required for Sweet Escape');
      if (!skillUse.area) throw new Error('Direction required for Sweet Escape');
      // 方向を取得（dataから）
      const newDirection: Direction = 'horizontal'; // 実際にはUIから取得
      result = useSweetEscape(ship, skillUse.target, newDirection, attacker.board);
      break;

    case 'waffle_scan':
      if (!skillUse.line || skillUse.lineIndex === undefined) {
        throw new Error('Line and lineIndex required for Waffle Scan');
      }
      result = useWaffleScan(skillUse.line, skillUse.lineIndex, defender.board);
      break;

    default:
      throw new Error('Unknown skill');
  }

  // スキル使用済みフラグ
  ship.skillUsed = true;
  attacker.activeSkills.push(skillId);

  return result;
}
```

---

## 📈 ゲームバランス調整案

### 将来的な調整ポイント

#### スキルの強さ調整
- **チョコレートボム**: 3×3 → 2×2 に縮小？
- **格子スキャン**: 10マス → 4×4エリア に変更？
- **ストロベリーシールド**: 1回無効化 → 1ターン全無効化？

#### マップサイズ
- 10×10 → 8×8 or 12×12 も検討

#### 乗り物のサイズ
- 現在の合計14マス → 15マスに増やす？
- 小型艦を1隻追加？

---

## 🧪 テストケース

### 配置フェーズ

| テスト項目 | 入力 | 期待結果 |
|-----------|------|---------|
| 正常配置（横） | position: (0,0), direction: horizontal, size: 3 | 配置成功 |
| 正常配置（縦） | position: (0,0), direction: vertical, size: 3 | 配置成功 |
| 範囲外配置（横） | position: (9,0), direction: horizontal, size: 3 | 配置失敗 |
| 範囲外配置（縦） | position: (0,9), direction: vertical, size: 3 | 配置失敗 |
| 重複配置 | 既に配置済みの位置 | 配置失敗 |
| 隣接配置 | 既存の乗り物の隣 | 配置成功 |

---

### 攻撃フェーズ

| テスト項目 | 入力 | 期待結果 |
|-----------|------|---------|
| ミス | 乗り物がないマス | result: 'miss', canContinue: false |
| ヒット | 乗り物があるマス | result: 'hit', canContinue: true |
| 撃沈 | 最後の残りマス | result: 'sunk', canContinue: true |
| シールドで防御 | shieldActive: true | result: 'blocked', canContinue: false |
| 攻撃済みマスへの攻撃 | 攻撃済み | エラー（攻撃不可） |

---

### スキル

| テスト項目 | 入力 | 期待結果 |
|-----------|------|---------|
| シールド使用 | - | shieldActive: true |
| シールドで防御 | 攻撃を受ける | 攻撃無効化、shieldActive: false |
| チョコレートボム | center: (5,5) | 9マス攻撃 |
| スイートエスケープ | 移動可能な位置 | 移動成功 |
| スイートエスケープ | 移動不可能な位置 | 移動失敗 |
| 格子スキャン（横） | row: 5 | 5行目のヒット情報取得 |
| 格子スキャン（縦） | col: 3 | 3列目のヒット情報取得 |
| 撃沈後のスキル使用 | sunk: true | エラー（使用不可） |
| 使用済みスキル再使用 | skillUsed: true | エラー（使用不可） |

---

## 📊 パフォーマンス考慮

### 最適化ポイント
- 攻撃済みマスの検索: `Set` を使用（O(1)）
- ボード状態の更新: 必要な部分のみ更新
- P2P通信: 最小限のデータのみ送信

### 避けるべきパターン
- 毎フレームのボード全体再描画
- 不要なディープコピー
- 巨大なゲーム状態の送信

---

## 💰 報酬システム（MVP拡張版）

### 概要
ゲーム勝利時にスイーツコインを獲得し、称号を解放、ショップでスキンを購入できるシステム。

**MVP版の範囲:**
- 称号: 1つ（「初勝利」のみ）
- ショップアイテム: 1つ（ショートケーキちゃんのスキン1種）
- 拡張可能な設計

---

### コイン獲得システム

#### コイン計算式

```typescript
/**
 * 勝利時のコイン報酬を計算
 * @param result ゲーム結果
 * @returns コイン報酬の詳細
 */
function calculateCoinReward(result: GameResult): CoinReward {
  const bonuses: { type: string; amount: number; description: string }[] = [];
  
  // 基本報酬
  let baseReward = 100;
  
  // ボーナス報酬
  if (result.mode === 'online') {
    bonuses.push({
      type: 'online',
      amount: 50,
      description: 'オンライン対戦ボーナス',
    });
  }
  
  if (result.fastWin) {
    bonuses.push({
      type: 'fast_win',
      amount: 50,
      description: '速攻ボーナス（10ターン以内）',
    });
  }
  
  if (result.perfectWin) {
    bonuses.push({
      type: 'perfect_win',
      amount: 100,
      description: '完全勝利ボーナス（被弾0）',
    });
  }
  
  if (result.comebackWin) {
    bonuses.push({
      type: 'comeback_win',
      amount: 80,
      description: '逆転勝利ボーナス',
    });
  }
  
  if (result.usedAllSkills) {
    bonuses.push({
      type: 'all_skills',
      amount: 30,
      description: '全スキル使用ボーナス',
    });
  }
  
  const total = baseReward + bonuses.reduce((sum, b) => sum + b.amount, 0);
  
  return {
    baseReward,
    bonuses,
    total,
  };
}
```

#### コイン付与処理

```typescript
/**
 * コインを付与
 * @param amount 付与するコイン数
 */
function addCoins(amount: number): void {
  const stats = loadPlayerStats();
  stats.currentCoins += amount;
  stats.totalCoinsEarned += amount;
  savePlayerStats(stats);
}

/**
 * コインを消費
 * @param amount 消費するコイン数
 * @returns 成功/失敗
 */
function spendCoins(amount: number): boolean {
  const stats = loadPlayerStats();
  
  if (stats.currentCoins < amount) {
    return false; // コイン不足
  }
  
  stats.currentCoins -= amount;
  stats.totalCoinsSpent += amount;
  savePlayerStats(stats);
  return true;
}
```

---

### 称号システム

#### MVP版の称号定義

```typescript
/**
 * MVP版: 称号は1つのみ
 */
const MVP_TITLES: Title[] = [
  {
    id: 'first_win',
    name: '初勝利',
    description: '最初の勝利を飾った証',
    condition: '1回勝利する',
    icon: '/assets/images/titles/first_win.png',
    rarity: 'common',
    isUnlocked: false,
  },
];
```

#### 称号解放処理

```typescript
/**
 * 称号を解放
 * @param titleId 称号ID
 */
function unlockTitle(titleId: string): void {
  const stats = loadPlayerStats();
  
  if (!stats.unlockedTitles.includes(titleId)) {
    stats.unlockedTitles.push(titleId);
    
    // 最初の称号なら自動装備
    if (stats.selectedTitle === null) {
      stats.selectedTitle = titleId;
    }
    
    savePlayerStats(stats);
  }
}

/**
 * 称号を装備
 * @param titleId 称号ID（nullで解除）
 */
function equipTitle(titleId: string | null): void {
  const stats = loadPlayerStats();
  
  if (titleId === null) {
    stats.selectedTitle = null;
  } else if (stats.unlockedTitles.includes(titleId)) {
    stats.selectedTitle = titleId;
  } else {
    throw new Error('Title not unlocked');
  }
  
  savePlayerStats(stats);
}

/**
 * 称号解放チェック
 * @param result ゲーム結果
 * @returns 新規解放された称号ID配列
 */
function checkTitleUnlocks(result: GameResult): string[] {
  const stats = loadPlayerStats();
  const newTitles: string[] = [];
  
  // MVP版: 初勝利の称号のみチェック
  if (result.winner === 'player1' && stats.totalWins === 1) {
    if (!stats.unlockedTitles.includes('first_win')) {
      unlockTitle('first_win');
      newTitles.push('first_win');
    }
  }
  
  return newTitles;
}
```

---

### ショップシステム

#### MVP版のスキン定義

```typescript
/**
 * MVP版: スキン1つのみ
 */
const MVP_SKINS: CharacterSkin[] = [
  // デフォルトスキン（無料、最初から所持）
  {
    id: 'strawberry_default',
    characterType: 'strawberry',
    name: 'デフォルト',
    description: '基本の衣装',
    price: 0,
    rarity: 'common',
    imageFullBody: '/assets/images/characters/strawberry_fullbody.png',
    imageTopView: '/assets/images/characters_topview/strawberry_topview.png',
    isOwned: true,
  },
  // 購入可能スキン
  {
    id: 'strawberry_summer',
    characterType: 'strawberry',
    name: 'サマーバージョン',
    description: '夏の海が似合う爽やかな衣装',
    price: 300,
    rarity: 'rare',
    imageFullBody: '/assets/images/characters/strawberry_summer_fullbody.png',
    imageTopView: '/assets/images/characters_topview/strawberry_summer_topview.png',
    isOwned: false,
  },
];
```

#### スキン購入処理

```typescript
/**
 * スキンを購入
 * @param skinId スキンID
 * @returns 成功/失敗
 */
function purchaseSkin(skinId: string): boolean {
  const stats = loadPlayerStats();
  
  // スキン情報を取得
  const skin = MVP_SKINS.find(s => s.id === skinId);
  if (!skin) {
    throw new Error('Skin not found');
  }
  
  // 既に所持している
  if (stats.ownedSkins.includes(skinId)) {
    return false;
  }
  
  // コイン消費
  if (!spendCoins(skin.price)) {
    return false; // コイン不足
  }
  
  // スキン追加
  stats.ownedSkins.push(skinId);
  
  // 自動装備
  stats.selectedSkin[skin.characterType] = skinId;
  
  savePlayerStats(stats);
  return true;
}

/**
 * スキンを装備
 * @param characterType キャラクタータイプ
 * @param skinId スキンID
 */
function equipSkin(characterType: CharacterType, skinId: string): void {
  const stats = loadPlayerStats();
  
  // 所持チェック
  if (!stats.ownedSkins.includes(skinId)) {
    throw new Error('Skin not owned');
  }
  
  // 装備
  stats.selectedSkin[characterType] = skinId;
  savePlayerStats(stats);
}

/**
 * ショップアイテム一覧を取得
 * @returns スキン一覧（所持状況を反映）
 */
function getShopItems(): CharacterSkin[] {
  const stats = loadPlayerStats();
  
  return MVP_SKINS.map(skin => ({
    ...skin,
    isOwned: stats.ownedSkins.includes(skin.id),
  }));
}
```

---

### 統計記録システム

#### ゲーム終了時の統計更新

```typescript
/**
 * ゲーム終了時の統計更新
 * @param result ゲーム結果
 */
function updateGameStats(result: GameResult): void {
  const stats = loadPlayerStats();
  
  // 基本統計
  stats.totalGames++;
  
  if (result.winner === 'player1') {
    // 勝利
    stats.totalWins++;
    stats.currentWinStreak++;
    stats.maxWinStreak = Math.max(stats.maxWinStreak, stats.currentWinStreak);
    
    // モード別
    if (result.mode === 'online') {
      stats.onlineWins++;
    } else {
      stats.cpuWins++;
    }
    
    // 特殊記録
    if (result.perfectWin) {
      stats.perfectWins++;
    }
    if (result.comebackWin) {
      stats.comebackWins++;
    }
    stats.fastestWin = Math.min(stats.fastestWin, result.turnCount);
    
  } else {
    // 敗北
    stats.totalLosses++;
    stats.currentWinStreak = 0;
    
    if (result.mode === 'online') {
      stats.onlineLosses++;
    } else {
      stats.cpuLosses++;
    }
  }
  
  // 勝率計算
  stats.winRate = Math.round((stats.totalWins / stats.totalGames) * 100 * 10) / 10;
  
  // キャラクター別統計（将来実装用）
  stats.characterStats[result.character].gamesPlayed++;
  if (result.winner === 'player1') {
    stats.characterStats[result.character].wins++;
  } else {
    stats.characterStats[result.character].losses++;
  }
  
  savePlayerStats(stats);
}
```

---

### ゲーム結果の判定

```typescript
/**
 * 完全勝利判定（被弾0）
 */
function checkPerfectWin(gameState: GameState, winner: PlayerId): boolean {
  const winnerState = gameState.players[winner];
  return winnerState.remainingMasses === winnerState.totalMasses;
}

/**
 * 全スキル使用判定
 */
function checkAllSkillsUsed(gameState: GameState, winner: PlayerId): boolean {
  const winnerState = gameState.players[winner];
  return winnerState.activeSkills.length === 4;
}

/**
 * 逆転勝利判定（HP30%以下から）
 * ※これを正確に判定するにはゲーム中の最小HP記録が必要
 */
function checkComebackWin(gameState: GameState, winner: PlayerId): boolean {
  // MVP版では簡易実装
  // 本来はゲーム中の最小HPを記録して判定
  // 今回は終了時のHP差で代用
  const winnerState = gameState.players[winner];
  const loserState = gameState.players[winner === 'player1' ? 'player2' : 'player1'];
  
  // 勝者のHPが50%以下で、敗者を全滅させた場合を逆転勝利とみなす
  return winnerState.hp <= 50;
}
```

---

### ゲーム終了処理の統合

```typescript
/**
 * ゲーム終了時の全処理
 * @param gameState ゲーム状態
 */
function onGameFinished(gameState: GameState): void {
  const winner = gameState.winner;
  if (!winner) return;
  
  // Player1が勝った場合のみ報酬処理
  if (winner !== 'player1') return;
  
  // ゲーム結果を作成
  const result: GameResult = {
    winner,
    mode: gameState.mode,
    turnCount: gameState.turnCount,
    perfectWin: checkPerfectWin(gameState, winner),
    usedAllSkills: checkAllSkillsUsed(gameState, winner),
    comebackWin: checkComebackWin(gameState, winner),
    fastWin: gameState.turnCount <= 10,
    character: gameState.players.player1.character,
  };
  
  // 統計更新
  updateGameStats(result);
  
  // コイン獲得
  const coinReward = calculateCoinReward(result);
  addCoins(coinReward.total);
  
  // 称号チェック
  const newTitles = checkTitleUnlocks(result);
  
  // 結果画面へ遷移（報酬情報を渡す）
  navigateToResultScreen({
    result,
    coinReward,
    newTitles,
  });
}
```

---

### LocalStorage管理

#### データ保存・読み込み

```typescript
const STORAGE_KEY = 'sweets_ship_strike_player_stats';

/**
 * プレイヤー統計を保存
 */
function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save player stats:', e);
  }
}

/**
 * プレイヤー統計を読み込み
 */
function loadPlayerStats(): PlayerStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load player stats:', e);
  }
  return createDefaultPlayerStats();
}

/**
 * デフォルトのプレイヤー統計を作成
 */
function createDefaultPlayerStats(): PlayerStats {
  return {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    winRate: 0,
    currentWinStreak: 0,
    maxWinStreak: 0,
    onlineWins: 0,
    onlineLosses: 0,
    cpuWins: 0,
    cpuLosses: 0,
    totalAttacks: 0,
    totalHits: 0,
    hitRate: 0,
    totalShipsSunk: 0,
    totalSkillsUsed: 0,
    fastestWin: Infinity,
    perfectWins: 0,
    comebackWins: 0,
    characterStats: {
      strawberry: { gamesPlayed: 0, wins: 0, losses: 0 },
      chocolate: { gamesPlayed: 0, wins: 0, losses: 0 },
      macaron: { gamesPlayed: 0, wins: 0, losses: 0 },
      pudding: { gamesPlayed: 0, wins: 0, losses: 0 },
    },
    totalCoinsEarned: 0,
    totalCoinsSpent: 0,
    currentCoins: 0, // 初期コイン0
    ownedSkins: [
      'strawberry_default',
      'chocolate_default',
      'macaron_default',
      'pudding_default',
    ],
    ownedThemes: ['cream_sea'], // デフォルトテーマ（将来実装用）
    ownedEffects: ['default_explosion'], // デフォルトエフェクト（将来実装用）
    unlockedTitles: [],
    selectedTitle: null,
    selectedSkin: {
      strawberry: 'strawberry_default',
      chocolate: 'chocolate_default',
      macaron: 'macaron_default',
      pudding: 'pudding_default',
    },
    selectedTheme: 'cream_sea',
    selectedEffect: 'default_explosion',
  };
}

/**
 * データをリセット（デバッグ用）
 */
function resetPlayerStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

---

### 拡張性の確保

#### 将来の拡張ポイント

```typescript
/**
 * 称号定義を拡張する場合
 */
const ALL_TITLES: Title[] = [
  ...MVP_TITLES,
  // 新しい称号を追加
  {
    id: 'win_streak_3',
    name: '三連勝',
    description: '3連勝を達成した強者',
    condition: '3連勝する',
    icon: '/assets/images/titles/win_streak_3.png',
    rarity: 'rare',
    isUnlocked: false,
  },
  // ...
];

/**
 * スキン定義を拡張する場合
 */
const ALL_SKINS: CharacterSkin[] = [
  ...MVP_SKINS,
  // 新しいスキンを追加
  {
    id: 'chocolate_halloween',
    characterType: 'chocolate',
    name: 'ハロウィン衣装',
    description: 'トリック・オア・トリート！',
    price: 500,
    rarity: 'rare',
    imageFullBody: '/assets/images/characters/chocolate_halloween_fullbody.png',
    imageTopView: '/assets/images/characters_topview/chocolate_halloween_topview.png',
    isOwned: false,
  },
  // ...
];

/**
 * 称号解放チェックを拡張する場合
 */
function checkAllTitleUnlocks(result: GameResult): string[] {
  const stats = loadPlayerStats();
  const newTitles: string[] = [];
  
  // 初勝利
  if (result.winner === 'player1' && stats.totalWins === 1) {
    if (!stats.unlockedTitles.includes('first_win')) {
      unlockTitle('first_win');
      newTitles.push('first_win');
    }
  }
  
  // 三連勝（将来実装）
  if (stats.currentWinStreak === 3) {
    if (!stats.unlockedTitles.includes('win_streak_3')) {
      unlockTitle('win_streak_3');
      newTitles.push('win_streak_3');
    }
  }
  
  // パーフェクト勝利（将来実装）
  if (result.perfectWin) {
    if (!stats.unlockedTitles.includes('perfect_win')) {
      unlockTitle('perfect_win');
      newTitles.push('perfect_win');
    }
  }
  
  // ... 他の称号も同様に追加
  
  return newTitles;
}
```

---

## 📊 MVP拡張版のテストケース

### コイン獲得

| テスト項目 | 入力 | 期待結果 |
|-----------|------|---------|
| 基本報酬 | CPU勝利、通常 | 100コイン |
| オンラインボーナス | オンライン勝利 | 150コイン |
| 速攻ボーナス | 10ターン以内勝利 | 150コイン |
| 完全勝利 | 被弾0で勝利 | 200コイン |
| 複合ボーナス | オンライン+速攻+完全勝利 | 300コイン |

### 称号解放

| テスト項目 | 条件 | 期待結果 |
|-----------|------|---------|
| 初勝利称号 | 初めて勝利 | 「初勝利」解放 |
| 2回目の勝利 | 2回目の勝利 | 称号解放なし |
| 敗北時 | 敗北 | 称号解放なし |

### ショップ

| テスト項目 | 条件 | 期待結果 |
|-----------|------|---------|
| 購入成功 | 300コイン所持、購入 | コイン減算、スキン解放 |
| コイン不足 | 100コイン所持、購入試行 | 購入失敗 |
| 重複購入 | 既に所持、購入試行 | 購入不可 |
| 購入後装備 | スキン購入 | 自動的に装備される |

---

## 🎨 必要な追加素材（MVP拡張版）

### 画像素材
- **称号アイコン**: 1枚（初勝利用）
- **キャラスキン**: 2枚
  - ショートケーキちゃん サマーバージョン（全身）
  - ショートケーキちゃん サマーバージョン（真上）
- **UIアイコン**: 1枚
  - コインアイコン 🪙

**合計: 4枚**

### サウンド素材（オプション）
- コイン獲得SE（チャリーン）
- 称号獲得SE（ファンファーレ）
- ショップ購入SE（レジ音）

---

## 📄 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2025-10-31 | 1.0 | 初版作成 |
| 2025-10-31 | 1.1 | 報酬システム（MVP拡張版）追加 |

---

**以上、ゲームロジック設計書でした。**