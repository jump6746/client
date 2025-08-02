import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Props {
  isGuestMode: boolean;
  setGuestMode: (value: boolean) => void;
}

const useGuestModeStore = create<Props>()(
  persist(
    (set) => ({
      isGuestMode: true,
      setGuestMode: (value) => set({ isGuestMode: value }),
    }),
    {
      name: 'guest-mode-store', // sessionStorage key
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        }
      }
    }
  )
);

export default useGuestModeStore;
