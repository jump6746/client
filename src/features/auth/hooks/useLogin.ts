// features/auth/model/useLogin.ts
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAPI } from "@/entities/auth/api";
import { isSuccessResponse } from "@/shared/lib";
import useGuestModeStore from "@/shared/stores/useGuestModeStore";

const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setGuestMode = useGuestModeStore((state) => state.setGuestMode);

  const handleLogin = async (e:FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginAPI({ email, password })

      if(isSuccessResponse(response)){
        const { data } = response;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem("userId", String(data.userId));

        setGuestMode(false);

        // 로그인 확인 화면 필요
        alert("로그인 성공");

        router.push("/home");
      }else{
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem("userId");
    router.push('/login');
  };

  return {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
    logout,
  };
};

export default useLogin;