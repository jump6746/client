import { useMutation } from "@tanstack/react-query"
import { postReviewAPI } from "../api"

const usePostReview = () => {
  return useMutation({
    mutationFn: postReviewAPI,
  })
}

export default usePostReview;