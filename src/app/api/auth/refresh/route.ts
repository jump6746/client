import { SessionData } from "@/entities/auth/model";
import { apiURL, getRedisClient } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { NextRequest, NextResponse } from "next/server";

interface RefreshResponseData {
  accessToken: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ResponseDTO<RefreshResponseData> | ErrorResponse>> {
  try{

    console.log("토큰 refresh 요청");
    // 쿠키에서 session id 가져오기
    const sessionId = request.cookies.get("sessionId")?.value;
    console.log("SessionID from Cookie: ", sessionId);

    // 쿠키에 session id 미존재시
    if (!sessionId) {
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "SESSION_MISSING",
        message: "세션이 없습니다. 다시 로그인해주세요.",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const redis = getRedisClient();
    const sessionDataStr: SessionData | null = await redis.get(sessionId);
    console.log("SessionDataStr: ", sessionDataStr);

    // Redis에 저장된 session id가 없을시
    if (!sessionDataStr) {
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "INVALID_SESSION",
        message: "유효하지 않은 세션입니다. 다시 로그인해주세요.",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const sessionData: SessionData = sessionDataStr;

    // Redis에서 가져온 refreshToken 확인
    if (!sessionData.refreshToken) {
      await redis.del(sessionId); // 유효하지 않은 세션 삭제
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "REFRESH_TOKEN_MISSING", 
        message: "리프레쉬 토큰이 없습니다. 다시 로그인해주세요.",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    console.log('Redis에서 가져온 refreshToken으로 갱신 요청 중...');

    // 🔥 변경점: Redis에서 가져온 refreshToken을 쿠키로 전송
    const response = await fetch(apiURL(`/auth/refresh-token`), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${sessionData.refreshToken}` // 쿠키로 전송
      },
      credentials: 'include'
    });

    if(!response.ok){
      console.log('refreshToken 갱신 실패, 세션 삭제');
      await redis.del(sessionId); // 실패한 세션 삭제
      
      console.log("response error: ", response.text);
      console.log("response status: ", response.status);
      console.log("response json: ", response.json);

      const errorResponse: ErrorResponse = {
        status: 401,
        name: "REFRESH_FAILED",
        message: "토큰 갱신에 실패했습니다. 다시 로그인해주세요.",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const responseData = await response.json();
    const { accessToken } = responseData.data;

    // 🔥 변경점: 새로운 refreshToken이 백엔드에서 오는지 확인
    const setCookieHeader = response.headers.get("set-cookie");
    let newRefreshToken = sessionData.refreshToken; // 기본값은 기존 토큰
    
    if (setCookieHeader) {
      const match = setCookieHeader.match(/refreshToken=([^;]+)/);
      if (match) {
        newRefreshToken = match[1];
        console.log('새로운 refreshToken 받음');
      }
    }

    // Redis에 새로운 세션 데이터 저장
    const newSessionData: SessionData = {
      accessToken,
      refreshToken: newRefreshToken
    };

    await redis.setex(sessionId, 60 * 60 * 24 * 7, JSON.stringify(newSessionData));
    
    const successResponse: ResponseDTO<RefreshResponseData> = {
      status: 200,
      message: "토큰이 성공적으로 갱신되었습니다",
      data: { accessToken },
      timestamp: new Date().toISOString()
    };
    
    const nextRes = NextResponse.json(successResponse);
    
    // sessionId를 쿠키에 업데이트
    nextRes.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
    
    // refresh 성공 후 쿠키에서 삭제
    // nextRes.cookies.set("refreshToken", "", {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: "strict",
    //     maxAge: 0, // 즉시 만료
    //     path: "/"
    // });
    
    
    return nextRes;

  }catch(error){

    console.error('Refresh error:', error);
    
    const errorResponse: ErrorResponse = {
      status: 500,
      name: "SERVER_ERROR",
      message: "서버 내부 오류가 발생했습니다",
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}