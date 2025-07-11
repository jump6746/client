"use client";

import Image from "next/image";

const OAuthLoginButtons = () => {
  const handleLogin = (provider: "google" | "kakao" | "naver") => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex justify-center items-center gap-4 w-full mt-4">
      {/* Kakao */}
      <button
        onClick={() => handleLogin("kakao")}
        className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center"
      >
        <Image src="/icons/kakao.png" alt="카카오 로그인" width={24} height={24} />
      </button>

      {/* Google */}
      <button
        onClick={() => handleLogin("google")}
        className="w-12 h-12 rounded-full bg-white border flex items-center justify-center"
      >
        <Image src="/icons/google.png" alt="구글 로그인" width={24} height={24} />
      </button>

      {/* Naver */}
      <button
        onClick={() => handleLogin("naver")}
        className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center"
      >
        <Image src="/icons/naver.png" alt="네이버 로그인" width={24} height={24} />
      </button>
    </div>
  );
};

export default OAuthLoginButtons;
