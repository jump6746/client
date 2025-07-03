import { create } from 'zustand';
import { persist } from "zustand/middleware";

interface Props {
  userId: number | null;
  defaultTasteMapId: number | null;
  setUser: (data: { userId: number; defaultTasteMapId: number }) => void;
  clearUser: () => void;
}

export const useUserStore = create<Props>()(
  persist(
    (set) => ({
      userId: null,
      defaultTasteMapId: null,
      setUser: ({ userId, defaultTasteMapId }) =>
        set({ userId, defaultTasteMapId }),
      clearUser: () =>
        set({ userId: null, defaultTasteMapId: null }),
    }),
    {
      name: 'user-store', // localStorage key 이름
    }
  )
);

export default useUserStore;