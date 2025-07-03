import { ErrorResponse } from '../types/api-structure';
import { ResponseDTO } from "../types/api-structure";

interface FetchProps <T = undefined, H extends Record<string, string> = Record<string, never>>{
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  credentials? : RequestCredentials;
  data?: T;
  headers?: H;
}

// T = 바디에 넣을 데이터, P = Response 형식, H = 헤더에 추가로 넣을 데이터 타입

const clientFetch = async <T = undefined, P = unknown, H extends Record<string, string> = Record<string, never>>({
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

    // 204 No Content 처리
    if (response.status === 204) {
      return {
        status: 204,
        message: "Success",
        data: null, // 또는 undefined
        timestamp: new Date().toISOString()
      } as ResponseDTO<P>;
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