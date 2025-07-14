import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { UserFollowResponse } from "../model";
import { apiURL, clientFetch } from "@/shared/lib";

interface Props {
  targetUserId: number;
}


const postUserAPI = async (params: Props): Promise<ResponseDTO<UserFollowResponse> | ErrorResponse> => {
  return await clientFetch<undefined, UserFollowResponse>({
    url: apiURL(`/subscriptions/${params.targetUserId}`),
    method: "POST"
  })
}

export default postUserAPI;