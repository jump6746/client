import {apiURL, clientFetch} from "@/shared/lib";
import {ErrorResponse, ResponseDTO} from "@/shared/types/api-structure";
import {ProfileResponse} from "@/entities/my/model";

const getMyProfileAPI = async (): Promise<ResponseDTO<ProfileResponse> | ErrorResponse> => {
  return await clientFetch<undefined, ProfileResponse>({
    url: apiURL(`/users/profile`),
    method: "GET",
  })
}

export default getMyProfileAPI;