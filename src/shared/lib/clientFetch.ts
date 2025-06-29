import { ErrorResponse } from '../types/api-structure';
import { ResponseDTO } from "../types/api-structure";

interface FetchProps <T, H extends Record<string, string>>{
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH";
  credentials? : RequestCredentials;
  data?: T;
  headers?: H
}

const clientFetch = async <T, P, H extends Record<string, string>>({
  url,
  method,
  data,
  credentials,
  headers,
}: FetchProps<T, H>):Promise<ResponseDTO<P> | ErrorResponse> => {

  const body = data ? JSON.stringify(data) : null;
  const accessToken = localStorage.getItem("accessToken");
  
  try {

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }

    const mergedHeaders = {...defaultHeaders, ...headers};

    const response = await fetch(url, {
      method,
      headers: mergedHeaders,
      credentials,
      body
    });

    if(!response.ok){

      const responseData: ErrorResponse = await response.json();

      if(responseData.status == 401){
        // refresh 로직
      }

      const error = new Error(responseData.message) as Error & {status: number, name: string}
      error.status = responseData.status;
      error.name = responseData.name;

      throw error;
    }

    const responseData:ResponseDTO<P> = await response.json();

    return responseData;

  }catch(error){

    if(error instanceof Error && "status" in error){
      throw error;
    }

    const networkError: ErrorResponse = {
      status: 500,
      name: "NetworkError",
      message: "예기치 못한 에러가 발생했습니다.",
      timestamp: new Date().toString(),
    }

    throw networkError
  }
}

export default clientFetch;