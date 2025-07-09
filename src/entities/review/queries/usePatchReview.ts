import { useMutation } from "@tanstack/react-query"
import { patchReviewAPI } from "../api"

const usePatchReview = () => {
  return useMutation({
    mutationFn: patchReviewAPI,
  });
}

export default usePatchReview;