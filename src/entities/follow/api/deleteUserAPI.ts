import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { UserFollowResponse } from "../model";
import { apiURL, clientFetch } from "@/shared/lib";

interface Props {
  targetUserId: number;
}

const deleteUserAPI = async (
  params: Props
): Promise<ResponseDTO<{ resultMessage: string }> | ErrorResponse> => {
  return await clientFetch<undefined, UserFollowResponse>({
    url: apiURL(`/subscriptions/${params.targetUserId}`),
    method: "DELETE",
  });
};

export default deleteUserAPI;
