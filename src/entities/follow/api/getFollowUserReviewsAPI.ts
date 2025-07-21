import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { FollowerReviewsResponse } from "../model";
import { apiURL, clientFetch } from "@/shared/lib";

interface Props {
  viewerId: number;
  sort: "latest" | "distance";
  limit: number;
  cursor?: string;
  userMapx: number;
  userMapy: number;
}

const getFollowerUserReviewAPI = async(params: Props): Promise<ResponseDTO<FollowerReviewsResponse> | ErrorResponse> => {

  return await clientFetch<undefined, FollowerReviewsResponse>({
    url: apiURL(`/users/${params.viewerId}/followings/reviews?sort=${params.sort}&limit=${params.limit}&userMapx=${params.userMapx}&userMapy=${params.userMapy}${params.cursor ? `&cursor=${params.cursor}` : ""}`),
    method: "GET"
  })
}

export default getFollowerUserReviewAPI;