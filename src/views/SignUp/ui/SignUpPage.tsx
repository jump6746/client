import SignUpForm from "@/widgets/auth/ui/SignupForm";

const SignUpPage = () => {
  return (
    <div className="px-6 flex flex-col gap-6 w-full h-full py-8">
      <h1 className="font-bold text-2xl">회원가입</h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
