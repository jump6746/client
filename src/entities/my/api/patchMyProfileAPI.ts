import {apiURL, clientFetch} from "@/shared/lib";
import {ErrorResponse, ResponseDTO} from "@/shared/types/api-structure";
import {ProfileUpdateRequest} from "@/entities/my/model";

const patchMyProfileAPI = async (data: ProfileUpdateRequest): Promise<ResponseDTO<null> | ErrorResponse> => {
  return await clientFetch<ProfileUpdateRequest, null>({
    url: apiURL(`/users/me`),
    method: "PATCH",
    data,
  })
}

export default patchMyProfileAPI;