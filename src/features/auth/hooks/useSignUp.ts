"use client";

import { SignUpRequest } from "@/entities/auth/model";
import useCheckEmail from "@/entities/auth/queries/useCheckEmail";
import useCheckNickname from "@/entities/auth/queries/useCheckNickname";
import usePostSignUp from "@/entities/auth/queries/usePostSignUp";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const useSignUp = () => {

  const [email, setEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [nickname, setNickName] = useState<string>("");
  const [nicknameCheck, setNickNameCheck] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);

  const checkEmailMutation = useCheckEmail();
  const checkNicknameMutation = useCheckNickname();
  const signUpMutation = usePostSignUp();
 

  const handleEmailCheck = async () => {
    if(!email){
      customToast.error("이메일을 입력해주세요.");
      return;
    }

    checkEmailMutation.mutate(email, {
      onSuccess: (response) => {
        if(isSuccessResponse(response) && !response.data){
          setEmailCheck(true);
        }else{
          setEmailCheck(false);
        }
      }
    })
  }

  const handleNickNameCheck = async () => {

    if(!nickname){
      customToast.error("닉네임을 입력해주세요.");
      return;
    }

    checkNicknameMutation.mutate(nickname, {
      onSuccess: (response) => {
        if (isSuccessResponse(response) && !response.data) {
          setNickNameCheck(true);
        } else {
          setNickNameCheck(false);
        }
      }
    });
  }

  const handleSignUp = async (e:FormEvent<HTMLFormElement>) => {
  
    e.preventDefault();
  
    if (!email || !password) {
      customToast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

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

    const loadingToastId = customToast.loading("회원가입 중...");

    signUpMutation.mutate(signUpData, {
      onSettled: () => {
        toast.dismiss(loadingToastId);
      }
    });
  };

  useEffect(() => {

    if(password.length > 0 && password === passwordConfirm){
      setPasswordCheck(true);
    }else{
      setPasswordCheck(false);
    }

  },[password, passwordConfirm])

  return {
    // State
    email,
    emailCheck,
    nickname,
    nicknameCheck,
    password,
    passwordConfirm,
    passwordCheck,

    // Loading State
    isEmailChecking: checkEmailMutation.isPending,
    isNicknameChecking: checkNicknameMutation.isPending,

    // Setter
    setEmail,  
    setNickName,
    setPassword,  
    setPasswordConfirm,

    // Handlers
    handleEmailCheck,
    handleNickNameCheck,
    handleSignUp
  };
}

export default useSignUp;