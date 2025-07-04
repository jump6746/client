// features/auth/model/useLogin.ts
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAPI } from "@/entities/auth/api";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";
import { useGuestModeStore } from "@/shared/stores";
import { useUserStore } from "@/shared/stores";


const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const router = useRouter();
  const setGuestMode = useGuestModeStore((state) => state.setGuestMode);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(()=>{

    if(email.length > 5 && password.length > 0){
      setIsFormValid(false);
    }else{
      setIsFormValid(true);
    }

  },[email, password])

  const handleLogin = async (e:FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!email || !password) {
      customToast.error("이메일과 비밀번호를 입력해주세요.");
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

        setUser({
          userId: data.userId,
          defaultTasteMapId: data.defaultTasteMapId,
        })

        setGuestMode(false);

        // 로그인 확인 화면 필요
        customToast.success("로그인 성공");

        router.push("/home");
      }else{
        customToast.error(response.message);
      }
    } catch (err) {
      customToast.error(err instanceof Error ? err.message : '로그인 실패');
      setError(err instanceof Error ? err.message : '로그인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sessionId');

    clearUser();

    router.push('/login');
  };

  return {
    email,
    password,
    isLoading,
    error,
    isFormValid,
    setEmail,
    setPassword,
    handleLogin,
    logout,
  };
};

export default useLogin;