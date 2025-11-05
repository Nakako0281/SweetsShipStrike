import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

/**
 * ローディング画面コンポーネント
 * ゲーム初期化やデータ読み込み中に表示
 */
export default function Loading({ message = '読み込み中...', fullScreen = true }: LoadingProps) {
  const Container = fullScreen ? motion.div : 'div';

  return (
    <Container
      {...(fullScreen && {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      })}
      className={`${
        fullScreen ? 'fixed inset-0 z-50' : 'w-full h-full'
      } bg-gradient-to-b from-pink-100 to-purple-100 flex flex-col items-center justify-center`}
    >
      {/* ローディングアニメーション */}
      <div className="relative mb-8">
        {/* スイーツアイコンの回転アニメーション */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {['🍰', '🍫', '🧁', '🍮'].map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                delay: index * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                left: `${Math.cos((index * Math.PI) / 2) * 30 + 40}px`,
                top: `${Math.sin((index * Math.PI) / 2) * 30 + 40}px`,
              }}
            >
              {emoji}
            </motion.div>
          ))}

          {/* 中央の船アイコン */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="text-5xl z-10"
          >
            ⚓
          </motion.div>
        </div>

        {/* パルスエフェクト */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-pink-300 rounded-full blur-2xl -z-10"
        />
      </div>

      {/* メッセージ */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-purple-800 mb-4"
      >
        {message}
      </motion.p>

      {/* ドット */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-pink-500 rounded-full"
          />
        ))}
      </div>

      {/* プログレスバー */}
      <div className="mt-8 w-64 h-2 bg-purple-200 rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-1/3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
        />
      </div>
    </Container>
  );
}
