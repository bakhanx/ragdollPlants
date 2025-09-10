import { UserRole } from '@/lib/auth-utils';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  loginId: string;
  name: string;
  email: string | undefined | null;
  image: string | undefined | null;
  role: UserRole
}

interface AuthState {
  user: AuthUser | null;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isInitialized: false,

      setUser: user => {
        set({ user, isInitialized: true });
      },

      clear: () => {
        set({ user: null, isInitialized: false });
      },

      initialize: () => {
        if (!get().isInitialized) {
          set({ isInitialized: true });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user })
    }
  )
);
