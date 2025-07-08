import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewAPI } from "../api";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";
import { useUserStore } from "@/shared/stores";

interface Props {
  id?: string;
}


const useDeleteReview = (params: Props) => {

  const queryClient = useQueryClient();
  const userId = useUserStore(state => state.userId);

  return useMutation({
    mutationFn: deleteReviewAPI,
    onSuccess: (response) => {
      if(isSuccessResponse(response)){

        queryClient.invalidateQueries({
          queryKey: ["taste-map-thumbnail",  params.id , userId]
        });

        customToast.success("리뷰 삭제에 성공했습니다.");
      }else{
        customToast.error(response.message);
      }
    },
    onError: (error) => {
      customToast.error(error instanceof Error ? error.message : "리뷰 삭제에 서버 에러가 발생했습니다.");
    }
  })
}

export default useDeleteReview;