import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { MyInfoResponse } from "../model";
import { apiURL, clientFetch } from "@/shared/lib";

const postLoginInfoAPI = async (): Promise<ResponseDTO<MyInfoResponse>|ErrorResponse> => {
  return await clientFetch<undefined, MyInfoResponse>({
    url: apiURL("/auth/login/my-info"),
    method: "POST",
  })
}

export default postLoginInfoAPI;