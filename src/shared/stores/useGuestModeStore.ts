import {create} from "zustand";

interface Props {
  isGuestMode: boolean;
  setGuestMode: (value: boolean) => void;
  initGuestMode: () => void;
}

const useGuestModeStore = create<Props>((set) => ({
  isGuestMode: false,

  setGuestMode: (value) => {
    set({isGuestMode: value});
    if (value) {
      localStorage.setItem('isGuestMode', 'true');
    } else {
      localStorage.removeItem('isGuestMode');
    }
  },

  initGuestMode: () => {
    const stored = localStorage.getItem('isGuestMode') === 'true';
    set({isGuestMode: stored});
  }
}));

export default useGuestModeStore;