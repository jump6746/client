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
    passwordCheck,

    isEmailChecking,
    isNicknameChecking,

    setEmail,
    setNickName,
    setPassword,
    setPasswordConfirm,

    handleSignUp,
    handleEmailCheck,
    handleNickNameCheck,
  } = useSignUp();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
            type="email"
            className="px-2 py-2 flex-1 w-0 min-w-0 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm h-fit"
          ></Input>
          <Button
            className={`font-bold border text-sm shrink-0 ${
              emailCheck
                ? "border-green-300 text-green-600"
                : "border-gray-300 text-gray-600"
            } cursor-pointer px-3 py-2.5 disabled:cursor-default`}
            onClick={handleEmailCheck}
            disabled={!emailRegex.test(email) || isEmailChecking}
            type="button"
          >
            {isEmailChecking
              ? "확인 중..."
              : emailCheck
              ? "사용가능"
              : "중복확인"}
          </Button>
        </div>
        {!emailRegex.test(email) && email.length > 2 ? (
          <span className="text-red-600 text-sm">
            이메일 형식으로 입력해주세요.
          </span>
        ) : null}
      </div>
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
            disabled={nickname.length < 2 || isNicknameChecking}
            type="button"
          >
            {isNicknameChecking
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
          className="px-3 py-2 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm h-fit"
        ></Input>
        {password.length > 0 && password.length < 8 ? (
          <span className="text-red-600 text-sm">
            비밀번호를 8자 이상 입력해주세요.
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <Input
          placeholder="비밀번호를 입력해주세요."
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.currentTarget.value);
          }}
          id="passwordConfirm"
          type="password"
          className="px-3 py-2 placeholder:font-bold placeholder:text-gray-400 border border-gray-300 rounded-sm h-fit"
        ></Input>
        {!passwordCheck && passwordConfirm.length > 0 ? (
          <span className="text-red-600 text-sm">
            비밀번호가 일치하지 않습니다.
          </span>
        ) : null}
      </div>
      <Button
        className="w-full bg-brand-primary-600 font-medium text-xl py-5 text-white cursor-pointer rounded-[10px] mt-auto disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-default"
        type="submit"
        disabled={!emailCheck || !nicknameCheck || !passwordCheck}
      >
        회원가입
      </Button>
    </form>
  );
};

export default SignUpForm;
