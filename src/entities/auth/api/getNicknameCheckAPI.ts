import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";

const getNicknameCheckAPI = async (nickname: string): Promise<ResponseDTO<boolean> | ErrorResponse> => {
  return await clientFetch<undefined, boolean>({
    url: apiURL(`/users/check/nickname?nickname=${nickname}`),
    method: "GET"
  });
}

export default getNicknameCheckAPI;