import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

const SignUpPage = () => {
  return (
    <form onSubmit={} className="w-full h-full flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">이메일(아이디)</label>
        <Input
          placeholder="메일형식으로 입력해주세요."
          value={}
          onChange={(e) => {}}
          id="email"
          className="px-3 py-2.5 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
        ></Input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">닉네임</label>
        <Input
          placeholder="비밀번호를 입력해주세요."
          value={}
          onChange={(e) => {}}
          id="password"
          className="px-3 py-2.5 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
        ></Input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">비밀번호</label>
        <Input
          placeholder="비밀번호를 입력해주세요."
          value={}
          onChange={(e) => {}}
          id="password"
          className="px-3 py-2.5 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
        ></Input>
      </div>
      <Button
        className="w-full bg-brand-primary-600 font-medium text-xl py-5 text-white cursor-pointer rounded-[10px] mt-auto"
        type="submit"
      >
        회원가입
      </Button>
    </form>
  );
};

export default SignUpPage;
