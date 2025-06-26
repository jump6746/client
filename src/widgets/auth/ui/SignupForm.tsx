import { useSignUp } from "@/features/auth/hooks";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

const SignUpForm = () => {
  const {
    email,
    emailCheck,
    nickname,
    nicknameCheck,
    password,
    passwordConfirm,
    setEmail,
    setNickName,
    setPassword,
    setPasswordConfirm,
    handleSignUp,
    handleEmailCheck,
    handleNickNameCheck,
  } = useSignUp();

  return (
    <form onSubmit={handleSignUp} className="w-full h-full flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">이메일(아이디)</label>
        <div className="flex justify-between gap-2">
          <Input
            placeholder="메일형식으로 입력해주세요."
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
            id="email"
            className="px-2 py-2.5 flex-1 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
          ></Input>
          <Button
            className={`font-bold border ${
              emailCheck
                ? "border-green-300 text-green-600"
                : "border-gray-300 text-gray-600"
            } cursor-pointer px-3 py-2.5`}
            onClick={handleEmailCheck}
          >
            {emailCheck ? "사용가능" : "중복확인"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">닉네임</label>
        <div className="flex justify-between gap-2">
          <Input
            placeholder="비밀번호를 입력해주세요."
            value={nickname}
            onChange={(e) => {
              setNickName(e.currentTarget.value);
            }}
            id="password"
            className="px-2 flex-1 py-2.5 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
          ></Input>
          <Button
            className={`font-bold border ${
              nicknameCheck
                ? "border-green-300 text-green-600"
                : "border-gray-300 text-gray-600"
            } cursor-pointer px-3 py-2.5`}
            onClick={handleNickNameCheck}
          >
            {nicknameCheck ? "사용가능" : "중복확인"}
          </Button>
        </div>
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
          className="px-3 py-2.5 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm"
        ></Input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">비밀번호 확인</label>
        <Input
          placeholder="비밀번호를 입력해주세요."
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.currentTarget.value);
          }}
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

export default SignUpForm;
