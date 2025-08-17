import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/auth';

interface AuthStore extends AuthState {
  hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      hasHydrated: false,
      
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }),
      
      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);