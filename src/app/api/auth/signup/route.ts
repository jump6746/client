import { SignUpResponse } from "@/entities/auth/model";
import { apiURL } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse<ResponseDTO<SignUpResponse>  | ErrorResponse>> {

  try{

    const { email, nickname, password, passwordConfirm, agreements } = await request.json();

    console.log("받은 데이터: ", { email, nickname, password, passwordConfirm, agreements });
    
    const response = await fetch(apiURL("/auth/register"), {
      method: "POST",
      headers: { "Content-Type" : "application/json", "Accept": "application/json"},
      body: JSON.stringify({ email, nickname, password, passwordConfirm, agreements })
    })

    console.log('외부 API 응답 상태:', response.status); // 디버깅용

    if(!response.ok){
      const errorText = await response.text();
      console.log('외부 API 에러 응답:', errorText); // 디버깅용

      const errorResponse: ErrorResponse = {
        status: 401,
        name: "LOGIN_FAILED",
        message: "회원가입 실패",
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(errorResponse, {status: 401});
    }
    
    const data = await response.json();

    const successResponse: ResponseDTO<SignUpResponse> = {
          status: 201,
          message: "회원가입 성공",
          data,
          timestamp: new Date().toISOString()
    };

    return NextResponse.json(successResponse);

  }catch(error){
    console.error("Login error: ", error);
    
    const errorResponse: ErrorResponse = {
      status: 500,
      name: "SERVER_ERROR",
      message: "서버 내부 오류",
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(errorResponse, {status: 500});
  }
}