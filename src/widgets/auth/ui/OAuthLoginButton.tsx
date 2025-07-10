"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { getGoogleLoginUrl } from "@/features/auth/api/getGoogleLoginUrl";
import { getKakaoLoginUrl } from "@/features/auth/api/getKakaoLoginUrl";
import { getNaverLoginUrl } from "@/features/auth/api/getNaverLoginUrl";
import customToast from "@/shared/ui/CustomToast/customToast";
import isSuccessResponse from "@/shared/lib/isSuccessResponse";

const OAuthLoginButtons = () => {
  const router = useRouter();

  const handleLogin = async (provider: "google" | "kakao" | "naver") => {
    try {
      let response;

      switch (provider) {
        case "google":
          response = await getGoogleLoginUrl();
          break;
        case "kakao":
          response = await getKakaoLoginUrl();
          break;
        case "naver":
          response = await getNaverLoginUrl();
          break;
      }

      if (isSuccessResponse(response) && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        customToast.error(response.message ?? `${provider} 로그인 URL을 가져오지 못했습니다.`);
      }
    } catch (err) {
      customToast.error(`${provider} 로그인 요청 중 오류가 발생했습니다.`);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={() => handleLogin("google")}
        className="text-xl py-3 w-full bg-white border font-medium rounded-xl flex items-center justify-center gap-3"
      >
        <Image src="/icons/google.png" alt="구글 로그인" width={24} height={24} />
        <span>Google 계정으로 계속하기</span>
      </button>

      <button
        onClick={() => handleLogin("kakao")}
        className="text-xl py-3 w-full bg-yellow-300 font-medium rounded-xl flex items-center justify-center gap-3"
      >
        <Image src="/icons/kakao.png" alt="카카오 로그인" width={24} height={24} />
        <span>카카오 계정으로 계속하기</span>
      </button>

      <button
        onClick={() => handleLogin("naver")}
        className="text-xl py-3 w-full bg-green-600 text-white font-medium rounded-xl flex items-center justify-center gap-3"
      >
        <Image src="/icons/naver.png" alt="네이버 로그인" width={24} height={24} />
        <span>네이버 계정으로 계속하기</span>
      </button>
    </div>
  );
};

export default OAuthLoginButtons;
