import { KaokaoResponse } from "@/entities/map/model";
import { create } from "zustand";

interface Props {
  selectedPlace: KaokaoResponse | null;
  setSelectedPlace: (place: KaokaoResponse) => void;
  clearSelectedPlace: () => void;
}

const usePlaceStore = create<Props>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place) => set({selectedPlace: place}),
  clearSelectedPlace: () => set({selectedPlace: null})
}))

export default usePlaceStore;