import { LoginForm } from "@/features/auth/ui";

const LoginPage = () => {
  return (
    <div className="px-6 flex flex-col gap-6 w-full h-full pb-10 pt-8">
      <h1 className="font-bold text-2xl">로그인</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
