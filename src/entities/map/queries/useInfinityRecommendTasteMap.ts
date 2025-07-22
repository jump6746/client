import { useInfiniteQuery } from "@tanstack/react-query";
import getRecommendMapAPI from "../api/getRecommendMapAPI";
import { isSuccessResponse } from "@/shared/lib";
import { RecommendTasteMap } from "../model";

interface Props {
  limit: number;
  userMapx: number;
  userMapy: number;
}

const useInfinityRecommendTasteMap = (params: Props) => {

  return useInfiniteQuery({
    queryKey: ["recommend-taste-map", params.userMapx, params.userMapy],
    queryFn: async ({pageParam}) => {

      const response = await getRecommendMapAPI({
        limit: params.limit,
        userMapx: params.userMapx,
        userMapy: params.userMapy,
        cursor: pageParam
      });

      if(isSuccessResponse(response)){
        return response.data
      }else{
        throw new Error(response.message);
      }
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: RecommendTasteMap) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    }
  });
}

export default useInfinityRecommendTasteMap;