import { clientFetch } from '@/shared/lib'; // 경로는 실제 위치에 맞게 조정
import { ErrorResponse, ResponseDTO } from '@/shared/types/api-structure';
import { LoginCredentials, LoginResponse } from "@/entities/auth/model";

const loginAPI = async (credentials: LoginCredentials): Promise<ResponseDTO<LoginResponse> | ErrorResponse> => {
  return await clientFetch<LoginCredentials, LoginResponse>({
    url: "/api/auth/login",
    method: "POST",
    data: credentials
  });
}

export default loginAPI;