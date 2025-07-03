import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Props {
  isGuestMode: boolean;
  setGuestMode: (value: boolean) => void;
}

const useGuestModeStore = create<Props>()(
  persist(
    (set) => ({
      isGuestMode: false,
      setGuestMode: (value) => set({ isGuestMode: value }),
    }),
    {
      name: 'guest-mode-store', // localStorage key
    }
  )
);

export default useGuestModeStore;
