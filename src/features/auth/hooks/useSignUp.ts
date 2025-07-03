"use client";

import { SignUpRequest, SignUpResponse } from "@/entities/auth/model";
import { apiURL, clientFetch, isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";
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
      customToast.error("이메일을 입력해주세요.");
      setError("이메일을 입력해주세요.");
      return;
    }

    try{
      const response = await clientFetch<undefined, boolean>({
        url: apiURL(`/users/check/email?email=${email}`),
        method: "GET"
      });

      if(isSuccessResponse(response)){

        if(response.data){
          // 이미 존재하는 이메일
          setEmailCheckError(true);
          customToast.error("이미 존재하는 이메일입니다.");
        }else{
          // 사용 가능
          setEmailCheckError(false);
          setEmailCheck(true);
        }
      }else{
        setError(response.message);
      }
    } catch(error){
      customToast.error(error instanceof Error ? error.message : "이메일 중복확인 실패");
      setError(error instanceof Error ? error.message : "이메일 중복확인 실패");
    }
  }

  const handleNickNameCheck = async () => {

    if(!nickname){
      customToast.error("닉네임을 입력해주세요.");
      setError("닉네임을 입력해주세요.");
      return;
    }

    try{
      const response = await clientFetch<undefined, boolean>({
        url: apiURL(`/users/check/nickname?nickname=${nickname}`),
        method: "GET"
      });

      if(isSuccessResponse(response)){
        if(response.data){
          // 이미 존재하는 닉네임
          setNickNameCheckError(true);
          customToast.error("이미 존재하는 닉네임입니다.");
        }else{
          // 사용 가능
          setNickNameCheckError(false);
          setNickNameCheck(true);
        }
      }else{
        customToast.error(response.message);
        setError(response.message);
      }

    } catch(error){
      customToast.error(error instanceof Error ? error.message : "닉네임 중복확인 실패");
      setError(error instanceof Error ? error.message : "닉네임 중복확인 실패");
    }
  }

  const handleSignUp = async (e:FormEvent<HTMLFormElement>) => {
  
    e.preventDefault();
  
    if (!email || !password) {
      customToast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      const signUpData: SignUpRequest = {
        email, 
        nickname,
        password, 
        passwordConfirm, 
        agreements: {
          service: true,
          privacy: true,
          thirdParty: true,
          consignment: true,
          marketing: false
        }
      };

      const response = await clientFetch<SignUpRequest, SignUpResponse>({
        url: '/api/auth/signup',
        method: 'POST',
        data: signUpData,
        credentials: 'same-origin'
      });

      if(isSuccessResponse(response)){
        customToast.success("회원가입에 성공하였습니다.")
        router.push("/login");
      }else{
        customToast.error(response.message);
      }
    } catch (err) {
      customToast.error(err instanceof Error ? err.message : '회원가입에 실패하였습니다.');
      setError(err instanceof Error ? err.message : '회원가입 실패');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if(password.length > 0 && password === passwordConfirm){
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