import { NextRequest, NextResponse } from "next/server";
import { apiURL, getRedisClient } from "@/shared/lib";
import { nanoid } from "nanoid";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { LoginResponse } from "@/entities/auth/model";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseDTO<LoginResponse> | ErrorResponse>> {
  try {
    const { email, password } = await request.json();

    console.log("받은 데이터: ", { email, password }); // 디버깅용
    console.log("요청 URL: ", apiURL("/auth/login"));

    const response = await fetch(apiURL("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log("외부 API 응답 상태:", response.status); // 디버깅용

    if (!response.ok) {
      const errorText = await response.text();
      console.log("외부 API 에러 응답:", errorText); // 디버깅용

      const errorResponse: ErrorResponse = {
        status: 401,
        name: "LOGIN_FAILED",
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse);
    }

    const data = await response.json();
    console.log("응답 데이터: ", data);
    const { accessToken } = data.data;

    const setCookieHeader = response.headers.get("set-cookie");

    // refreshToken 받았는지 판별
    let refreshToken = null;

    if (setCookieHeader) {
      // refreshToken 값만 추출
      const match = setCookieHeader.match(/refreshToken=([^;]+)/);
      refreshToken = match ? match[1] : null;
    }

    console.log("받은 리프레쉬 토큰: ", refreshToken);

    // refreshToken 없다면 401 response
    if (!refreshToken) {
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "LOGIN_FAILED",
        message: "리프레쉬 토큰을 전달받지 못했습니다.",
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(errorResponse);
    }

    const sessionId = nanoid();

    // redis 가져오기
    const redis = getRedisClient();

    // redis에 담을 정보
    const sessionData = {
      accessToken,
      refreshToken,
    };

    // redis에 저장
    await redis.setex(sessionId, 60 * 60 * 24, JSON.stringify(sessionData));

    // 로그인시 내려줄 응답
    const loginData = {
      sessionId: sessionId,
      accessToken: accessToken,
    };

    // 성공 200 response
    const successResponse: ResponseDTO<LoginResponse> = {
      status: 200,
      message: "로그인 성공",
      data: loginData,
      timestamp: new Date().toISOString(),
    };

    const nextRes = NextResponse.json(successResponse);

    // 로그인 성공 response 내려줄 때 쿠키에 sessionId 저장
    nextRes.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    // 로그인 성공 후 백엔드에서 받은 refreshToken 쿠키를 즉시 제거
    // nextRes.cookies.set("refreshToken", "", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: "strict",
    //   maxAge: 0, // 즉시 만료시켜서 삭제
    //   path: "/"
    // })

    return nextRes;
  } catch (error) {
    console.error("Login error: ", error);

    const errorResponse: ErrorResponse = {
      status: 500,
      name: "SERVER_ERROR",
      message: "서버 내부 오류",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse);
  }
}
