import { NextRequest, NextResponse } from "next/server";
import { apiURL, getRedisClient } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { SessionData } from "@/entities/auth/model";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseDTO<null> | ErrorResponse>> {
  try {
    // 쿠키에서 sessionId 가져오기
    const sessionId = request.cookies.get("sessionId")?.value;

    console.log("받은 sessionId:", sessionId); // 디버깅용

    // sessionId가 없는 경우
    if (!sessionId) {
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "LOGOUT_FAILED",
        message: "세션 정보를 찾을 수 없습니다.",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse);
    }

    // redis 가져오기
    const redis = getRedisClient();

    // redis에서 세션 데이터 확인
    const sessionData: SessionData | null = await redis.get(sessionId);

    console.log("Redis에서 가져온 세션 데이터:", sessionData); // 디버깅용

    // 세션이 Redis에 없는 경우 (이미 만료되었거나 존재하지 않음)
    if (!sessionData) {
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "LOGOUT_FAILED",
        message: "유효하지 않은 세션입니다.",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse);
    }

    // 세션 데이터 파싱
    const parsedSessionData = sessionData;
    const { accessToken } = parsedSessionData;

    // 백엔드 로그아웃 API 호출
    const response = await fetch(apiURL("/auth/logout"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    // 백엔드 API 호출이 실패해도 세션은 삭제 (클라이언트 측 로그아웃은 진행)
    if (!response.ok) {
      const errorText = await response.text();
      console.log("백엔드 API 에러 응답:", errorText); // 디버깅용
      console.log("백엔드 로그아웃 실패했지만 로컬 세션은 삭제합니다.");
    } else {
      console.log("백엔드 로그아웃 성공");
    }

    // Redis에서 세션 삭제
    await redis.del(sessionId);

    console.log("Redis에서 세션 삭제 완료:", sessionId); // 디버깅용

    // 성공 응답
    const successResponse: ResponseDTO<null> = {
      status: 200,
      message: "로그아웃 성공",
      data: null,
      timestamp: new Date().toISOString(),
    };

    const nextRes = NextResponse.json(successResponse);

    // 쿠키에서 sessionId 제거
    nextRes.cookies.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // 즉시 만료시켜서 삭제
      path: "/",
    });

    console.log("쿠키에서 sessionId 삭제 완료"); // 디버깅용

    return nextRes;
  } catch (error) {
    console.error("Logout error: ", error);

    const errorResponse: ErrorResponse = {
      status: 500,
      name: "SERVER_ERROR",
      message: "서버 내부 오류",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse);
  }
}
