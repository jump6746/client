import Link from "next/link";
import GuestButton from "@/views/Landing/ui/GuestButton";
import OAuthLoginButton from "@/widgets/auth/ui/OAuthLoginButton";

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-3 pt-8 pb-7.5 px-6 h-full w-full">
      <h2 className="font-bold text-xl flex flex-col mb-3 ml-5">
        <span>음식 고민 끝,</span>
        <span>나만의 맛집을 수집해봐요!</span>
      </h2>
      <section className="flex flex-col items-start py-4 pl-25 w-full bg-sky-50 rounded-xl">
        <span className="font-semibold text-gray-500 text-sm">
          다양한 컨셉 별
        </span>
        <span className="font-bold text-lg">찐 맛집 탐색</span>
      </section>
      <section className="flex flex-col items-start py-4 pl-25 w-full bg-purple-50 rounded-xl">
        <span className="font-semibold text-gray-500 text-sm">
          입맛에 딱 맞는
        </span>
        <span className="font-bold text-lg">나만의 맛집 수집</span>
      </section>
      <section className="flex flex-col items-start py-4 pl-25 w-full bg-green-50 rounded-xl">
        <span className="font-semibold text-gray-500 text-sm">
          한 눈에 보기 편한
        </span>
        <span className="font-bold text-lg">맛집 지도 공유</span>
      </section>
      <section className="flex flex-col mt-auto gap-3 w-full items-center">
        <section className="w-full max-w-md mx-auto">
          <OAuthLoginButton />
        </section>
        <Link
          href="/login"
          className="py-5 w-full bg-brand-primary-600 text-white font-medium rounded-xl flex items-center justify-center"
        >
          아이디로 로그인하기
        </Link>
        <Link
          href="/signup"
          className="py-5 w-full border border-brand-primary-600 text-brand-primary-600 bg-white font-medium rounded-xl flex items-center justify-center"
        >
          3초만에 회원가입하기
        </Link>
        <GuestButton />
      </section>
    </div>
  );
};

export default LandingPage;
