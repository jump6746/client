import { PlaceReviewThumbnail } from "@/entities/review/model/review";
import { create } from "zustand";

interface Props {
  reviewData: PlaceReviewThumbnail | null;
  setReviewData: (data: PlaceReviewThumbnail) => void;
  clearReviewData: () => void;
}

const useReviewStore = create<Props>((set) => ({
  reviewData: null,
  setReviewData: (data) => set({reviewData: data}),
  clearReviewData: () => set({reviewData: null}),
}));

export default useReviewStore;