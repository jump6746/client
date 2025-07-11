// /features/user/api/changeNicknameAPI.ts
import { clientFetch } from "@/shared/lib";
import { ResponseDTO, ErrorResponse } from "@/shared/types/api-structure";

interface ChangeNicknameRequest {
  nickname: string;
}

interface ChangeNicknameResponse {
  nickname: string;
}

export const changeNicknameAPI = async (
  data: ChangeNicknameRequest
): Promise<ResponseDTO<ChangeNicknameResponse> | ErrorResponse> => {
  return await clientFetch<ChangeNicknameRequest, ChangeNicknameResponse>({
    url: `/api/v1/users/change-nickname`,
    method: "PATCH",
    data,
  });
};
