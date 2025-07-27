import { useInfiniteQuery } from "@tanstack/react-query";
import getRecommendMapAPI from "../api/getRecommendMapAPI";
import { isSuccessResponse } from "@/shared/lib";
import { InfinityRecommendMap } from "../model";

interface Props {
  limit: number;
  userMapx: number;
  userMapy: number;
}

const useGetInfinityRecommendMap = ({limit, userMapx, userMapy}: Props) => {
  return useInfiniteQuery({
    queryKey: ["recommend-map", userMapx, userMapy],
    queryFn: async ({ pageParam }) => {
      const response = await getRecommendMapAPI({
        limit,
        userMapx,
        userMapy,
        cursor: pageParam
      });

      if(isSuccessResponse(response)){

        return response.data;
      }else{

        throw new Error(response.message);
      }
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: InfinityRecommendMap) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  })
}

export default useGetInfinityRecommendMap;