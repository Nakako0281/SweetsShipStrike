import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI状態管理用Zustandストア
 * モーダル、通知、ローディングなどのUI状態を管理
 */

type ModalType = 'settings' | 'skill-confirm' | 'surrender-confirm' | null;

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UIStore {
  // モーダル状態
  activeModal: ModalType;
  modalData: any;

  // 通知
  notifications: Notification[];

  // ローディング
  isLoading: boolean;
  loadingMessage: string;

  // サウンド設定
  bgmVolume: number;
  seVolume: number;
  isMuted: boolean;

  // アクション
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  setBGMVolume: (volume: number) => void;
  setSEVolume: (volume: number) => void;
  toggleMute: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // 初期状態
      activeModal: null,
      modalData: null,
      notifications: [],
      isLoading: false,
      loadingMessage: '',
      bgmVolume: 0.5,
      seVolume: 0.7,
      isMuted: false,

      // モーダルを開く
      openModal: (type, data) => {
        set({
          activeModal: type,
          modalData: data || null,
        });
      },

      // モーダルを閉じる
      closeModal: () => {
        set({
          activeModal: null,
          modalData: null,
        });
      },

      // 通知を追加
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const newNotification: Notification = {
          ...notification,
          id,
          duration: notification.duration || 3000,
        };

        set({
          notifications: [...get().notifications, newNotification],
        });

        // 自動削除
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      // 通知を削除
      removeNotification: (id) => {
        set({
          notifications: get().notifications.filter((n) => n.id !== id),
        });
      },

      // ローディング設定
      setLoading: (isLoading, message = '') => {
        set({
          isLoading,
          loadingMessage: message,
        });
      },

      // BGM音量設定
      setBGMVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ bgmVolume: clampedVolume });

        // SoundManagerにも反映
        if (typeof window !== 'undefined') {
          import('@/lib/sound/soundManager').then(({ getSoundManager }) => {
            getSoundManager().setBGMVolume(clampedVolume);
          });
        }
      },

      // SE音量設定
      setSEVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ seVolume: clampedVolume });

        // SoundManagerにも反映
        if (typeof window !== 'undefined') {
          import('@/lib/sound/soundManager').then(({ getSoundManager }) => {
            getSoundManager().setSEVolume(clampedVolume);
          });
        }
      },

      // ミュート切り替え
      toggleMute: () => {
        const newMutedState = !get().isMuted;
        set({ isMuted: newMutedState });

        // SoundManagerにも反映
        if (typeof window !== 'undefined') {
          import('@/lib/sound/soundManager').then(({ getSoundManager }) => {
            getSoundManager().setMute(newMutedState);
          });
        }
      },
    }),
    { name: 'UIStore' }
  )
);
