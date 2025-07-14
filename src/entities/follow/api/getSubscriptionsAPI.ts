import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { FollowUser } from "../model";
import { apiURL, clientFetch } from "@/shared/lib";

const getSubscriptionsAPI = async (): Promise<ResponseDTO<FollowUser[]> | ErrorResponse> => {
  return await clientFetch<undefined, FollowUser[]>({
    url: apiURL("/subscriptions/me"),
    method: "GET",
  })
}

export default getSubscriptionsAPI;