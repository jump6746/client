import { apiURL, clientFetch } from "@/shared/lib"
import { NicknameChangeRequest, NicknameChangeResponse } from "../model"
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure"

const patchNicknameAPI = async (data: NicknameChangeRequest):Promise<ResponseDTO<NicknameChangeResponse> | ErrorResponse> => {
  return await clientFetch<NicknameChangeRequest, NicknameChangeResponse>({
    url: apiURL("/users/change-nickname"),
    method: "PATCH",
    data,
  })
}

export default patchNicknameAPI;