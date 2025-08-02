// features/auth/model/useLogin.ts
"use client";

import { FormEvent, useEffect, useState } from "react";
import { customToast } from "@/shared/ui/CustomToast";
import usePostLogin from "@/entities/auth/queries/usePostLogin";
import { toast } from "sonner";

const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const loginMutation = usePostLogin();

  useEffect(()=>{
    if(email.length > 5 && password.length > 0){
      setIsFormValid(false);
    }else{
      setIsFormValid(true);
    }
  },[email, password])

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      customToast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const loadingToastId = customToast.loading("로그인 중...");

    loginMutation.mutate({email, password},{
      onSettled: () => {
        toast.dismiss(loadingToastId);
      }
    });
  };

  return {
    email,
    password,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isFormValid,
    setEmail,
    setPassword,
    handleSubmit,
  };
};

export default useLogin;