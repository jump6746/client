import { SessionData } from "@/entities/auth/model";
import { getRedisClient } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { NextRequest, NextResponse } from "next/server";

interface RefreshRequest {
  sessionId: string;
}

interface RefreshResponseData {
  accessToken: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ResponseDTO<RefreshResponseData> | ErrorResponse>> {
  try {
    const { sessionId }: RefreshRequest = await request.json()
    
    const redis = getRedisClient()
    const sessionDataStr = await redis.get<string>(sessionId)
    
    if (!sessionDataStr) {
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "INVALID_SESSION",
        message: "유효하지 않은 세션입니다",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    const sessionData: SessionData = JSON.parse(sessionDataStr)
    
    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.refreshToken}`
      }
    })
    
    if (!response.ok) {
      await redis.del(sessionId)
      const errorResponse: ErrorResponse = {
        status: 401,
        name: "REFRESH_FAILED",
        message: "토큰 갱신에 실패했습니다",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    const { accessToken, refreshToken: newRefreshToken } = await response.json()
    
    // 새로운 세션 데이터로 업데이트
    const newSessionData: SessionData = {
      accessToken,
      refreshToken: newRefreshToken || sessionData.refreshToken
    }
    
    await redis.setex(sessionId, 60 * 60 * 24 * 7, JSON.stringify(newSessionData))
    
    const successResponse: ResponseDTO<RefreshResponseData> = {
      status: 200,
      message: "토큰이 성공적으로 갱신되었습니다",
      data: { accessToken },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(successResponse)
    
  } catch (error) {
    console.error('Refresh error:', error)
    
    const errorResponse: ErrorResponse = {
      status: 500,
      name: "SERVER_ERROR",
      message: "서버 내부 오류가 발생했습니다",
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(errorResponse, { status: 500 })
  }
}