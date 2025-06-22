import { NextRequest, NextResponse } from "next/server";
import { apiURL, getRedisClient } from "@/shared/lib";
import { nanoid } from "nanoid";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { LoginResponse } from "@/entities/auth/model";

export async function POST(request: NextRequest): Promise<NextResponse<ResponseDTO<LoginResponse> | ErrorResponse>> {

  try{
    const { email, password } = await request.json(); 

    console.log('받은 데이터: ', { email, password }); // 디버깅용
    console.log("요청 URL: ", apiURL("/auth/login"));

    const response = await fetch(apiURL("/auth/login"), {
      method: 'POST',
      headers: { "Content-Type" : "application/json", "Accept": "application/json"},
      credentials: "include",
      body: JSON.stringify({email, password})
    });

    console.log('외부 API 응답 상태:', response.status); // 디버깅용

    if(!response.ok){
      const errorText = await response.text();
      console.log('외부 API 에러 응답:', errorText); // 디버깅용

      const errorResponse: ErrorResponse = {
        status: 401,
        name: "LOGIN_FAILED",
        message: "로그인 실패",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, {status: 401});
    }

    const data = await response.json();
    console.log("응답 데이터: ", data);
    const { accessToken } = data.data;
    
    const setCookieHeader = response.headers.get("set-cookie");

    let refreshToken = null;

    if (setCookieHeader) {
      // refreshToken 값만 추출
      const match = setCookieHeader.match(/refreshToken=([^;]+)/);
      refreshToken = match ? match[1] : null;
    }

    console.log("받은 리프레쉬 토큰: ", refreshToken);

    if (!refreshToken) {

      const errorResponse: ErrorResponse = {
        status: 401,
        name: "LOGIN_FAILED",
        message: "리프레쉬 토큰 없음",
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(errorResponse, { status: 401 });
    }
    
    const sessionId = nanoid();

    const redis = getRedisClient();
    const sessionData = {
      accessToken,
      refreshToken
    }
    await redis.setex(sessionId, 60 * 60 * 24 * 7, JSON.stringify(sessionData));

    const loginData = {
      sessionId: sessionId,
      accessToken: accessToken
    }

    const successResponse: ResponseDTO<LoginResponse> = {
      status: 200,
      message: "로그인 성공",
      data: loginData,
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

