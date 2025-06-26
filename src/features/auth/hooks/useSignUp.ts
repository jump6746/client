"use client";

import { apiURL } from "@/shared/lib";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const useSignUp = () => {

  const [email, setEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [emailCheckError, setEmailCheckError] = useState<boolean>(false);
  const [nickname, setNickName] = useState<string>("");
  const [nicknameCheck, setNickNameCheck] = useState<boolean>(false);
  const [nicknameCheckError, setNickNameCheckError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailCheck = async () => {

    if(!email){
      setError("이메일을 입력해주세요.");
      return;
    }

    try{

      const response = await fetch(apiURL(`/users/check/email?email=${email}`),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData);
      }

      const { status } = await response.json();

      if(status == 200){

        setEmailCheck(true);

      }else{

        setEmailCheckError(true);
      
      }

    }catch(error){

      setError(error instanceof Error ? error.message : "이메일 중복확인 실패");
    }

  }

  const handleNickNameCheck = async () => {

    if(!nickname){
      setError("닉네임을 입력해주세요.");
      return;
    }

    try{

      const response = await fetch(apiURL(`/users/check/nickname?nickname=${nickname}`),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData);
      }

      const { status } = await response.json();

      if(status == 200){

        setNickNameCheck(true);

      }else{

       setNickNameCheckError(true);
      
      }

    }catch(error){

      setError(error instanceof Error ? error.message : "이메일 중복확인 실패");
    }

  }

  const handleSignUp = async (e:FormEvent<HTMLFormElement>) => {
  
      e.preventDefault();
  
      if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ 
            email, 
            nickname,
            password, 
            passwordConfirm, 
            "agreements": {
              "service": true,
              "privacy": true,
              "thirdParty": true,
              "consignment": true,
            "marketing": false
          }}),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '로그인 실패');
        }
  
        const { status } = await response.json();

        if(status == 201){

          // 로그인 확인 화면 필요
          alert("회원가입 성공");
  
          router.push("/home");
        }
  
        
      } catch (err) {
        setError(err instanceof Error ? err.message : '회원가입 실패');
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {

    if(password === passwordConfirm){
      setPasswordCheck(true);
    }else{
      setPasswordCheck(false);
    }

  },[password, passwordConfirm])

  return {
    email,
    emailCheck,
    emailCheckError,
    nickname,
    nicknameCheck,
    nicknameCheckError,
    password,
    passwordConfirm,
    passwordCheck,
    isLoading,
    error,
    setEmail,
    setEmailCheck,
    setEmailCheckError,
    setNickName,
    setNickNameCheck,
    setNickNameCheckError,
    setPassword,
    setPasswordConfirm,
    setPasswordCheck,
    handleEmailCheck,
    handleNickNameCheck,
    handleSignUp
  };
}

export default useSignUp;