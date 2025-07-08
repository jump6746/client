import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { SignUpRequest, SignUpResponse } from "../model";
import { clientFetch } from "@/shared/lib";

const signUpAPI = async (data: SignUpRequest): Promise<ResponseDTO<SignUpResponse> | ErrorResponse> => {
  return await clientFetch<SignUpRequest, SignUpResponse>({
    url: '/api/auth/signup',
    method: 'POST',
    data,
    credentials: 'same-origin'
  });
}

export default signUpAPI;