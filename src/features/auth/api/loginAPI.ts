import { ResponseDTO } from '@/shared/types/api-structure';
import { LoginCredentials, LoginResponse } from "@/entities/auth/model";

const loginAPI = async (credentials: LoginCredentials):Promise<ResponseDTO<LoginResponse>> => {

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(credentials)
  });

  if(!response.ok){
    const error = await response.json();
    throw new Error(error);
  }

  return response.json();
}

export default loginAPI;