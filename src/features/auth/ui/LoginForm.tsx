"use client";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useLogin } from "@/features/auth/hooks";

const LoginForm = () => {
  const {
    email,
    password,
    // isLoading,
    // isError,
    // error,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin();

  return (
    <form onSubmit={handleLogin} className="w-full h-full flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">이메일(아이디)</label>
        <Input
          placeholder="메일형식으로 입력해주세요."
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
          id="email"
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
        className="w-full bg-brand-primary-600 font-medium text-xl py-5 text-white cursor-pointer rounded-[10px] mt-auto"
        type="submit"
      >
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;
