import { useMutation } from "@tanstack/react-query";
import { deleteReviewAPI } from "../api";

const useDeleteReview = () => {
  return useMutation({
    mutationFn: deleteReviewAPI,
  })
}

export default useDeleteReview;