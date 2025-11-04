'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  initialSeconds: number;
  onTimeout: () => void;
  isActive?: boolean;
  showWarning?: boolean;
  warningThreshold?: number; // 残り秒数が何秒以下で警告表示するか
}

export default function Timer({
  initialSeconds,
  onTimeout,
  isActive = true,
  showWarning = true,
  warningThreshold = 10,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeout]);

  const isWarning = showWarning && timeLeft <= warningThreshold && timeLeft > 0;
  const progress = (timeLeft / initialSeconds) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* タイマー表示 */}
      <div className={`text-3xl font-bold transition-colors ${
        isWarning
          ? 'text-red-600 animate-pulse'
          : timeLeft === 0
          ? 'text-gray-400'
          : 'text-gray-700'
      }`}>
        {formatTime(timeLeft)}
      </div>

      {/* プログレスバー */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isWarning
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 警告メッセージ */}
      {isWarning && (
        <div className="text-sm text-red-600 font-medium animate-pulse">
          時間切れ間近！
        </div>
      )}

      {/* タイムアウトメッセージ */}
      {timeLeft === 0 && (
        <div className="text-sm text-gray-500">
          時間切れ
        </div>
      )}
    </div>
  );
}
