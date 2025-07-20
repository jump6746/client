import { useLoginInfo } from "@/entities/auth/queries";
import { useInfiniteQuery } from "@tanstack/react-query"
import getFollowerUserReviewAPI from "../api/getFollowUserReviewsAPI";
import { isSuccessResponse } from "@/shared/lib";
import { FollowerReviewsResponse } from "../model";

interface Props {
  sort: "latest" | "distance";
  limit: number;
  userMapx: number;
  userMapy: number;
}

const useGetInfinityUserReview = (params: Props) => {

  const { userInfo } = useLoginInfo();

  return useInfiniteQuery({
    queryKey: ["user-reivew", params.sort, params.userMapx, params.userMapy, userInfo?.userId],
    queryFn: async ({ pageParam }) => {

      const response = await getFollowerUserReviewAPI({
        viewerId: userInfo?.userId ?? 0,
        sort: params.sort,
        limit: params.limit,
        cursor: pageParam,
        userMapx: params.userMapx,
        userMapy: params.userMapy,
      })

      if(isSuccessResponse(response)){

        return response.data
      }else{

        throw new Error(response.message); 
      }
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: FollowerReviewsResponse) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    enabled: !!userInfo
  })
}

export default useGetInfinityUserReview;