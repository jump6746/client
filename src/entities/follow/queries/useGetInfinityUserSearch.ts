import { useInfiniteQuery } from "@tanstack/react-query";
import getSearchUsersAPI from "../api/getSearchUsersAPI";
import { SearchUserScorllResponse } from "../model";
import { isSuccessResponse } from "@/shared/lib";

interface Props {
  keyword: string;
  limit: number;
}

const useGetInfinityUserSearch = ({keyword, limit }: Props) => {
  return useInfiniteQuery({
    queryKey: ["userSearch", keyword, limit],
    queryFn: async ({ pageParam }) => {
      
      const response = await getSearchUsersAPI({
        keyword,
        limit,
        cursor: pageParam,
      })

      if(isSuccessResponse(response)){

        return response.data
      }else{

        throw new Error(response.message);
      }
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: SearchUserScorllResponse) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    enabled: !!keyword,
  })
}

export default useGetInfinityUserSearch;