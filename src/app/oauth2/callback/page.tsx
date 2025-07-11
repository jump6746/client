"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OAuthCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/my-info`, {
        credentials: "include", // ✅ 쿠키 포함
      });

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const result = await res.json();
      const user = result.data;

      if (!user.nickname || user.nickname.trim() === "") {
        router.replace("/register/nickname");
      } else {
        router.replace("/home");
      }
    };

    fetchUserInfo();
  }, [router]);

  return <p>로그인 중입니다...</p>;
};

export default OAuthCallbackPage;
