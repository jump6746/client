import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { SearchUserScorllResponse } from "../model";
import { apiURL, clientFetch } from "@/shared/lib";

interface Props {
  keyword: string;
  limit: number;
  cursor?: string;
}


const getSearchUsersAPI = async ({keyword, limit, cursor}:Props): Promise<ResponseDTO<SearchUserScorllResponse> | ErrorResponse> => {
  return await clientFetch<undefined, SearchUserScorllResponse>({
    url: apiURL(`/users?keyword=${keyword}&limit=${limit}${cursor ? `&cursor=${cursor}` : ""}`),
    method: "GET"
  })
}

export default getSearchUsersAPI;