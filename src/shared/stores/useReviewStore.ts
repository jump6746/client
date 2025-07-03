import { PlaceReivewData } from "@/entities/review/model/review";
import { create } from "zustand";

interface Props {
  reviewData: PlaceReivewData | null;
  setReviewData: (data: PlaceReivewData) => void;
  clearReviewData: () => void;
}

const useReviewStore = create<Props>((set) => ({
  reviewData: null,
  setReviewData: (data) => set({reviewData: data}),
  clearReviewData: () => set({reviewData: null}),
}));

export default useReviewStore;