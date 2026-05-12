import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      // Hành động đăng nhập
      setAuth: (user, token) => set({ user, token }),
      
      // Hành động đăng xuất
      logout: () => {
        set({ user: null, token: null });
        // Xóa thêm token khỏi localStorage nếu cần thiết, 
        // nhưng persist đã quản lý việc này cho store.
        // Tuy nhiên dự án cũ dùng key 'token' và 'user' riêng biệt,
        // ta có thể xóa chúng để tránh xung đột nếu cần.
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage cho Zustand
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
