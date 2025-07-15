import { apiURL, getRedisClient } from "@/shared/lib";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){

  try{
    console.log("OAuth 콜백 처리");

    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;
    const refreshToken = (await cookieStore).get("refreshToken")?.value;  
  
    console.log("토큰 확인", {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    // 2단계: 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!accessToken || !refreshToken) {
      console.log('토큰 없음 랜딩 페이지로 리다이렉트');

      return NextResponse.redirect(new URL('/', request.url));
    }

    const userInfoResponse = await fetch(apiURL("/auth/login/my-info"), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      method: "GET",
    });

    if(!userInfoResponse.ok){
      console.log("사용자 조회 api 실패");
      
      return NextResponse.redirect(new URL("/", request.url));
    }

    const result = await userInfoResponse.json();

    const user = result.data;
    console.log("유저 정보 확인", user.nickname);

    const sessionData = {
      accessToken,
      refreshToken,
    }

    const sessionId = nanoid();
    const redis = getRedisClient();

    await redis.setex(sessionId, 60 * 60 * 24 * 7, JSON.stringify(sessionData));

    let redirectURL = "";

    if(!user.nickname){
      redirectURL = "/register/nickname";
      console.log("첫 사용자, 닉네임 등록 페이지로");
    }else{
      redirectURL = "/home";
      console.log("로그인 완료");
    }

    const response = NextResponse.redirect(new URL(redirectURL, request.url));

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: '/'
    })

    console.log("OAuth 처리 완료");

    return response;
  }catch(error){
    console.error("OAuth 콜백 처리 오류", error);

    return NextResponse.redirect(new URL("/landing", request.url));
  }
}