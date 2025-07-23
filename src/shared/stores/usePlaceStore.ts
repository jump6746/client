import { KakaoResponse } from "@/entities/map/model";
import { create } from "zustand";

interface Props {
  selectedPlace: KakaoResponse | null;
  setSelectedPlace: (place: KakaoResponse) => void;
  clearSelectedPlace: () => void;
}

const usePlaceStore = create<Props>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place) => set({selectedPlace: place}),
  clearSelectedPlace: () => set({selectedPlace: null})
}))

export default usePlaceStore;