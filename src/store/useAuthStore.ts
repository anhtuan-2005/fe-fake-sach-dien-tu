import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      // Hành động đăng nhập
      setAuth: (user, token) => set({ user, token }),
      
      // Hành động đăng xuất
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage cho Zustand
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
