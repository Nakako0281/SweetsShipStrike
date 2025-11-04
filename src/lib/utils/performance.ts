/**
 * パフォーマンス最適化ユーティリティ
 */

/**
 * デバウンス関数
 * 連続した呼び出しを遅延させる
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * スロットル関数
 * 一定時間内の呼び出し回数を制限
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 遅延ローディング用のプリロード
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 複数画像の並列プリロード
 */
export async function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map((src) => preloadImage(src)));
}

/**
 * メモリ使用量の監視（開発用）
 */
export function logMemoryUsage(): void {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log({
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
}

/**
 * FPS測定（開発用）
 */
export class FPSMeter {
  private frames: number[] = [];
  private lastTime: number = performance.now();

  measure(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.frames.push(1000 / delta);
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    return this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
  }

  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
  }
}

/**
 * ローカルストレージのキャッシュ管理
 */
export const cache = {
  set<T>(key: string, value: T, expiresIn?: number): void {
    const item = {
      value,
      expires: expiresIn ? Date.now() + expiresIn : null,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn('Failed to cache item:', e);
    }
  },

  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (item.expires && Date.now() > item.expires) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (e) {
      console.warn('Failed to retrieve cache:', e);
      return null;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Failed to remove cache:', e);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Failed to clear cache:', e);
    }
  },
};
