"use client";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useLogin } from "@/features/auth/hooks";

const LoginForm = () => {
  const {
    email,
    password,
    isFormValid,
    isLoading,
    // isError,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLogin();

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">이메일(아이디)</label>
        <Input
          placeholder="메일형식으로 입력해주세요."
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
          id="email"
          type="email"
          className="px-3 py-2.5 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
        ></Input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">비밀번호</label>
        <Input
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          id="password"
          type="password"
          className="px-3 py-2.5 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
        ></Input>
      </div>
      <Button
        className="w-full bg-brand-primary-600 font-medium text-xl py-5 text-white cursor-pointer rounded-[10px] mt-auto disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-400"
        type="submit"
        disabled={isFormValid || isLoading}
      >
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;
