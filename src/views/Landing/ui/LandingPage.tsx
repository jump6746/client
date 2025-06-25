import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-3 pt-28 pb-7.5 px-6 h-full w-full">
      <h2 className="font-bold text-2xl flex flex-col mb-3 ml-5">
        <span>음식 고민 끝,</span>
        <span>나만의 맛집을 수집해봐요!</span>
      </h2>
      <section className="flex flex-col items-start py-6 pl-25 w-full bg-sky-50 rounded-xl">
        <span className="font-semibold text-gray-500">다양한 컨셉 별</span>
        <span className="font-bold text-2xl">찐 맛집 탐색</span>
      </section>
      <section className="flex flex-col items-start py-6 pl-25 w-full bg-purple-50 rounded-xl">
        <span className="font-semibold text-gray-500">입맛에 딱 맞는</span>
        <span className="font-bold text-2xl">나만의 맛집 수집</span>
      </section>
      <section className="flex flex-col items-start py-6 pl-25 w-full bg-green-50 rounded-xl">
        <span className="font-semibold text-gray-500">한 눈에 보기 편한</span>
        <span className="font-bold text-2xl">맛집 지도 공유</span>
      </section>
      <section className="flex flex-col mt-auto gap-3 w-full items-center">
        <Link
          href="/"
          className="text-xl py-3 w-full bg-yellow-300 font-medium rounded-xl flex items-center justify-center gap-3"
        >
          <Image src="/icons/kakao.png" alt="카카오톡" width={46} height={46} />
          <span>카카오 계정으로 계속하기</span>
        </Link>
        <Link
          href="/login"
          className="text-xl py-5 w-full bg-brand-primary-600 text-white font-medium rounded-xl flex items-center justify-center"
        >
          아이디로 로그인하기
        </Link>
        <Link
          href="/"
          className="text-xl py-5 w-full border-brand-primary-600 border text-brand-primary-600 font-medium rounded-xl flex items-center justify-center"
        >
          3초만에 회원가입하기
        </Link>
        <Link href="/" className="px-2 border-b py-0.5">
          게스트로 보기
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
