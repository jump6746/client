"use client";

import { useCheckNickname, usePatchNickname } from "@/entities/auth/queries";
import { isSuccessResponse } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { customToast } from "@/shared/ui/CustomToast";
import { Input } from "@/shared/ui/Input";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const RegisterNicknamePage = () => {
  const [nickname, setNickName] = useState<string>("");
  const [nicknameCheck, setNickNameCheck] = useState<boolean>(false);

  const checkNicknameMutation = useCheckNickname();
  const patchNicknameMutation = usePatchNickname();

  const handleNickNameCheck = async () => {
    if (!nickname) {
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
      },
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nickname) {
      customToast.error("이메일과 비밀번호를 입력해주세요");
      return;
    }

    const loadingToastId = customToast.loading("닉네임 변경 중...");

    patchNicknameMutation.mutate(
      { nickname },
      {
        onSettled: () => {
          toast.dismiss(loadingToastId);
        },
      }
    );
  };

  return (
    <div className="h-full overflow-auto overscroll-contain">
      <div className="flex flex-col gap-6 px-6 w-full h-full py-8">
        <h1 className="font-bold text-2xl">닉네임 등록</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full flex-1 flex flex-col gap-3"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname">닉네임</label>
            <div className="flex justify-between gap-2">
              <Input
                placeholder="닉네임를 3자 이상 입력해주세요."
                value={nickname}
                onChange={(e) => {
                  setNickName(e.currentTarget.value);
                }}
                id="nickname"
                type="text"
                className="px-2 py-2 flex-1 w-0 min-w-0 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm h-fit"
              ></Input>
              <Button
                className={`font-bold border text-sm shrink-0 ${
                  nicknameCheck
                    ? "border-green-300 text-green-600"
                    : "border-gray-300 text-gray-600"
                } cursor-pointer px-3 py-2.5 disabled:cursor-default`}
                onClick={handleNickNameCheck}
                disabled={
                  nickname.length < 2 || checkNicknameMutation.isPending
                }
                type="button"
              >
                {checkNicknameMutation.isPending
                  ? "확인 중..."
                  : nicknameCheck
                  ? "사용가능"
                  : "중복확인"}
              </Button>
            </div>
            {nickname.length > 0 && nickname.length < 3 ? (
              <span className="text-red-600 text-sm">
                닉네임을 3자 이상 입력해주세요.
              </span>
            ) : null}
          </div>
          <Button
            className="w-full bg-brand-primary-600 font-medium text-xl py-5 text-white cursor-pointer rounded-[10px] mt-auto disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-default"
            type="submit"
            disabled={!nicknameCheck || patchNicknameMutation.isPending}
          >
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterNicknamePage;
